import { Await, useLoaderData } from "@remix-run/react";
import { AnalyticsPageType, type SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { SanityPreview } from "hydrogen-sanity";
import { Suspense } from "react";

import HomeHero from "~/components/heroes/Home";
import ModuleGrid from "~/components/modules/ModuleGrid";
import Banner from "~/components/modules/Banner";
import type { SanityHeroHome, SanityHomePage } from "~/lib/sanity";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { HOME_PAGE_QUERY } from "~/queries/sanity/home";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
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
  const { language, page, gids } =
    useLoaderData<SerializeFrom<typeof loader>>();

  return (
    <SanityPreview data={page} query={HOME_PAGE_QUERY} params={{ language }}>
      {(page) => (
        <Suspense>
          <Await resolve={gids}>
            {/* Page hero */}
            {/* {page?.hero && <HomeHero hero={page.hero as SanityHeroHome} />} */}

            {page?.banner && (
              <div className={clsx("mb-32 mt-24 px-4", "md:px-8")}>
                <Banner items={page.banner} />
              </div>
            )}

            {page?.modules && (
              <div className={clsx("mb-2 mt-2 px-4", "md:px-8")}>
                <ModuleGrid items={page.modules} />
              </div>
            )}
          </Await>
        </Suspense>
      )}
    </SanityPreview>
  );
}
