import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './LiteEmbed.module.css';

const YOUTUBE_REGEX = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
const VIMEO_REGEX =
    /^https?:\/\/(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|album\/\d+\/video\/|video\/)?(\d+)(?:\/([\da-f]+))?(?:[/?#]|$)/i;
const IGNORED_YOUTUBE_PARAMS = ['v', 'si', 'feature', 'list', 'index'];

const PROVIDERS = {
    youtube: {
        origins: ['https://www.youtube-nocookie.com', 'https://www.google.com', 'https://i.ytimg.com'],
        // rel=0 only limits end screen suggestions to the same channel, so the player is also reset on end
        defaultParams: { rel: '0', iv_load_policy: '3', playsinline: '1' },
        backgroundParams: (id) => ({
            autoplay: '1',
            mute: '1',
            loop: '1',
            playlist: id,
            controls: '0',
            playsinline: '1',
        }),
        loopParams: (id) => ({ loop: '1', playlist: id }),
        embedUrl: (id, params) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`,
        thumbnailUrl: (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`,
    },
    vimeo: {
        origins: ['https://player.vimeo.com', 'https://i.vimeocdn.com', 'https://f.vimeocdn.com'],
        // vimeo_logo=0 requires a paid plan on the video owner's account
        defaultParams: { dnt: '1', title: '0', byline: '0', portrait: '0', badge: '0', vimeo_logo: '0' },
        backgroundParams: () => ({ background: '1' }),
        loopParams: () => ({ loop: '1' }),
        embedUrl: (id, params) => `https://player.vimeo.com/video/${encodeURIComponent(id)}?${params}`,
        thumbnailUrl: null,
    },
};

/**
 * Parse a YouTube or Vimeo URL into { provider, videoId, params }
 */
export const parseVideoUrl = (url) => {
    if (!url) {
        return null;
    }

    let search;

    try {
        search = new URL(url).searchParams;
    } catch {
        return null;
    }

    const youtubeMatch = /youtu(\.be|be\.com|be-nocookie\.com)/.test(url) && url.match(YOUTUBE_REGEX);

    if (youtubeMatch?.[8]?.length === 11) {
        const params = Object.fromEntries(
            [...search.entries()].filter(([key]) => !IGNORED_YOUTUBE_PARAMS.includes(key)),
        );

        if (params.t && !params.start) {
            params.start = String(parseInt(params.t, 10) || 0);
        }

        delete params.t;

        return { provider: 'youtube', videoId: youtubeMatch[8], params };
    }

    const vimeoMatch = url.match(VIMEO_REGEX);

    if (vimeoMatch) {
        const hash = vimeoMatch[2] ?? search.get('h');

        return { provider: 'vimeo', videoId: vimeoMatch[1], params: hash ? { h: hash } : {} };
    }

    return null;
};

const warmedOrigins = new Set();

const warmConnections = (provider) => {
    PROVIDERS[provider].origins
        .filter((origin) => !warmedOrigins.has(origin))
        .forEach((origin) => {
            warmedOrigins.add(origin);
            document.head.append(Object.assign(document.createElement('link'), { rel: 'preconnect', href: origin }));
        });
};

let youTubeApiPromise = null;

const loadYouTubeApi = () =>
    (youTubeApiPromise ??= new Promise((resolve, reject) => {
        if (window.YT?.Player) {
            return resolve(window.YT);
        }

        const previousCallback = window.onYouTubeIframeAPIReady;

        window.onYouTubeIframeAPIReady = () => {
            previousCallback?.();
            resolve(window.YT);
        };

        document.head.append(
            Object.assign(document.createElement('script'), {
                src: 'https://www.youtube.com/iframe_api',
                async: true,
                onerror: (error) => {
                    youTubeApiPromise = null;
                    reject(error);
                },
            }),
        );
    }));

const VIMEO_ORIGIN = 'https://player.vimeo.com';

const parseMessage = (data) => {
    try {
        return typeof data === 'string' ? JSON.parse(data) : (data ?? {});
    } catch {
        return {};
    }
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (callback) => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    mediaQuery.addEventListener('change', callback);

    return () => mediaQuery.removeEventListener('change', callback);
};

const usePrefersReducedMotion = () =>
    useSyncExternalStore(
        subscribeReducedMotion,
        () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
        () => false,
    );

/**
 * A lightweight YouTube/Vimeo embed, inspired by lite-youtube-embed & lite-vimeo-embed.
 * Renders a poster + play button and only loads the player iframe on interaction.
 *
 * With `autoplay`, the facade is skipped and a muted, looping background player is loaded
 * once the element is near the viewport (unless the user prefers reduced motion).
 *
 * When a (non looping) video ends, the player is removed and the poster is shown again,
 * hiding the providers' end screens (e.g. YouTube's recommended videos).
 */
export function LiteEmbed({
    provider,
    videoId,
    params = {},
    title = 'Video',
    playLabel = 'Spela upp video',
    poster = null,
    autoplay = false,
    loop = false,
    aspectRatio = null,
    sizes = '100vw',
    className = '',
    style = {},
    imgComponent: ImgComponent = 'img',
}) {
    const config = PROVIDERS[provider];
    const rootRef = useRef(null);
    const playerRef = useRef(null);
    const iframeRef = useRef(null);
    const playButtonRef = useRef(null);
    const endedRef = useRef(false);
    const [mode, setMode] = useState('idle'); // idle | iframe | api
    const [thumbnail, setThumbnail] = useState(null);
    const reducedMotion = usePrefersReducedMotion();
    const background = autoplay && !reducedMotion;

    const searchParams = new URLSearchParams({
        ...config?.defaultParams,
        ...(loop && config?.loopParams(videoId)),
        ...params,
        ...(background ? config?.backgroundParams(videoId) : { autoplay: '1', playsinline: '1' }),
    });
    const embedUrl = config?.embedUrl(videoId, searchParams);
    const posterSrc = poster?.src ?? config?.thumbnailUrl?.(videoId) ?? thumbnail;
    const PosterComponent = poster?.src ? ImgComponent : 'img';

    // Vimeo has no predictable thumbnail URL, fall back to oEmbed when no poster was provided
    useEffect(() => {
        if (provider !== 'vimeo' || poster?.src || !videoId) {
            return;
        }

        const controller = new AbortController();
        const videoUrl = `https://vimeo.com/${videoId}${params.h ? `/${params.h}` : ''}`;

        fetch(`https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(videoUrl)}`, {
            signal: controller.signal,
        })
            .then((response) => (response.ok ? response.json() : null))
            .then((data) => data?.thumbnail_url && setThumbnail(data.thumbnail_url))
            .catch(() => null);

        return () => controller.abort();
    }, [provider, videoId, poster?.src, params.h]);

    // Background (autoplay) mode: load the player once near the viewport
    useEffect(() => {
        if (!background || mode !== 'idle') {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    setMode('iframe');
                }
            },
            { rootMargin: '200px' },
        );

        observer.observe(rootRef.current);

        return () => observer.disconnect();
    }, [background, mode]);

    // Move focus into the player after the user activated it, and back to the play button once it ended
    useEffect(() => {
        if (mode === 'iframe' && !background) {
            iframeRef.current?.focus();
        }

        if (mode === 'idle' && endedRef.current) {
            endedRef.current = false;
            playButtonRef.current?.focus({ preventScroll: true });
        }
    }, [mode, background]);

    // Vimeo: listen for the end of the video through the player's postMessage API
    useEffect(() => {
        if (provider !== 'vimeo' || mode !== 'iframe' || background || loop) {
            return;
        }

        const iframe = iframeRef.current;
        const onMessage = ({ origin, source, data }) => {
            if (origin !== VIMEO_ORIGIN || source !== iframe?.contentWindow) {
                return;
            }

            const { event } = parseMessage(data);

            if (event === 'ready') {
                iframe.contentWindow.postMessage({ method: 'addEventListener', value: 'ended' }, VIMEO_ORIGIN);
            } else if (event === 'ended') {
                endedRef.current = true;
                setMode('idle');
            }
        };

        window.addEventListener('message', onMessage);

        return () => window.removeEventListener('message', onMessage);
    }, [provider, mode, background, loop]);

    // YouTube: IFrame API player, so playback can start on Safari/mobile (where the click gesture is lost
    // when the iframe loads, and autoplay=1 is ignored) and so the end of the video can be detected
    useEffect(() => {
        if (mode !== 'api') {
            return;
        }

        let player = null;
        let cancelled = false;

        loadYouTubeApi()
            .then((YT) => {
                if (cancelled) {
                    return;
                }

                player = new YT.Player(playerRef.current.appendChild(document.createElement('div')), {
                    host: 'https://www.youtube-nocookie.com',
                    videoId,
                    playerVars: Object.fromEntries(searchParams),
                    events: {
                        onReady: ({ target }) => target.playVideo(),
                        onStateChange: ({ data }) => {
                            if (data === YT.PlayerState.ENDED && !loop) {
                                endedRef.current = true;
                                setMode('idle');
                            }
                        },
                    },
                });
            })
            .catch(() => !cancelled && setMode('iframe'));

        return () => {
            cancelled = true;
            player?.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, videoId]);

    if (!config || !videoId) {
        return null;
    }

    const warm = () => warmConnections(provider);
    const activate = () => {
        warm();
        setMode(provider === 'youtube' ? 'api' : 'iframe');
    };

    const classNames = [styles.liteEmbed, mode !== 'idle' && styles.activated, className].filter(Boolean).join(' ');

    return (
        <div
            ref={rootRef}
            className={classNames}
            style={{ ...(aspectRatio && { '--lite-embed-aspect-ratio': aspectRatio }), ...style }}
            data-provider={provider}
            onPointerOver={warm}
            onFocus={warm}>
            {posterSrc && (
                <PosterComponent
                    className={styles.poster}
                    src={posterSrc}
                    alt={poster?.alt ?? ''}
                    width={poster?.width ?? 1280}
                    height={poster?.height ?? 720}
                    sizes={sizes}
                    loading="lazy"
                    decoding="async"
                />
            )}
            {mode === 'idle' && !background && (
                <button ref={playButtonRef} type="button" className={styles.playButton} onClick={activate}>
                    <span className="visually-hidden">{`${playLabel}: ${title}`}</span>
                </button>
            )}
            {mode === 'iframe' && (
                <iframe
                    ref={iframeRef}
                    className={styles.player}
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    {...(background && { tabIndex: -1 })}
                />
            )}
            {mode === 'api' && <div ref={playerRef} className={styles.player} />}
            <noscript>
                <iframe
                    className={styles.player}
                    src={config.embedUrl(videoId, new URLSearchParams({ ...config.defaultParams, ...params }))}
                    title={title}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </noscript>
        </div>
    );
}
