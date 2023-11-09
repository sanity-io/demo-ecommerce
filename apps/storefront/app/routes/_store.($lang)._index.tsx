import { Await, useLoaderData } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { Suspense } from "react";

import { PreviewLoading } from "~/components/global/PreviewLoading";
import HomeHero from "~/components/heroes/Home";
import ModuleGrid from "~/components/modules/ModuleGrid";
import {
  query,
  type SanityHeroHome,
  type SanityHomePage,
  useQuery,
} from "~/lib/sanity";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { HOME_PAGE_QUERY } from "~/queries/sanity/home";

const seo: SeoHandleFunction = ({ data }) => ({
  title: data?.page?.seo?.title || "Sanity x Hydrogen",
  description:
    data?.page?.seo?.description ||
    "A custom storefront powered by Hydrogen and Sanity",
});

export const handle = {
  seo,
};

export async function loader({ context, params }: LoaderFunctionArgs) {
  validateLocale({ context, params });

  const language = context.storefront.i18n.language.toLowerCase();

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const initial = await query<SanityHomePage>(HOME_PAGE_QUERY, {
    language,
  });
  const { data: page } = initial;

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  return defer({
    language,
    page,
    gids,
    initial,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const { gids, language, initial, ...loaderData } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const {
    data: page,
    error,
    loading,
  } = useQuery<typeof loaderData.page>(HOME_PAGE_QUERY, { language }, {
    initial,
  } as any);

  if (error) throw error;

  return (
    <Suspense>
      <Await resolve={gids}>
        {/* Page hero */}
        {page?.hero && <HomeHero hero={page.hero as SanityHeroHome} />}

        {page?.modules && (
          <div className={clsx("mb-32 mt-24 px-4", "md:px-8")}>
            <ModuleGrid items={page.modules} />
          </div>
        )}
      </Await>
    </Suspense>
  );
}
