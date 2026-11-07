import { gql } from '@apollo/client';
import { GroupView } from './GroupView';

export const Group = ({ key, ...props }) => {
    return <GroupView key={key} {...props} />;
};

const COMPONENT_NAME = 'Group';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Group.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
        fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
            readonlyModuleId
        }
    `,
};
