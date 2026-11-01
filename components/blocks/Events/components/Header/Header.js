import { Marquee } from '@/components/Marquee';

export function Header({ title, classNames = {} }) {
    const repeat = Math.ceil(144 / title.length);
    const duration = repeat * 1.5;

    return (
        <>
            <h2 className="visually-hidden">{title}</h2>
            <Marquee
                left={false}
                pauseOnHover={false}
                style={{ marginBottom: 'var(--grid-gutter)', '--marquee-duration': `${duration}s` }}>
                <div className={classNames.marqueeItem}>
                    {Array.from({ length: repeat }, (_, i) => (
                        <span key={`marquee-${i}-text`}>{title}</span>
                    ))}
                </div>
            </Marquee>
        </>
    );
}
