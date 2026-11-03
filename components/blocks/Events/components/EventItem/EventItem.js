const parseDate = (value) => {
    if (!value) return null;
    const compact = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
    const date = compact ? new Date(Date.UTC(compact[1], compact[2] - 1, compact[3])) : new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
};

const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
});

const getDateParts = (date) =>
    Object.fromEntries(
        dateFormatter
            .formatToParts(date)
            .filter(({ type }) => type !== 'literal')
            .map(({ type, value }) => [type, value]),
    );

const getEventButton = (eventLink, eventPermalink, hideButton = true, eventTitle, LinkComponent, props = {}) => {
    if (hideButton || (!eventLink && !eventPermalink)) return null;

    const { className = 'button outline', ...restProps } = props;
    const buttonUrl = eventLink?.url || eventPermalink;
    const buttonProps = {
        href: buttonUrl,
        className,
        ...(eventLink?.target && { target: eventLink.target }),
        ...restProps,
    };

    return <LinkComponent {...buttonProps}>{eventLink?.title || eventTitle || 'Läs mer'}</LinkComponent>;
};

export function EventItem({
    id,
    title,
    link,
    eventPostFields,
    LinkComponent = 'a',
    classNames = { item: 'item', _inner: '_inner' },
}) {
    const { date, shortDescription, eventLink, hideButton } = eventPostFields || {};
    const parsedDate = parseDate(date);
    const dateParts = parsedDate ? getDateParts(parsedDate) : null;
    const EventButton = getEventButton(eventLink, link, hideButton, title, LinkComponent);

    return (
        <article key={id} className={classNames.item}>
            <div className={classNames._inner}>
                {date && (
                    <time className={classNames._date} dateTime={parsedDate?.toISOString().slice(0, 10)}>
                        {dateParts ? (
                            <>
                                <span className={classNames._weekday}>{dateParts.weekday}</span>{' '}
                                <span className={classNames._day}>{dateParts.day}</span>{' '}
                                <span className={classNames._month}>{dateParts.month}</span>{' '}
                                <span className={classNames._year}>{dateParts.year}</span>
                            </>
                        ) : (
                            date
                        )}
                    </time>
                )}
                <h1 className={classNames._title}>{title}</h1>
                {shortDescription && (
                    <div className={classNames._description} dangerouslySetInnerHTML={{ __html: shortDescription }} />
                )}
                {EventButton && <div className={classNames._button}>{EventButton}</div>}
            </div>
        </article>
    );
}
