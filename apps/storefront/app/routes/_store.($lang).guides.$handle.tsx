import { useLoaderData } from "@remix-run/react";
import type { SeoHandleFunction } from "@shopify/hydrogen";
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import invariant from "tiny-invariant";

import PageHero from "~/components/heroes/Page";
import PortableText from "~/components/portableText/PortableText";
import { type SanityHeroPage, type SanityPage } from "~/lib/sanity";
import { useQuery } from "~/lib/sanity/loader";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { GUIDE_QUERY } from "~/queries/sanity/guide";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.initial?.data?.seo?.title,
  description: data?.initial?.data?.seo?.description,
  media: data?.initial?.data?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({ request, params, context }: LoaderFunctionArgs) {
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

  return json({
    initial,
    query,
    queryParams,
    // Retrieved by useLoaderData() in useGids() for Image Hotspots
    gids,
  });
}

export default function Page() {
  const { initial, query, queryParams } =
    useLoaderData<SerializeFrom<typeof loader>>();

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
