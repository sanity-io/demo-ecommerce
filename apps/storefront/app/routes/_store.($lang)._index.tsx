import { useLoaderData } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";

import HomeHero from "~/components/heroes/Home";
import ModuleGrid from "~/components/modules/ModuleGrid";
import { type SanityHeroHome, type SanityHomePage } from "~/lib/sanity";
import { useQuery } from "~/lib/sanity/loader";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { HOME_PAGE_QUERY } from "~/queries/sanity/home";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.initial?.data?.seo?.title || "Sanity x Hydrogen",
  description:
    data?.initial?.data?.seo?.description ||
    "A custom storefront powered by Hydrogen and Sanity",
});

export const handle = {
  seo,
};

export async function loader({ context, params }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const query = HOME_PAGE_QUERY;
  const queryParams = { language };
  const initial = await context.sanity.loader.loadQuery<SanityHomePage>(
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
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
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
    <>
      {/* Page hero */}
      {page?.hero && <HomeHero hero={page.hero as SanityHeroHome} />}

      {page?.modules && (
        <div className={clsx("mb-32 mt-24 px-4", "md:px-8")}>
          <ModuleGrid items={page.modules} />
        </div>
      )}
    </>
  );
}
