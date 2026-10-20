import { getLayoutProps } from '../../../helpers';

export function SectionView({ children, verticalAlignment, layoutOptions, ...props }) {
  const layoutProps = getLayoutProps(layoutOptions || {});
  const classNames = [...layoutProps.classNames, `-align-${verticalAlignment}`];

  console.log('Section children:', children);

  return (
    <section className={classNames.join(' ')} style={layoutProps.styles} {...layoutProps.attributes}>{children}</section>
  );
}