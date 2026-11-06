import { gql } from '@apollo/client';
import { useLinkStatus } from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
import { Seo } from '@/components/Seo';
import { BlockEditorFragment } from '@/fragments/BlockEditor';
import { BlocksComponentMap } from '@/components/BlocksComponentMap';

export default function Component({ loading, data }) {
    const { pending } = useLinkStatus();

    if (loading || pending) {
        return <Loading text="THINKING" />;
    }

    const { eventPost, headerMenuItems, footerSidebar, generalSettings } = data;
    const { title: siteTitle, description: siteDescription } = generalSettings;

    return (
        <>
            <Seo node={eventPost} settings={data} viewTitle={eventPost?.title} type="article" />
            <Header menuItems={headerMenuItems?.nodes} siteTitle={siteTitle} siteDescription={siteDescription} />
            <BlocksComponentMap data={eventPost} />
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
    query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
        eventPost(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
            title
            ...BlockEditorFragment
            ...SeoNodeFragment
        }
        ...HeaderFragment
        ...FooterFragment
        ...SeoSettingsFragment
    }
`;

// console.log(Component.query?.loc?.source?.body);

// Variables function to provide the required arguments to the query
Component.variables = ({ databaseId }, ctx) => {
    return {
        databaseId,
        asPreview: ctx?.asPreview,
    };
};
