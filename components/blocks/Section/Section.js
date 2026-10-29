import { gql } from '@apollo/client';
import { SectionView } from './SectionView';

export const Section = ({ key, ...props }) => {
    return <SectionView key={key} {...props} />;
};

const COMPONENT_NAME = 'Section';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Section.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
        fragment SectionFragment on Section {
            verticalAlignment
        }
    `,
};
