import { gql } from '@apollo/client';
import { TextView } from './TextView';
import { getImageProps } from 'next/image';

export const Text = ({ key, ...props }) => {
    return <TextView key={key} {...props} getImageProps={getImageProps} />;
};

const COMPONENT_NAME = 'Text';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Text.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
        fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
            content
            font
        }
    `,
};
