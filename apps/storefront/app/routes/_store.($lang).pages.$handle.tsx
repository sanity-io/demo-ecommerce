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

  const page = await context.sanity.loader.loadQuery<SanityPage>(
    PAGE_QUERY,
    {
      slug: handle,
      language,
      baseLanguage,
    },
    {
      perspective: "previewDrafts",
    }
  );

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
          <PageHero
            fallbackTitle={page?.title || ""}
            hero={page?.hero as SanityHeroPage}
          />
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
        </Await>
      </Suspense>
    </ColorTheme>
  );
}
