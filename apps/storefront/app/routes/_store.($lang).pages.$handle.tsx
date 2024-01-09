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
import { baseLanguage } from "~/data/countries";
import {
  loader as queryStore,
  type SanityHeroPage,
  type SanityPage,
} from "~/lib/sanity";
import { ColorTheme } from "~/lib/theme";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { PAGE_QUERY } from "~/queries/sanity/page";
const { useQuery } = queryStore;

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.initial?.data?.seo?.title,
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

  const queryParams = {
    slug: handle,
    language,
    baseLanguage,
  };
  const initial = await context.sanity.loader.loadQuery<SanityPage>(
    PAGE_QUERY,
    queryParams,
    { perspective: "previewDrafts" }
  );

  if (!initial.data) {
    throw notFound();
  }

  return json({ language, initial, queryParams });
}

export default function Page() {
  const { initial, queryParams } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const {
    data: page,
    loading,
    error,
  } = useQuery<SanityPage>(PAGE_QUERY, queryParams, {
    // @ts-expect-error
    initial,
  });

  if (error) {
    throw error;
  } else if (loading || !page) {
    return <div>Loading...</div>;
  }

  return (
    <ColorTheme value={page?.colorTheme}>
      <PageHero
        fallbackTitle={page?.title || ""}
        hero={page?.hero as SanityHeroPage}
      />
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
