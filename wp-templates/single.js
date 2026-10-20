import { gql } from "@apollo/client";
import { Editor, Heading } from "../components/blocks";
import { BlockEditorFragment } from "../fragments/BlockEditor";
import { BlocksComponentMap } from "@/components/BlocksComponentMap";

 
export default function Component(props) {
	if (props.loading) {
		return <>Loading...</>;
	}
 
	return <BlocksComponentMap data={props?.data?.post} />;
}
 
Component.query = gql`
 	${BlockEditorFragment}
	query GetPost(
		$databaseId: ID!
		$asPreview: Boolean = false
	) {
		post(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {	
			...BlockEditorFragment
		}
	}
`;
 
// Variables function to provide the required arguments to the query
Component.variables = ({ databaseId }, ctx) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	};
};