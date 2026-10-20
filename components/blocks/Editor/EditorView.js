import { getLayoutProps } from '../../../helpers';

export function EditorView({ content, dontLimitWidth, columns, layoutOptions }) {
  const layoutProps = getLayoutProps(layoutOptions || {});

  const classNames = [...layoutProps.classNames];

  classNames.push(`-columns-${columns}`);
  
  if (dontLimitWidth) {
    classNames.push('-dont-limit-width');
  }
  
  return (
    <div {...layoutProps.attributes} style={layoutProps.styles} className={classNames.join(' ')} dangerouslySetInnerHTML={{ __html: content }} />
  );
}