import { Await, useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@sanity/react-loader";
import type { SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import PageHero from "~/components/heroes/Page";
import Banner from "~/components/modules/Banner";
import ModuleGrid from "~/components/modules/ModuleGrid";
import PortableText from "~/components/portableText/PortableText";
import { baseLanguage } from "~/data/countries";
import type { SanityHeroPage, SanityPage } from "~/lib/sanity";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { PAGE_QUERY } from "~/queries/sanity/page";

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

  const page = await context.sanity.loader.loadQuery<SanityPage>(PAGE_QUERY, {
    slug: handle,
    language,
    baseLanguage,
  });

  if (!page.data) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page: page.data, context });

  return defer({ language, page, gids });
}

export default function Page() {
  const { language, gids, ...data } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const { handle } = useParams();

  const { error, data: page } = useQuery(
    PAGE_QUERY,
    { slug: handle, language, baseLanguage },
    { initial: data.page }
  );

  if (error) {
    throw error;
  }

  return (
    <ColorTheme value={page?.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          {/* Page hero */}
          {!page?.banner && (
            <PageHero
              fallbackTitle={page?.title || ""}
              hero={page?.hero as SanityHeroPage}
            />
          )}
          {page?.banner && (
            <div className={clsx("mb-32 mt-24 px-4", "md:px-8")}>
              <Banner items={page.banner} />
            </div>
          )}
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

          {page?.modules && (
            <div className={clsx("mb-2 mt-2 px-4", "md:px-8")}>
              <ModuleGrid items={page.modules} />
            </div>
          )}
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
