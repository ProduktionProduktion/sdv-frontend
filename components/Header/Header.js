import Link from 'next/link';
import { NavigationMenu } from '@/components/NavigationMenu';
import { gql } from '@apollo/client';
import { BlogInfoFragment } from '@/fragments/GeneralSettings';
import { Logo } from '@/components/Logo';
import styles from './Header.module.css';
import { getViewTitle } from '@/helpers';
import Head from 'next/head';
export default function Header({ siteTitle, siteDescription, viewTitle = null, menuItems, parentTitle = null }) {
    const title = getViewTitle(viewTitle, siteTitle, parentTitle);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <header className="document-header">
                <div className={styles.navbar}>
                    <Link href="/" className={styles.brand}>
                        <Logo title={siteTitle} description={siteDescription} />
                    </Link>
                    {siteDescription && <p className="description">{siteDescription}</p>}
                    <NavigationMenu className={['primary-navigation'].join(' ')} menuItems={menuItems} />
                </div>
                <Logo className={styles.symbol} title={siteTitle} description={siteDescription} symbol />
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
