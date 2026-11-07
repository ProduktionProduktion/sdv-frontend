import { getLayoutProps } from '@/helpers';
import { addClassToTopLevel } from './helpers';

export function TextView({ content, font, layoutOptions, isChild, blockSlug }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const isMono = font === 'mono';
    const classNames = [...layoutProps.classNames, isMono ? '-font-mono' : null].filter(Boolean);
    // Same output as the [mono] shortcode, so the global .font-mono rules apply per element
    const html = isMono ? addClassToTopLevel(content || '', 'font-mono') : content || '';

    return (
        <div
            {...layoutProps.attributes}
            style={layoutProps.styles}
            className={classNames.join(' ')}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
