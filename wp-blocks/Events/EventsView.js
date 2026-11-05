import styles from './Events.module.css';
import { getLayoutProps } from '@/helpers';
import { EventItem } from './components/EventItem';
import { Header } from './components/Header';

export function EventsView({ events, displayUpcoming, customHeading, blockSlug, isChild, layoutOptions }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const classNames = [styles.events, ...layoutProps.classNames];
    const eventNodes = events?.nodes ?? [];

    if (!eventNodes.length) {
        return null;
    }

    if (displayUpcoming) {
        classNames.push(styles.displayUpcoming);
    }

    const heading = displayUpcoming ? 'Kommande evenemang' : 'Evenemang';

    return (
        <div {...layoutProps.attributes} className={classNames.join(' ')} style={layoutProps.styles}>
            <Header heading={heading} customHeading={customHeading} classNames={styles} />
            <div className={styles.scroller}>
                <div className={styles.scrollerInner}>
                    {eventNodes.map((event) => (
                        <EventItem
                            key={event.id}
                            classNames={{ ...styles, item: `${styles.item} -col -col-4` }}
                            {...event}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
