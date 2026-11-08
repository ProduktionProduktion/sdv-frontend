import { getLayoutProps } from '@/helpers';

export function GroupView({ children, layoutOptions, isChild, blockSlug, getImageProps = null }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug, getImageProps);

    return (
        <div className={layoutProps.classNames.join(' ')} style={layoutProps.styles} {...layoutProps.attributes}>
            {children}
        </div>
    );
}
