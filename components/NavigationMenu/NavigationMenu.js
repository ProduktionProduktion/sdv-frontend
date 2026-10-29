import {gql} from '@apollo/client';
import {flatListToHierarchical} from '@faustwp/core';
import {usePathname} from 'next/navigation';
import styles from './NavigationMenu.module.css';
import {NavMenu} from './components/NavMenu';

export default function NavigationMenu({menuItems, className}) {
    const pathname = usePathname();
    const trailingSlashedPathname = pathname.replace(/\/?$/, '/');

    if (!menuItems) {
        return null;
    }

    // Based on https://www.wpgraphql.com/docs/menus/#hierarchical-data
    const hierarchicalMenuItems = flatListToHierarchical(menuItems);

    return (
        <nav className={styles.nav} role="navigation" aria-label={`${menuItems[0]?.menu?.node?.name} menu`}>
            <NavMenu items={hierarchicalMenuItems} pathname={trailingSlashedPathname} />
        </nav>
    );
}

// NavigationMenu.renderMenu = function (items, pathname) {
//     return (
//         <ul className={styles.navMenu}>
//             {items.map((item) => (
//                 <NavItem key={item.id} {...item} pathname={pathname} />
//             ))}
//         </ul>
//     );
// };

NavigationMenu.fragments = {
    entry: gql`
        fragment NavigationMenuItemFragment on MenuItem {
            id
            path
            label
            parentId
            cssClasses
            menu {
                node {
                    name
                }
            }
        }
    `,
};
