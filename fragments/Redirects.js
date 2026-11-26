import { gql } from '@apollo/client';

export const RedirectsQuery = gql`
    query Redirects {
        seoSettings {
            seoDefaults {
                redirects {
                    from
                    permanent
                    to {
                        url
                    }
                }
            }
        }
    }
`;
