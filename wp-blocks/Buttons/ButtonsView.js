import styles from './Buttons.module.css';
import { getLayoutProps } from '@/helpers';
import { Button } from './components/Button';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' };

export function ButtonsView({ buttons, align, LinkComponent = 'a', layoutOptions, isChild, blockSlug, getImageProps = null }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug, getImageProps);

    if (align) {
        layoutProps.styles.textAlign = align;
        layoutProps.styles.justifyContent = JUSTIFY[align];
    }

    return (
        <div
            {...layoutProps.attributes}
            style={layoutProps.styles}
            className={[...layoutProps.classNames, styles.buttons].join(' ')}>
            {Array.isArray(buttons) &&
                buttons
                    .filter((button) => button?.link?.url)
                    .map((button) => (
                        <Button key={button.link.url} classNames={styles} LinkComponent={LinkComponent} {...button} />
                    ))}
        </div>
    );
}
