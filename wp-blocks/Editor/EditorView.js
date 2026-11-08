import { getLayoutProps } from '@/helpers';
import { processNotes } from './helpers';
import styles from './Editor.module.css';

export function EditorView({ content: rawContent, dontLimitWidth, columns, align, layoutOptions, isChild, blockSlug, getImageProps = null }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug, getImageProps);
    const classNames = [...layoutProps.classNames];
    const innerClassNames = [styles._inner];
    const { hasNotes, content } = processNotes(rawContent);
    classNames.push(`-columns-${columns}`);

    if (hasNotes) {
        classNames.push('-has-notes');
    }

    if (dontLimitWidth) {
        classNames.push('-dont-limit-width');
    }

    if (!dontLimitWidth && columns !== 1) {
        classNames.push('grid');
        innerClassNames.push('-col', '-col-10', '-offset-2', '-col-md-7', '-offset-md-3');
    }

    if (['center', 'right'].includes(align) && !dontLimitWidth && columns === 1) {
        innerClassNames.push(`-${align}`);
    }
    return (
        <div {...layoutProps.attributes} style={layoutProps.styles} className={classNames.join(' ')}>
            <div className={innerClassNames.join(' ')} dangerouslySetInnerHTML={{ __html: content || '' }} />
        </div>
    );
}
