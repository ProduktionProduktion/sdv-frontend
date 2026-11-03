import { gql } from '@apollo/client';
import Head from 'next/head';
import { BlockEditorFragment } from '../fragments/BlockEditor';
import { BlocksComponentMap } from '@/components/BlocksComponentMap';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loading } from '@/components/Loading';

export default function Component({ loading, data }) {
    if (loading) {
        return <Loading text="THINKING" />;
    }

    const { generalSettings, headerMenuItems, nodeByUri, footerSidebar } = data;
    const { title: siteTitle, description: siteDescription } = generalSettings;

    return (
        <>
            <Header siteTitle={siteTitle} siteDescription={siteDescription} menuItems={headerMenuItems?.nodes} />
            <BlocksComponentMap data={nodeByUri} />
            <Footer id={footerSidebar?.id} name={footerSidebar?.name} widgets={footerSidebar?.widgets} />
        </>
    );
}

Component.query = gql`
    ${BlockEditorFragment}
    ${Header.fragments.entry}
    ${Footer.fragments.entry}
    query GetFrontPage {
        nodeByUri(uri: "/") {
            ... on Page {
                title
                ...BlockEditorFragment
            }
        }
        ...HeaderFragment
        ...FooterFragment
    }
`;

// console.log('---');
// console.log(Component.query?.loc?.source?.body);
// console.log('---');

// Variables function to provide the required arguments to the query
Component.variables = (_, ctx) => {
    return {
        asPreview: ctx?.asPreview,
    };
};
