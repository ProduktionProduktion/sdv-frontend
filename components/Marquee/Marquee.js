import styles from './Marquee.module.css';

export const Marquee = ({ children, left = true, duration = 20, pauseOnHover = true }) => {
    const marqueeClasses = [styles.marquee, 'font-mono'];

    if (left) {
        marqueeClasses.push(styles['-left']);
    }

    if (pauseOnHover) {
        marqueeClasses.push(styles['-pauseOnHover']);
    }

    return (
        <div className={marqueeClasses.join(' ')} style={{ '--marquee-duration': `${duration}s` }}>
            <div className={styles.track}>
                <div className={styles.group}>{children}</div>
                <div className={styles.group} aria-hidden="true">
                    {children}
                </div>
            </div>
        </div>
    );
};
