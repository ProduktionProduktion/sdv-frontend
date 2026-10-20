export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const SPACING_STEP = 0.6667;

export const getLayoutProps = (layoutOptions, isColumn = false, blockSlug=null ) => {
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
        customClasses
    } = layoutOptions || {};
    
    let styles = {};
    let attributes = {};
    let classNames = [
        'm',
        blockSlug ? `m-${blockSlug}` : null,
    ].filter(Boolean);
    
    if (enableSpacing) {
        styles['--m-padding-top'] = `${paddingTop * SPACING_STEP}rem`;
        styles['--m-padding-bottom'] = `${paddingBottom * SPACING_STEP}rem`;
        styles['--m-margin-top'] = `${marginTop * SPACING_STEP}rem`;
        styles['--m-margin-bottom'] = `${marginBottom * SPACING_STEP}rem`;
    }

    if (textColor) {
        styles['--m-text-color'] = textColor;
    }

    if (backgroundColor) {
        styles['--m-background-color'] = backgroundColor;
    }
    
    if (backgroundImage) {
        styles['--m-background-image'] = `url(${backgroundImage})`;

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

    if (isColumn) {
        classNames.push('-column');

        if (colWidth) {
            classNames.push(`-col-width-${colWidth}`);
        }

        if (colOffset) {
            classNames.push(`-col-offset-${colOffset}`);
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
        classNames = [
            ...classNames,
            ...customClasses.split(' ')
        ];
    }

    if (sectionId) {
        attributes['id'] = sectionId;
    }
    
    return {
        attributes,
        classNames: classNames.filter(Boolean),
        styles,
    };
}