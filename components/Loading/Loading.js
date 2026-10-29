import styles from './Loading.module.css';

export const Loading = ({ text = '' }) => {
    return <span className={`${styles.loadingSpinner} font-mono`}>{text}</span>;
};
