import { gql } from '@apollo/client';
import { useLinkStatus } from 'next/link';
import NextImage from 'next/image';
import styles from '@/styles/single-work.module.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MediaFigure } from '@/components/MediaFigure';
import { MediaFragment } from '@/fragments/Media';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { Seo } from '@/components/Seo';
import { measureHeight } from '@/helpers';

export default function Component({ loading, data }) {
    const { pending } = useLinkStatus();

    if (loading || pending) {
        return <Loading text="THINKING" />;
    }

    const { headerMenuItems, workPost, footerSidebar, generalSettings } = data;
    const {
        title,
        workPostFields: { images, description },
    } = workPost;
    const { title: siteTitle, description: siteDescription } = generalSettings;
    const imageNodes = images?.nodes || [];

    return (
        <>
            <Seo node={workPost} settings={data} viewTitle={title} parentTitle="Arbete" type="article" />
            <Header menuItems={headerMenuItems?.nodes} siteTitle={siteTitle} siteDescription={siteDescription} />
            <main className={`document-content ${styles.work}`}>
                <article className="grid">
                    <Sidebar extraClassNames={['-col -col-1']}>{'Arbete > ' + title}</Sidebar>
                    <div ref={measureHeight} className={`${styles.content} -col -col-5`} style={{ order: 2 }}>
                        <h1>{title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: description ?? '' }} />
                    </div>
                    <div ref={measureHeight} className={`${styles.images} -col -col-5`} style={{ order: 1 }}>
                        {imageNodes?.map((node, index) => (
                            <MediaFigure
                                key={node.id}
                                media={node}
                                sizes="(max-width: 768px) 100vw, 40vw"
                                ImageComponent={NextImage}
                                loading={[0, 1].includes(index) ? 'eager' : 'lazy'}
                            />
                        ))}
                    </div>
                </article>
            </main>
            <Footer id={footerSidebar?.id} name={footerSidebar?.name} widgets={footerSidebar?.widgets} />
        </>
    );
}

Component.query = gql`
    ${Header.fragments.entry}
    ${Footer.fragments.entry}
    ${Seo.fragments.settings}
    ${Seo.fragments.node}
    ${MediaFragment}
    query GetWork($databaseId: ID!, $asPreview: Boolean = false) {
        workPost(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
            id
            title
            workPostFields {
                description
                images(first: 20) {
                    nodes {
                        ...MediaFragment
                    }
                }
            }
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
