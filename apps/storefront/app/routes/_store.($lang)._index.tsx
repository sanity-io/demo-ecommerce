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
  loader as queryStore,
  type SanityHeroHome,
  type SanityHomePage,
} from "~/lib/sanity";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { HOME_PAGE_QUERY } from "~/queries/sanity/home";
const { useQuery } = queryStore;

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.page?.data?.seo?.title || "Sanity x Hydrogen",
  description:
    data?.page?.data?.seo?.description ||
    "A custom storefront powered by Hydrogen and Sanity",
});

export const handle = {
  seo,
};

export async function loader({ context, params }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const page = await context.sanity.loader.loadQuery<SanityHomePage>(
    HOME_PAGE_QUERY,
    { language },
    { perspective: "previewDrafts" }
  );

  if (!page.data) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page: page.data, context });

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
  const { language, gids, ...data } =
    useLoaderData<SerializeFrom<typeof loader>>();

  const { error, data: page } = useQuery(
    HOME_PAGE_QUERY,
    { language },
    { initial: data.page }
  );

  if (error) {
    throw error;
  }

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
