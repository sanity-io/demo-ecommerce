import {Seo, useRouteParams} from '@shopify/hydrogen';
import clsx from 'clsx';
import groq from 'groq';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PageHero from '../../components/heroes/Page.server';
import PortableText from '../../components/portableText/PortableText.server';
import {GUIDE} from '../../fragments/sanity/pages/guide';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {SanityGuide} from '../../types';

export default function GuideRoute() {
  const {handle} = useRouteParams();

  const sanityParams = {slug: handle};

  const {data: sanityGuide} = useSanityQuery<SanityGuide>({
    query: QUERY_SANITY,
    params: sanityParams,
  });

  if (!sanityGuide) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityGuide.seo;

  return (
    <Layout>
      {/* Page hero */}
      <PageHero
        colorTheme={sanityGuide.colorTheme}
        fallbackTitle={sanityGuide.title}
        hero={sanityGuide.hero}
      />
      {/* Body */}
      {sanityGuide.body && (
        <PortableText
          blocks={sanityGuide.body}
          centered
          className={clsx(
            'mx-auto max-w-[660px] px-4 pb-24 pt-8', //
            'md:px-8',
          )}
          colorTheme={sanityGuide.colorTheme}
        />
      )}
      <Seo
        data={{
          seo: {
            description: sanitySeo.description,
            title: sanitySeo.title,
          },
        }}
        type="page"
      />
    </Layout>
  );
}
const QUERY_SANITY = groq`
  *[
    _type == 'guide'
    && slug.current == $slug
  ] | order(_updatedAt desc)[0] {
    ${GUIDE}
  }
`;
