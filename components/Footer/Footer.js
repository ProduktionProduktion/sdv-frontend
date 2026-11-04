import { gql } from '@apollo/client';
import { flatListToHierarchical } from '@faustwp/core';
import { snakeToCamel } from '@/helpers';
import { blockRenderer } from '../BlocksComponentMap/BlocksComponentMap';
import { LayoutSettingsFragment } from '@/fragments/LayoutSettings';
import { ImgFragment } from '@/fragments/Media';
import Image from 'next/image';
import styles from './Footer.module.css';

const FILD_KEY_PREFIX = 'field_';
const blockKeyReplacements = [`${FILD_KEY_PREFIX}general_block_options_`, `${FILD_KEY_PREFIX}advanced_block_options_`];

const convertWidgetAttrsToGql = (attrs, blockSlug, fieldKeyPrefix = FILD_KEY_PREFIX, lastLoopRun = false) => {
    const blockKeyPrefix = `${fieldKeyPrefix}${blockSlug}_`;
    const currentBlockKeyReplacements = [...blockKeyReplacements, blockKeyPrefix];

    return Object.entries(attrs).reduce((acc, [key, value]) => {
        const generalPrefix = `${fieldKeyPrefix}general_block_options_`;
        const advancedPrefix = `${fieldKeyPrefix}advanced_block_options_`;

        if (!key.startsWith(generalPrefix) && !key.startsWith(advancedPrefix)) {
            const newSnakeKey = currentBlockKeyReplacements.reduce(
                (acc, replacement) => acc.replace(replacement, ''),
                key,
            );
            const newKey = snakeToCamel(newSnakeKey);

            /**
             * TODO: Maybe image that only return an ID can be fetch separataly with fetch through the rest api ...or graphql
             */

            if (!lastLoopRun) {
                switch (typeof value) {
                    case 'object':
                        value = Object.values(value).map((rowObject) => {
                            return typeof rowObject === 'object'
                                ? convertWidgetAttrsToGql(rowObject, newSnakeKey, blockKeyPrefix, true)
                                : rowObject;
                        });
                        break;
                    // case 'string':
                    //   console.log(newKey, 'string', value);
                    //   break;
                    // case 'boolean':
                    //   value = parseInt(value) === 1;
                    //   // console.log(newKey, 'boolean', value);
                    //   break;
                    // case 'number':
                    //   value = Math.round(parseFloat(value) * 100) / 100;
                    //   // console.log(newKey, 'number', value);
                    //   break;
                    default:
                        /**
                         * TODO: Figure out the return_format from acf and handle it accordingly
                         */
                        value = value;
                        break;
                }
            }

            acc[newKey] = value;
        }

        return acc;
    }, {});
};

export default function Footer({ widgets }) {
    const parsedBlocks = widgets?.map(({ data, clientId, parentClientId, name, editorBlocks }, index) => {
        const blockSlug = name.split('/').pop();
        const blockType = name
            .split('/')
            .map((part) => part.replace(/^[a-z]/, (match) => match.toUpperCase()))
            .join('');
        const {
            blocks: [blockData],
        } = JSON.parse(data ?? '{}');
        const widgetData = blockData?.attrs?.data;
        const [firstEditorBlock] = editorBlocks;
        const { layoutOptions } = firstEditorBlock ?? {};

        return {
            __typename: blockType,
            name,
            clientId,
            parentClientId,
            [blockSlug]: convertWidgetAttrsToGql(widgetData, blockSlug),
            layoutOptions,
        };
    });

    const hierarchicalBlocks = flatListToHierarchical(parsedBlocks, {
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
                    />
                ))}
            </div>
        </footer>
    );
}

Footer.fragments = {
    // entry: gql`
    //     fragment FooterFragment on RootQuery {
    //         footerSidebar: sidebar(id: "sidebar-footer") {
    //             id
    //             name
    //             widgets {
    //                 name
    //                 clientId
    //                 parentClientId
    //                 data
    //                 editorBlocks(flat: true) {
    //                     __typename
    //                     ...LayoutSettings
    //                 }
    //             }
    //         }
    //     }
    // `,
    entry: gql`
        ${LayoutSettingsFragment}
        ${ImgFragment}

        fragment FooterFragment on RootQuery {
            footerSidebar: sidebar(id: "sidebar-footer") {
                id
                name
                widgets {
                    name
                    clientId
                    parentClientId
                    data
                    editorBlocks(flat: true) {
                        __typename
                        ...LayoutSettings
                    }
                }
            }
        }
    `,
};
