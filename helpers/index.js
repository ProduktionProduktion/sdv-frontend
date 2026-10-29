export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const pascalToKebab = (string) => string.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const flattenArray = (array) =>
    array.reduce((a, b) => {
        if (Array.isArray(b)) {
            return a.concat(flattenArray(b));
        }

        return a.concat(b);
    }, []);

// const SPACING_STEP = 0.6667;

export const getLayoutProps = (layoutOptions, isChild = false, blockSlug = null) => {
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
        const { sourceUrl } = backgroundImage;

        styles['--m-background-image'] = `url('${sourceUrl}')`;

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
