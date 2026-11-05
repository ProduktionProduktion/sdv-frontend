import { getLayoutProps } from '@/helpers';
// import styles from './Heading.module.css';

export function HeadingView({ align, customSize, heading, tag, layoutOptions, isChild, blockSlug }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);

    const Tag = tag ? `${tag}` : `${h2}`;
    let classNames = [...layoutProps.classNames];

    if (align) {
        classNames.push(`-${align}`);
    }

    if (customSize) {
        classNames.push(`-${customSize}`);
    }

    return (
        <Tag
            {...layoutProps.attributes}
            style={layoutProps.styles}
            className={classNames.join(' ')}
            dangerouslySetInnerHTML={{ __html: heading }}
        />
    );
}
