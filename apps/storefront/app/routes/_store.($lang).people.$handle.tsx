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
import ModuleGrid from "~/components/modules/ModuleGrid";
import PortableText from "~/components/portableText/PortableText";
import { loader as queryStore, type SanityPersonPage } from "~/lib/sanity";
import { fetchGids, notFound, validateLocale } from "~/lib/utils";
import { PERSON_QUERY } from "~/queries/sanity/person";
const { useQuery } = queryStore;

const seo: SeoHandleFunction<typeof loader> = ({ data }) => ({
  title: data?.page?.data?.seo?.title || data?.page?.data?.name,
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

  const page = await context.sanity.loader.loadQuery<SanityPersonPage>(
    PERSON_QUERY,
    {
      slug: handle,
      language,
    },
    { perspective: "previewDrafts" }
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
    PERSON_QUERY,
    { slug: handle, language },
    { initial: data.page }
  );

  if (error) {
    throw error;
  }

  return (
    <Suspense>
      <Await resolve={gids}>
        {/* Page hero */}
        <PageHero fallbackTitle={page?.name || ""} />
        {/* Body */}
        {page?.bio && (
          <PortableText
            blocks={page.bio}
            centered
            className={clsx(
              "mx-auto max-w-[660px] px-4 pb-24 pt-8", //
              "md:px-8"
            )}
          />
        )}

        {/* Products */}
        {page?.products && (
          <div
            className={clsx(
              "mb-32 mt-8 px-4", //
              "md:px-8"
            )}
          >
            <ModuleGrid items={page.products} />
          </div>
        )}
      </Await>
    </Suspense>
  );
}
