import { gql } from '@apollo/client';
import { ImgFragment } from './Media';

export const SeoSettingsFragment = gql`
    ${ImgFragment}
    fragment SeoSettingsFragment on RootQuery {
        generalSettings {
            title
            description
        }
        seoSettings {
            seoDefaults {
                defaultDescription
                twitterHandle
                discourageIndexing
                defaultOgImage {
                    node {
                        ...ImgFragment
                    }
                }
            }
        }
    }
`;

export const SeoNodeFragment = gql`
    ${ImgFragment}
    fragment SeoNodeFragment on ContentNode {
        uri
        ... on NodeWithExcerpt {
            excerpt
        }
        ... on NodeWithFeaturedImage {
            featuredImage {
                node {
                    ...ImgFragment
                }
            }
        }
        ... on WithAcfSeoFields {
            seoFields {
                seoTitle
                seoDescription
                seoCanonical
                seoNoindex
                seoImage {
                    node {
                        ...ImgFragment
                    }
                }
            }
        }
    }
`;
