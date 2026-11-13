import { gql } from '@apollo/client';
import { flatListToHierarchical } from '@faustwp/core';
import { blockRenderer } from '../BlocksComponentMap/BlocksComponentMap';
import { BlockEditorFragment } from '@/fragments/BlockEditor';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer({ editorBlocks = [] }) {
    const hierarchicalBlocks = flatListToHierarchical(editorBlocks ?? [], {
        idKey: 'clientId',
        parentKey: 'parentClientId',
        childrenKey: 'children',
    });

    const supportLogos = Object.entries({
        eu: {
            width: 356,
            label: 'Europeiska unionen',
        },
        'region-stockholm': {
            width: 270,
            label: 'Region Stockholm',
        },
        konstnarsnamnden: {
            width: 391,
            label: 'Konstnärsnämnden',
        },
        bergmanstiftelsen: {
            width: 364,
            label: 'Bergmanstiftelsen',
        },
        site: {
            width: 239,
            label: 'SITE',
        },
        'kultufonden-for-sverige-och-finland': {
            width: 302,
            label: 'Kultufonden för Sverige och Finland',
        },
        kulturradet: {
            width: 401,
            label: 'Kulturrådet',
        },
        'stockholms-stad': {
            width: 303,
            label: 'Stockholms stad',
        },
    });

    const supportNames = supportLogos
        .slice(0, -1)
        .map(([_, { label }]) => label)
        .join(', ');
    const lastSupportName = supportLogos[supportLogos.length - 1][1].label;
    const supportHeading = `${supportNames} och ${lastSupportName}`;

    return (
        <footer className={`document-footer ${styles.footer}`}>
            {hierarchicalBlocks?.map((block, index) => blockRenderer(block, index, !!block.parentClientId, 'footer-'))}
            <div className={styles['support-logos']}>
                <h3>
                    Med stöd av: <span className="visually-hidden">{supportHeading}</span>
                </h3>
                {supportLogos.map(([slug, { width, label }]) => (
                    <Image
                        key={slug}
                        src={`/support-logos/${slug}.svg`}
                        alt={`Med stöd av ${label}`}
                        width={width}
                        height={140}
                        style={{ width: 'auto', height: 'auto' }}
                        loading="lazy"
                    />
                ))}
            </div>
        </footer>
    );
}

Footer.fragments = {
    entry: gql`
        ${BlockEditorFragment}

        fragment FooterFragment on RootQuery {
            footerSidebar: sidebar(id: "sidebar-footer") {
                id
                name
                ...BlockEditorFragment
            }
        }
    `,
};
