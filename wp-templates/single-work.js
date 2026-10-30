import { gql } from '@apollo/client';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Figure } from '@/components/Figure';
import { Sidebar } from '@/components/Sidebar';
import { Loading } from '@/components/Loading';
import { useLinkStatus } from 'next/link';
import NextImage from 'next/image';

export default function Component({ loading, data }) {
    const { pending } = useLinkStatus();

    if (loading || pending) {
        return <Loading text="THINKING" />;
    }

    const {
        headerMenuItems,
        workPost: {
            title,
            workPostFields: { images, description },
        },
        footerSidebar,
    } = data;
    const imageNodes = images?.nodes || [];

    return (
        <>
            <Header menuItems={headerMenuItems?.nodes} />
            <main className="document-content work">
                <article className="grid">
                    <Sidebar extraClassNames={['-col -col-1']}>{'Arbete > ' + title}</Sidebar>
                    <main className="-col -col-5" style={{ order: 2 }}>
                        <div className="content">
                            <h1>{title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: description ?? '' }} />
                        </div>
                    </main>
                    <div className="images -col -col-5" style={{ order: 1 }}>
                        {imageNodes?.map(({ id, sourceUrl, altText, mediaDetails: { width, height } }) => (
                            <Figure
                                key={id}
                                src={sourceUrl}
                                alt={altText}
                                width={width}
                                height={height}
                                sizes="(max-width: 768px) 100vw, 40vw"
                                ImageComponent={NextImage}
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
    query GetWork($databaseId: ID!, $asPreview: Boolean = false) {
        workPost(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
            id
            title
            workPostFields {
                description
                images(first: 20) {
                    nodes {
                        ...ImgFragment
                    }
                }
            }
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
