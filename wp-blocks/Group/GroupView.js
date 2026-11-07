import { getLayoutProps } from '@/helpers';

export function GroupView({ children, layoutOptions, isChild, blockSlug }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);

    console.log('GroupView', { layoutOptions, isChild, blockSlug, layoutProps });

    return (
        <div className={layoutProps.classNames.join(' ')} style={layoutProps.styles} {...layoutProps.attributes}>
            {children}
        </div>
    );
}
