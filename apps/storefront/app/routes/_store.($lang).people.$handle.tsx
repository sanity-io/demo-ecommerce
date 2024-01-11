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
import ModuleGrid from "~/components/modules/ModuleGrid";
import PortableText from "~/components/portableText/PortableText";
import { type SanityPersonPage } from "~/lib/sanity";
import { useQuery } from "~/lib/sanity/loader";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { PERSON_QUERY } from "~/queries/sanity/person";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.initial?.data?.seo?.title || data?.initial?.data?.name,
  description: data?.initial?.data?.seo?.description,
  media: data?.initial?.data?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const { handle } = params;
  invariant(handle, "Missing page handle");

  const query = PERSON_QUERY;
  const queryParams = {
    slug: handle,
    language,
  };
  const initial = await context.sanity.loader.loadQuery<SanityPersonPage>(
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
  const { initial, query, queryParams, gids } =
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
    <>
      {/* Page hero */}
      <PageHero fallbackTitle={page?.name || ""} />
      {/* Body */}
      {page?.bio && (
        <PortableText
          blocks={page.bio}
          centered
          className={clsx(
            "mx-auto max-w-[660px] px-4 pb-24 pt-8", //
            "md:px-8"
          )}
        />
      )}

      {/* Products */}
      {page?.products && (
        <div
          className={clsx(
            "mb-32 mt-8 px-4", //
            "md:px-8"
          )}
        >
          <ModuleGrid items={page.products} />
        </div>
      )}
    </>
  );
}
