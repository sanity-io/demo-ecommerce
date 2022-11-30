import {Seo, useRouteParams} from '@shopify/hydrogen';
import clsx from 'clsx';
import groq from 'groq';
import Layout from '../../components/global/Layout.server';
import NotFound from '../../components/global/NotFound.server';
import PageHero from '../../components/heroes/Page.server';
import ModuleGrid from '../../components/modules/ModuleGrid.server';
import PortableText from '../../components/portableText/PortableText.server';
import {PERSON_PAGE} from '../../fragments/sanity/pages/person';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {SanityPersonPage} from '../../types';

export default function GuideRoute() {
  const {handle} = useRouteParams();

  const sanityParams = {slug: handle};

  const {data: sanityPerson} = useSanityQuery<SanityPersonPage>({
    query: QUERY_SANITY,
    params: sanityParams,
  });

  if (!sanityPerson) {
    // @ts-expect-error <NotFound> doesn't require response
    return <NotFound />;
  }

  const sanitySeo = sanityPerson.seo;

  return (
    <Layout>
      {/* Page hero */}
      <PageHero fallbackTitle={sanityPerson.name} />
      {/* Body */}
      {sanityPerson.bio && (
        <PortableText
          blocks={sanityPerson.bio}
          centered
          className={clsx(
            'mx-auto max-w-[660px] px-4 pb-24 pt-8', //
            'md:px-8',
          )}
        />
      )}
      {/* Products */}
      <div
        className={clsx(
          'mb-32 mt-8 px-4', //
          'md:px-8',
        )}
      >
        <ModuleGrid items={sanityPerson.products} />
      </div>

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
    _type == 'person'
    && slug.current == $slug
  ] {
    ${PERSON_PAGE}
  }[0]
`;
