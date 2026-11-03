import { gql } from '@apollo/client';
import { useLinkStatus } from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
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
            <Header
                menuItems={headerMenuItems?.nodes}
                viewTitle={eventPost?.title}
                siteTitle={siteTitle}
                siteDescription={siteDescription}
            />
            <BlocksComponentMap data={eventPost} />
            <Footer id={footerSidebar?.id} name={footerSidebar?.name} widgets={footerSidebar?.widgets} />
        </>
    );
}

Component.query = gql`
    ${BlockEditorFragment}
    ${Header.fragments.entry}
    ${Footer.fragments.entry}
    query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
        eventPost(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
            title
            ...BlockEditorFragment
        }
        ...HeaderFragment
        ...FooterFragment
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
