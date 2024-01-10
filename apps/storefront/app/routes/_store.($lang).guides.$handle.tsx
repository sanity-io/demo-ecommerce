import { Await, useLoaderData, useParams } from "@remix-run/react";
import type { SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import PageHero from "~/components/heroes/Page";
import PortableText from "~/components/portableText/PortableText";
import { isStegaEnabled } from "~/lib/isStegaEnabled";
import {
  loader as queryStore,
  type SanityHeroPage,
  type SanityPage,
} from "~/lib/sanity";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { GUIDE_QUERY } from "~/queries/sanity/guide";
const { useQuery } = queryStore;

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.page?.data?.seo?.title,
  description: data?.page?.data?.seo?.description,
  media: data?.page?.data?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const { handle } = params;
  invariant(handle, "Missing page handle");

  const query = GUIDE_QUERY;
  const queryParams = {
    slug: handle,
    language,
  };
  const initial = await context.sanity.loader.loadQuery<SanityPage>(
    query,
    queryParams
  );

  if (!initial.data) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = await fetchGids({ page: initial.data, context });

  return json({ initial, query, queryParams, gids });
}

export default function Page() {
  const {
    initial,
    query,
    queryParams,
    // TODO: Uncover the purpose of this variable
    gids,
  } = useLoaderData<SerializeFrom<typeof loader>>();

  const { error, data: page } = useQuery(
    query,
    queryParams,
    // @ts-expect-error
    { initial }
  );

  if (error) {
    throw error;
  }

  return (
    <ColorTheme value={page?.colorTheme}>
      {/* Page hero */}
      <PageHero
        fallbackTitle={page?.title || ""}
        hero={page?.hero as SanityHeroPage}
      />
      {/* Body */}
      {page?.body && (
        <PortableText
          blocks={page.body}
          centered
          className={clsx(
            "mx-auto max-w-[660px] px-4 pb-24 pt-8", //
            "md:px-8"
          )}
        />
      )}
    </ColorTheme>
  );
}
