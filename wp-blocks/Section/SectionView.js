import { getLayoutProps } from '@/helpers';
import styles from './Section.module.css';

export function SectionView({ children, verticalAlignment, layoutOptions, isChild, blockSlug, getImageProps = null }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug, getImageProps);
    const classNames = [...layoutProps.classNames, styles.section, styles[`-align-${verticalAlignment}`]];

    return (
        <section className={classNames.join(' ')} style={layoutProps.styles} {...layoutProps.attributes}>
            {children}
        </section>
    );
}
