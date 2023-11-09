import { Await, useLoaderData, useParams } from "@remix-run/react";
import type { SeoHandleFunction } from "@shopify/hydrogen";
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from "@shopify/remix-oxygen";
import clsx from "clsx";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import { PageHero } from "~/components/heroes/Page";
import { CustomPortableText } from "~/components/portableText/CustomPortableText";
import { baseLanguage } from "~/data/countries";
import { query, type SanityPage, useQuery } from "~/lib/sanity";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { PAGE_QUERY } from "~/queries/sanity/page";

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
  media: data?.page?.seo?.image,
});

export const handle = {
  seo,
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  validateLocale({ context, params });
  const language = context.storefront.i18n.language.toLowerCase();

  const { handle } = params;
  invariant(handle, "Missing page handle");

  const cache = context.storefront.CacheCustom({
    mode: "public",
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const initial = await query<SanityPage>(PAGE_QUERY, {
    slug: handle,
    language,
    baseLanguage,
  });
  const { data: page } = initial;
  if (!page) {
    throw notFound();
  }

  // Resolve any references to products on the Storefront API
  const gids = fetchGids({ page, context });

  return defer({ language, initial, page, gids });
}

export default function Page() {
  const { language, gids, initial, ...loaderData } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const { handle } = useParams();
  const {
    data: page,
    loading,
    error,
  } = useQuery<typeof initial.data>(
    PAGE_QUERY,
    {
      slug: handle,
      language,
      baseLanguage,
    },
    { initial } as any
  );
  if (error) throw error;

  return (
    <ColorTheme value={page?.colorTheme}>
      <Suspense>
        <Await resolve={gids}>
          {/* Page hero */}

          <PageHero fallbackTitle={page?.title || ""} hero={page?.hero} />
          {/* Body */}
          {page?.body && (
            <CustomPortableText
              blocks={page.body}
              centered
              className={clsx(
                "mx-auto max-w-[660px] px-4 pb-24 pt-8", //
                "md:px-8"
              )}
            />
          )}
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
