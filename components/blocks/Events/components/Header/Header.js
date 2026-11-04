import { Marquee } from '@/components/Marquee';

export function Header({ customHeading, heading, classNames = {} }) {
    const repeat = Math.ceil(144 / (customHeading?.length || heading?.length));
    const duration = repeat * 1.5;
    const displayHeading = customHeading || heading;

    return (
        <>
            <h2 className="visually-hidden">{heading}</h2>
            <Marquee
                left={false}
                pauseOnHover={false}
                style={{ marginBottom: 'var(--grid-gutter)', '--marquee-duration': `${duration}s` }}>
                <div className={classNames.marqueeItem}>
                    {Array.from({ length: repeat }, (_, i) => (
                        <span key={`marquee-${i}-text`}>{displayHeading}</span>
                    ))}
                </div>
            </Marquee>
        </>
    );
}
