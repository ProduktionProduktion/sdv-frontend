import { gql } from '@apollo/client';
import { BlockEditorFragment } from '../fragments/BlockEditor';
import { BlocksComponentMap } from '@/components/BlocksComponentMap';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
import { useLinkStatus } from 'next/link';
import { getViewTitle } from '@/helpers';

export default function Component({ loading, data }) {
    const { pending } = useLinkStatus();

    if (loading || pending) {
        return <Loading text="THINKING" />;
    }

    const { page, headerMenuItems, footerSidebar, generalSettings } = data;
    const { title: siteTitle, description: siteDescription } = generalSettings;

    return (
        <>
            <Header
                viewTitle={page?.title}
                siteTitle={siteTitle}
                siteDescription={siteDescription}
                menuItems={headerMenuItems?.nodes}
            />
            <BlocksComponentMap data={page} />
            <Footer id={footerSidebar?.id} name={footerSidebar?.name} widgets={footerSidebar?.widgets} />
        </>
    );
}

Component.query = gql`
    ${BlockEditorFragment}
    ${Header.fragments.entry}
    ${Footer.fragments.entry}
    query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
        page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
            title
            ...BlockEditorFragment
        }
        ...HeaderFragment
        ...FooterFragment
    }
`;

// Variables function to provide the required arguments to the query
Component.variables = ({ databaseId }, ctx) => {
    return {
        databaseId,
        asPreview: ctx?.asPreview,
    };
};
