import { useFetcher, useSearchParams } from "@remix-run/react";
import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { useEffect, useState } from "react";

import Button from "~/components/elements/Button";
import SpinnerIcon from "~/components/icons/Spinner";
import ModuleGrid from "~/components/modules/ModuleGrid";
import type { SanityModule } from "~/lib/sanity";
import { combineProductsAndModules } from "~/lib/utils";

import { Label } from "../global/Label";

export default function ProductGrid({
  collection,
  modules,
  url,
}: {
  collection: Collection;
  modules: SanityModule[];
  url: string;
}) {
  const products = collection?.products?.nodes || [];
  const combinedItems = combineProductsAndModules({
    modules,
    products,
  });

  const [initialItems, setInitialItems] = useState(combinedItems || []);

  const [nextPage, setNextPage] = useState(
    collection?.products?.pageInfo?.hasNextPage
  );

  const [endCursor, setEndCursor] = useState(
    collection?.products?.pageInfo?.endCursor
  );

  const [items, setItems] = useState(initialItems);

  const [params] = useSearchParams();
  const sort = params.get("sort");

  // props have changes, reset component state
  if (initialItems !== initialItems) {
    setInitialItems(combinedItems);
    setItems(combinedItems);
    setNextPage(collection?.products?.pageInfo?.hasNextPage);
    setEndCursor(collection?.products?.pageInfo?.endCursor);
  }

  const fetcher = useFetcher();

  function fetchMoreProducts() {
    fetcher.load(
      `${url}?index&cursor=${endCursor}${sort ? `&sort=${sort}` : ""}`
    );
  }

  useEffect(() => {
    if (!fetcher.data) return;
    const { collection } = fetcher.data as { collection: Collection };

    setItems((prev) => [...prev, ...collection.products.nodes]);
    setNextPage(collection.products.pageInfo.hasNextPage);
    setEndCursor(collection.products.pageInfo.endCursor);
  }, [fetcher.data]);

  return (
    <>
      <ModuleGrid items={items} />
      {nextPage && (
        <div className="flex h-30 items-center justify-center">
          {fetcher.state !== "idle" ? (
            <SpinnerIcon />
          ) : (
            <Button
              className={clsx(fetcher.state !== "idle" && "opacity-50")}
              disabled={fetcher.state !== "idle"}
              onClick={fetchMoreProducts}
            >
              <Label _key="global.loadMore" />
            </Button>
          )}
        </div>
      )}
    </>
  );
}
