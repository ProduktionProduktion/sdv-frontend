import styles from './NavMenu.module.css';
import {NavItem} from '../NavItem';

export function NavMenu({items, pathname}) {
    return (
        <ul className={styles.navMenu}>
            {items.map((item) => (
                <NavItem key={item.id} {...item} pathname={pathname} />
            ))}
        </ul>
    );
}
