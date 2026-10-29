import { gql } from '@apollo/client';
import { BlockEditorFragment } from '../fragments/BlockEditor';
import { BlocksComponentMap } from '@/components/BlocksComponentMap';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';

export default function Component({ loading, data }) {
    if (loading) {
        return <Loading text="THINKING" />;
    }

    const { headerMenuItems, post, footerSidebar } = data;

    return (
        <>
            <Header menuItems={headerMenuItems?.nodes} />
            <BlocksComponentMap data={post} />
            <Footer id={footerSidebar?.id} name={footerSidebar?.name} widgets={footerSidebar?.widgets} />
        </>
    );
}

Component.query = gql`
    ${BlockEditorFragment}
    ${Header.fragments.entry}
    ${Footer.fragments.entry}
    query GetPost($databaseId: ID!, $asPreview: Boolean = false) {
        post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
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
