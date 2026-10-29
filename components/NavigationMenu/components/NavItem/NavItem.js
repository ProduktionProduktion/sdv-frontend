import Link from 'next/link';
import styles from './NavItem.module.css';
import { NavMenu } from '../NavMenu';

export function NavItem({ id, path, pathname, label, children, cssClasses }) {
    const isActive = path === pathname;

    const classNames = [...cssClasses, styles.item];

    if (isActive) {
        classNames.push(styles['-active']);
    }

    if (children.length > 0) {
        classNames.push('-has-children');
    }

    return (
        <li key={id} className={classNames.join(' ')}>
            <Link className={styles.link} href={path ?? ''}>
                {label ?? ''}
            </Link>
            {children.length ? <NavMenu items={children} pathname={pathname} /> : null}
        </li>
    );
}
