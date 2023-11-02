import { Await, useLoaderData } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { Suspense } from "react";

import HomeHero from "~/components/heroes/Home";
import ModuleGrid from "~/components/modules/ModuleGrid";
import {
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

  const page = await context.sanity.query<SanityHomePage>({
    query: HOME_PAGE_QUERY,
    params: {
      language,
    },
    cache,
  });

  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  return defer({
    language,
    page,
    gids,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Index() {
  const { gids, language, ...loaderData } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const {
    data: page,
    rawData: rawPage,
    error,
    loading,
  } = useQuery<typeof loaderData.page>(
    HOME_PAGE_QUERY,
    { language },
    {
      initialData: loaderData.page,
    }
  );

  if (error) throw error;
  if (loading) return <section>Loading...</section>;

  return (
    <Suspense>
      <Await resolve={gids}>
        {/* Page hero */}
        {page?.hero && <HomeHero hero={rawPage.hero as SanityHeroHome} />}

        {page?.modules && (
          <div className={clsx("mb-32 mt-24 px-4", "md:px-8")}>
            <ModuleGrid items={rawPage.modules} />
          </div>
        )}
      </Await>
    </Suspense>
  );
}
