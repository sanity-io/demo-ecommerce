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
import { isStegaEnabled } from "~/lib/isStegaEnabled";
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

  const query = PAGE_QUERY;
  const queryParams = {
    slug: handle,
    language,
    baseLanguage,
  };
  const initial = await context.sanity.loader.loadQuery<SanityPage>(
    query,
    queryParams
  );

  if (!initial.data) {
    throw notFound();
  }

  return json({ language, initial, query, queryParams });
}

export default function Page() {
  const { initial, query, queryParams } =
    useLoaderData<SerializeFrom<typeof loader>>();
  const { data: page, error } = useQuery<SanityPage>(query, queryParams, {
    // @ts-expect-error
    initial,
  });

  if (error) {
    throw error;
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
