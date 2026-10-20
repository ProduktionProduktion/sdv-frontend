import { gql } from '@apollo/client';

export const LayoutSettingsFragment = gql`
  fragment LayoutSettings on EditorBlock {
    layoutOptions {
      enableSpacing
      paddingTop
      paddingBottom
      marginTop
      marginBottom
      limitWidth
      fullWidth
      textColor
      backgroundColor
      backgroundImage {
        ...ImgFragment
      }
      backgroundSize
      backgroundPosition
      backgroundRepeat
      colWidth
      colOffset
      mobileOrder
      alignSelf
      sectionId
      customClasses
    }
  }
`;
