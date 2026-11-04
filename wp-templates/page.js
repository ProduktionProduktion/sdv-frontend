import { gql } from '@apollo/client';
import { BlockEditorFragment } from '../fragments/BlockEditor';
import { BlocksComponentMap } from '@/components/BlocksComponentMap';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
import { Seo } from '@/components/Seo';
// import { useLinkStatus } from 'next/link';
// import { getViewTitle } from '@/helpers';

export default function Component({ loading, data }) {
    // const { pending } = useLinkStatus();

    if (loading) {
        return <Loading text="THINKING" />;
    }

    const { page, headerMenuItems, footerSidebar, generalSettings } = data;
    const { title: siteTitle, description: siteDescription } = generalSettings;

    return (
        <>
            <Seo node={page} settings={data} viewTitle={page?.title} />
            <Header siteTitle={siteTitle} siteDescription={siteDescription} menuItems={headerMenuItems?.nodes} />
            <BlocksComponentMap data={page} />
            <Footer id={footerSidebar?.id} name={footerSidebar?.name} widgets={footerSidebar?.widgets} />
        </>
    );
}

Component.query = gql`
    ${BlockEditorFragment}
    ${Header.fragments.entry}
    ${Footer.fragments.entry}
    ${Seo.fragments.settings}
    ${Seo.fragments.node}
    query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
        page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
            title
            ...BlockEditorFragment
            ...SeoNodeFragment
        }
        ...HeaderFragment
        ...FooterFragment
        ...SeoSettingsFragment
    }
`;

// Variables function to provide the required arguments to the query
Component.variables = ({ databaseId }, ctx) => {
    return {
        databaseId,
        asPreview: ctx?.asPreview,
    };
};
