import { getLayoutProps } from '@/helpers';
import './Editor.module.css';

export function EditorView({ content, dontLimitWidth, columns, layoutOptions, isChild, blockSlug }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const classNames = [...layoutProps.classNames];

    classNames.push(`-columns-${columns}`);

    if (dontLimitWidth) {
        classNames.push('-dont-limit-width');
    }

    return (
        <div
            {...layoutProps.attributes}
            style={layoutProps.styles}
            className={classNames.join(' ')}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
