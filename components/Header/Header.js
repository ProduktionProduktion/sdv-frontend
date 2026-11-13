import Link from 'next/link';
import { NavigationMenu } from '@/components/NavigationMenu';
import { gql } from '@apollo/client';
import { BlogInfoFragment } from '@/fragments/GeneralSettings';
import { Logo } from '@/components/Logo';
import styles from './Header.module.css';

export default function Header({ siteTitle, siteDescription, menuItems }) {
    return (
        <>
            <header className="document-header">
                <div className={styles.navbar}>
                    <Link href="/" className={styles.brand}>
                        <Logo title={siteTitle || 'Salorant &amp; de Vylders'} description={siteDescription} />
                    </Link>
                    {siteDescription && <p className="description visually-hidden">{siteDescription}</p>}
                    <NavigationMenu className={['primary-navigation'].join(' ')} menuItems={menuItems} />
                </div>
                <Logo className={styles.symbol} symbol />
            </header>
        </>
    );
}

Header.fragments = {
    entry: gql`
        ${BlogInfoFragment}
        ${NavigationMenu.fragments.entry}
        fragment HeaderFragment on RootQuery {
            generalSettings {
                ...BlogInfoFragment
            }
            headerMenuItems: menuItems(where: { location: PRIMARY_NAVIGATION }) {
                nodes {
                    ...NavigationMenuItemFragment
                }
            }
        }
    `,
};
