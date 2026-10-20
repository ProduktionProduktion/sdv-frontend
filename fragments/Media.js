import { gql } from '@apollo/client';

export const ImgFragment = gql`
    fragment ImgNodeFragment on AcfMediaItemConnectionEdge {
        node {
            ...ImgFragment
        }
    }

    fragment ImgFragment on MediaItem {
        altText
        sourceUrl
        mediaDetails {
            width
            height
        }
    }
`;