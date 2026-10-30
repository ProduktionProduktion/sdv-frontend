import { getLayoutProps } from '../../../helpers';

export function HeadingView({ align, customSize, heading, tag, layoutOptions, isChild, blockSlug }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);

    const Tag = tag || 'h2';
    let classNames = [...layoutProps.classNames];

    if (align) {
        classNames.push(`-${align}`);
    }

    if (customSize) {
        classNames.push(`-${customSize}`);
    }

    return (
        <Tag {...layoutProps.attributes} style={layoutProps.styles} className={classNames.join(' ')}>
            {heading}
        </Tag>
    );
}
