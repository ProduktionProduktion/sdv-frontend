import styles from './Events.module.css';
import { getLayoutProps } from '@/helpers';
import { EventItem } from './components/EventItem';
import { Header } from './components/Header';

export function EventsView({ events, displayUpcoming, customHeading, blockSlug, isChild, layoutOptions }) {
    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const classNames = [...layoutProps.classNames, styles.events];
    const eventNodes = events?.nodes ?? [];

    if (!eventNodes.length) {
        return null;
    }

    if (displayUpcoming) {
        classNames.push(styles.displayUpcoming);
    }

    const title = customHeading || (displayUpcoming ? 'Kommande evenemang' : 'Evenemang');

    return (
        <div {...layoutProps.attributes} className={classNames.join(' ')} style={layoutProps.styles}>
            <Header title={title} classNames={styles} />
            <div className="">
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
        </div>
    );
}
