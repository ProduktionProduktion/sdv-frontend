import { gql } from '@apollo/client';
import { WorkView } from './WorkView';
// import { ImgFragment } from '@/fragments/Media';
import NextLink from 'next/link';
import NextImage from 'next/image';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export const Work = ({ key, ...props }) => {
    const containerRef = useRef(null);
    const router = useRouter();

    const onLinkClick = (uri) => {
        router.push(uri);
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () =>
            document.body.style.setProperty('--work-top', `${el.getBoundingClientRect().top + window.scrollY}px`);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(document.body);
        return () => ro.disconnect();
    }, []);

    return (
        <WorkView
            ref={containerRef}
            key={key}
            linkComponent={NextLink}
            imgComponent={NextImage}
            onClick={onLinkClick}
            {...props}
        />
    );
};

const COMPONENT_NAME = 'Work';
const ACF_NAME = `Acf${COMPONENT_NAME}`;
const ACF_SLUG = COMPONENT_NAME.toLowerCase();
const FRAGMENT_KEY = `${COMPONENT_NAME}Fragment`;

Work.fragments = {
    fragmentName: FRAGMENT_KEY,
    acfName: ACF_NAME,
    acfSlug: ACF_SLUG,
    entry: gql`
    fragment ${FRAGMENT_KEY} on ${COMPONENT_NAME} {
      displayAll
      displayStyle
      work { #field
        nodes { #posts
          ... on WorkPost { #post_type
            id #post (work) > id
            title #post (work) > title
            uri #post (work) > uri
            featuredImage {
              node {
                ...ImgFragment
              }
            }
            workPostFields {
              shortDescription
              metaDescription
              firstDate
              location
              #images {
              #  nodes {
              #    ...ImgFragment
              #  }
              #}
            }
          }
        }
      }
    }
  `,
};
