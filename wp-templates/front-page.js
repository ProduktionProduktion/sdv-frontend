import { gql } from "@apollo/client";
import { BlockEditorFragment } from "../fragments/BlockEditor";
import { BlocksComponentMap } from "@/components/BlocksComponentMap";
import { Header } from "@/components/Header";
import { NavigationMenu } from "@/components/NavigationMenu";
import { BlogInfoFragment } from "@/fragments/GeneralSettings";

export default function Component(props) {
	if (props.loading) {
		return <>Loading...</>;
	}

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;
 
	return <>
		<Header title={siteTitle} description={siteDescription} menuItems={props?.data?.headerMenuItems?.nodes} />
		<BlocksComponentMap data={props?.data?.nodeByUri} />
	</>;
}

// Component.query = gql`
//   query GetFrontPage {
//     nodeByUri(uri: "/") {
//       #__typename
//       ... on ContentType {
//         #id
//         #name
//         contentNodes {
//           nodes {
//             ...on Post {
//               #id
//               content
//             }
//           }
//         }
//       }
//       ... on Page {
//         #id
//         #title
//         content
//       }
//     }
//   }
// `;

Component.query = gql`
  ${BlockEditorFragment}
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetFrontPage {
    nodeByUri(uri: "/") {
      ... on Page {
        ...BlockEditorFragment
      }
    }
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: PRIMARY_NAVIGATION }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

// Variables function to provide the required arguments to the query
Component.variables = (_, ctx) => {
	return {
		asPreview: ctx?.asPreview,
	};
};
