import styles from './Sidebar.module.css';

export const Sidebar = ({ children, fade = false, extraClassNames = [] }) => {
    const classNames = [styles.sidebar, 'font-mono', ...extraClassNames];

    if (fade) {
        classNames.push(styles.fade);
    }

    return (
        <aside className={classNames.join(' ')}>
            <span className={styles._inner}>{children}</span>
        </aside>
    );
};
