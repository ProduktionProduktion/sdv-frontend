import styles from './Loading.module.css';

export const Loading = ({ children = 'Loading', ...props }) => {
    return (
        <span className={`${styles.loadingSpinner} font-mono`} {...props}>
            {children}
        </span>
    );
};
