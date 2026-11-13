import { gql } from '@apollo/client';
import { BlockEditorFragment } from '../fragments/BlockEditor';
import { BlocksComponentMap } from '@/components/BlocksComponentMap';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loading } from '@/components/Loading';
import { Seo } from '@/components/Seo';

export default function Component({ loading, data }) {
    if (loading) {
        return <Loading text="THINKING" />;
    }

    const { generalSettings, headerMenuItems, page, footerSidebar } = data;
    const { title: siteTitle, description: siteDescription } = generalSettings;

    return (
        <>
            <Seo node={page} settings={data} />
            <Header siteTitle={siteTitle} siteDescription={siteDescription} menuItems={headerMenuItems?.nodes} />
            <BlocksComponentMap data={page} />
            <Footer id={footerSidebar?.id} name={footerSidebar?.name} editorBlocks={footerSidebar?.editorBlocks} />
        </>
    );
}

Component.query = gql`
    ${BlockEditorFragment}
    ${Header.fragments.entry}
    ${Footer.fragments.entry}
    ${Seo.fragments.settings}
    ${Seo.fragments.node}
    query GetFrontPage($databaseId: ID!, $asPreview: Boolean = false) {
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

// console.log('---');
// console.log(Component.query?.loc?.source?.body);
// console.log('---');

// Variables function to provide the required arguments to the query
Component.variables = ({ databaseId }, ctx) => {
    return {
        databaseId,
        asPreview: ctx?.asPreview,
    };
};
