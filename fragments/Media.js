import { gql } from '@apollo/client';

export const ImgFragment = gql`
    fragment ImgFragment on MediaItem {
        id
        altText
        sourceUrl
        mediaDetails {
            width
            height
        }
    }
`;

export const ImgNodeFragment = gql`
    ${ImgFragment}
    fragment ImgNodeFragment on AcfMediaItemConnectionEdge {
        node {
            ...ImgFragment
        }
    }
`;
