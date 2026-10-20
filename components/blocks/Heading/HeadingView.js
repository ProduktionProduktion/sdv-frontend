import styles from './Heading.module.css';
import { getLayoutProps } from '../../../helpers';

export function HeadingView({ align, customSize, heading, tag, layoutOptions }) {
  const layoutProps = getLayoutProps(layoutOptions || {});

  const Tag = tag ? `${tag}` : `${h2}`;
  let classNames = [...layoutProps.classNames, styles.red];

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