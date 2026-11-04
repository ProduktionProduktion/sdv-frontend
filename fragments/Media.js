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

/**
 * An image that may be a video poster (an image attachment with a video URL)
 */
export const MediaFragment = gql`
    ${ImgFragment}
    fragment MediaFragment on MediaItem {
        ...ImgFragment
        videoFields {
            videoUrl
            videoOptions
            videoDimensions {
                width
                height
            }
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
