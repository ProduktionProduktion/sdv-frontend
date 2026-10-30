import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './RouteProgress.module.css';

export const RouteProgress = () => {
    const router = useRouter();
    const [state, setState] = useState('idle');

    useEffect(() => {
        let doneTimer;
        const start = (url, { shallow }) => {
            if (shallow) return;
            clearTimeout(doneTimer);
            setState('loading');
            document.documentElement.dataset.navigating = 'true';
        };
        const done = () => {
            delete document.documentElement.dataset.navigating;
            setState('done');
            doneTimer = setTimeout(() => setState('idle'), 300);
        };

        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', done);
        router.events.on('routeChangeError', done);

        return () => {
            clearTimeout(doneTimer);
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', done);
            router.events.off('routeChangeError', done);
        };
    }, [router]);

    return <div className={styles.bar} data-state={state} role="progressbar" aria-hidden={state !== 'loading'} />;
};
