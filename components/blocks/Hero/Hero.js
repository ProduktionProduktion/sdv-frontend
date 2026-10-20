import { gql } from "@apollo/client";
import { HeroView } from "./HeroView";

export const Hero = ({ heading, preamble, type, buttons, ...props }) => {
  return (
    <HeroView heading={heading} preamble={preamble} type={type} buttons={buttons} {...props} />
  );
}

const COMPONENT_NAME = 'Hero';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Hero.fragments = {
  fragmentName: FRAGMENT_KEY,
  acfName: ACF_NAME,
  acfSlug: ACF_SLUG,
  entry: gql`
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      type
      preamble
      heading
      buttons {
        link {
          target
          title
          url
        }
        color
        size
        style
      }
    }
  `
};
