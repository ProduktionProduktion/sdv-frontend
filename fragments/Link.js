import { gql } from '@apollo/client';

export const LinkFragment = gql`
    fragment LinkFragment on AcfLink {
        url
        title
        target
    }
`;
