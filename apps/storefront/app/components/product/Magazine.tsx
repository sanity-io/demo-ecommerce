import clsx from "clsx";

import Composition from "~/components/product/Composition";
import Creator from "~/components/product/Creator";
import Guide from "~/components/product/Guide";
import type { SanityProductPage } from "~/lib/sanity";
import type { ProductWithNodes } from "~/types/shopify";

type Props = {
  page: SanityProductPage;
  product: ProductWithNodes;
};

export default function Magazine({ product, page }: Props) {
  const { composition, creators, guide } = page;

  const compositionStories =
    composition &&
    composition.filter((block) => block?.material?.story ?? false);

  return (Array.isArray(creators) && creators.length > 0) ||
    guide ||
    (Array.isArray(compositionStories) && compositionStories.length > 0) ? (
    <div className={clsx("w-full", "lg:w-[calc(100%-315px)]", "mb-10 p-5")}>
      {creators
        ?.filter((creator) => Boolean(creator?.person))
        .map((creator) => (
          <Creator product={product} creator={creator} key={creator._key} />
        ))}

      {guide && <Guide productGuide={guide} />}

      {compositionStories?.length > 0 && (
        <Composition compositionStories={compositionStories} page={page} />
      )}
    </div>
  ) : (
    <></>
  );
}
