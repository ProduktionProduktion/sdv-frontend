import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@/components/Loading';

const SHOW_DELAY = 1000;

export const RouteProgress = () => {
    const router = useRouter();
    const [state, setState] = useState('idle');

    useEffect(() => {
        let showTimer, doneTimer;
        let shown = false;
        let clicked = null,
            clickedAt = 0,
            pendingLink = null;

        // Capture phase so it runs before next/link calls preventDefault
        const onClick = (e) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target.closest?.('a[href]');
            if (!a || (a.target && a.target !== '_self') || a.origin !== location.origin) return;
            clicked = a;
            clickedAt = performance.now();
        };

        const clearLink = () => {
            pendingLink?.removeAttribute('data-pending');
            pendingLink = null;
        };

        const start = (url, { shallow }) => {
            if (shallow) return;
            clearTimeout(doneTimer);
            clearTimeout(showTimer);
            document.documentElement.dataset.navigating = 'true';

            clearLink();

            if (clicked && performance.now() - clickedAt < 1000) {
                pendingLink = clicked;
                pendingLink.setAttribute('data-pending', '');
            }
            clicked = null;

            showTimer = setTimeout(() => {
                shown = true;
                setState('loading');
            }, SHOW_DELAY);
        };

        const done = () => {
            clearTimeout(showTimer);
            delete document.documentElement.dataset.navigating;
            clearLink();

            if (!shown) return; // finished within 100ms: bar never appears

            shown = false;
            setState('done');
            doneTimer = setTimeout(() => setState('idle'), 300);
        };

        document.addEventListener('click', onClick, true);
        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', done);
        router.events.on('routeChangeError', done);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(doneTimer);
            clearLink();
            document.removeEventListener('click', onClick, true);
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', done);
            router.events.off('routeChangeError', done);
        };
    }, [router]);

    return <Loading data-state={state} role="progressbar" aria-hidden={state !== 'loading'} />;
};
