import { Marquee } from '@/components/Marquee';

export function Header({ title, classNames = {} }) {
    return (
        <>
            <h2 className="visually-hidden">{title}</h2>
            <Marquee left={false} pauseOnHover={false} style={{ marginBottom: 'var(--grid-gutter)' }}>
                <div className={classNames.marqueeItem}>
                    {Array.from({ length: 8 }, (_, i) => (
                        <>
                            <span key={`marquee-${i}-text`}>{title}</span>
                            {/* <span key={`marquee-${i}-arrow`}>{'=>'}</span> */}
                        </>
                    ))}
                </div>
            </Marquee>
        </>
    );
}
