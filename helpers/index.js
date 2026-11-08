export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const pascalToKebab = (string) => string.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getViewTitle = (title, siteTitle, parentTitle = null) => {
    if (title) {
        if (parentTitle) {
            return `${decodeHTMLEntities(title)} > ${decodeHTMLEntities(parentTitle)} > ${decodeHTMLEntities(siteTitle)}`;
        }
        return `${decodeHTMLEntities(title)} > ${decodeHTMLEntities(siteTitle)}`;
    }

    return decodeHTMLEntities(siteTitle) || 'SDV';
};

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };

export function decodeHTMLEntities(text) {
    if (typeof document === 'undefined') {
        return (text ?? '').replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
            if (entity[0] === '#') {
                const isHex = entity[1].toLowerCase() === 'x';
                return String.fromCodePoint(parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10));
            }

            return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
        });
    }

    var textArea = document.createElement('textarea');
    textArea.innerHTML = text;

    return textArea.value;
}

export const measureHeight = (element) => {
    const observer = new ResizeObserver(() =>
        element.style.setProperty('--element-height', `${element.offsetHeight}px`),
    );
    observer.observe(element);

    return () => observer.disconnect();
};

export const flattenArray = (array) =>
    array.reduce((a, b) => {
        if (Array.isArray(b)) {
            return a.concat(flattenArray(b));
        }

        return a.concat(b);
    }, []);

// const SPACING_STEP = 0.6667;

export const getLayoutProps = (layoutOptions, isChild = false, blockSlug = null, getImageProps = null) => {
    // console.log(`layoutOptions of ${blockSlug}`, layoutOptions);

    const {
        enableSpacing,
        paddingTop,
        paddingBottom,
        marginTop,
        marginBottom,
        limitWidth,
        fullWidth,
        textColor,
        backgroundColor,
        backgroundImage,
        backgroundSize,
        backgroundPosition,
        backgroundRepeat,
        colWidth,
        colOffset,
        mobileOrder,
        alignSelf,
        sectionId,
        customClasses,
    } = layoutOptions || {};

    let styles = {};
    let attributes = {};
    let classNames = ['m', blockSlug ? `m-${blockSlug}` : null].filter(Boolean);

    if (enableSpacing) {
        styles['--m-padding-top'] = paddingTop;
        styles['--m-padding-bottom'] = paddingBottom;
        styles['--m-margin-top'] = marginTop;
        styles['--m-margin-bottom'] = marginBottom;
    }

    if (textColor) {
        styles['--m-text-color'] = textColor;
    }

    if (backgroundColor) {
        styles['--m-background-color'] = backgroundColor;
    }

    if (backgroundImage) {
        styles['--m-background-image'] = getBackgroundImageValue(backgroundImage, getImageProps);

        if (backgroundSize) {
            styles['--m-background-image-size'] = backgroundSize;
        }

        if (backgroundPosition) {
            styles['--m-background-image-position'] = backgroundPosition;
        }

        if (backgroundRepeat) {
            styles['--m-background-image-repeat'] = backgroundRepeat;
        }
    }

    if (isChild) {
        classNames.push('-col');

        if (colWidth) {
            classNames.push(`-col-${colWidth}`);
        }

        if (colOffset && colOffset !== '0') {
            classNames.push(`-offset-${colOffset}`);
        }

        if (alignSelf) {
            classNames.push(`-align-self-${alignSelf}`);
        }

        if (mobileOrder) {
            styles['--m-mobile-order'] = mobileOrder;
        }
    }

    if (limitWidth) {
        classNames.push('-limit-width');
    }

    if (fullWidth) {
        classNames.push('-full-width');
    }

    if (customClasses) {
        classNames = [...classNames, ...customClasses.split(' ')];
    }

    if (sectionId) {
        attributes['id'] = sectionId;
    }

    return {
        attributes,
        classNames: classNames.filter(Boolean),
        styles,
    };
};

/**
 * With next/image's getImageProps injected (Next.js) → optimized image-set().
 * Without it (CMS bundle) → plain url().
 */
export const getBackgroundImageValue = (image, getImageProps = null) => {
    const { sourceUrl, mediaDetails } = image || {};

    if (!sourceUrl) {
        return 'none';
    }

    if (!getImageProps) {
        return `url("${sourceUrl}")`;
    }

    // No `sizes` → srcSet uses 1x/2x descriptors, which is what image-set() accepts.
    const width = Math.min(mediaDetails?.width || 1920, 1920);
    const height = mediaDetails?.width ? Math.round((width / mediaDetails.width) * mediaDetails.height) : 1080;
    const {
        props: { srcSet, src },
    } = getImageProps({ alt: '', width, height, src: sourceUrl, quality: 75 });

    return srcSet ? getBackgroundImage(srcSet) : `url("${src}")`;
};

export const getBackgroundImage = (srcSet = '') => {
    const imageSet = srcSet
        .split(', ')
        .map((str) => {
            const [url, dpi] = str.split(' ');
            return `url("${url}") ${dpi}`;
        })
        .join(', ');

    return `image-set(${imageSet})`;
};
