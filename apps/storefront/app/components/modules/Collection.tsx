import { Image } from "@shopify/hydrogen";
import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";

import Button from "~/components/elements/Button";
import { Link } from "~/components/Link";
import type { SanityModuleCollection } from "~/lib/sanity";
import { useGid } from "~/lib/utils";

import { Label } from "../global/Label";

type Props = {
  module?: SanityModuleCollection;
};

export default function CollectionModule({ module }: Props) {
  const collection = module?.collection;
  const collectionGid = collection?.gid;
  const storefrontCollection = useGid<Collection>(collectionGid);

  if (!collection || !collection?.slug || !storefrontCollection) {
    return null;
  }

  const imageURL = collection.collectionImage.url


  return (
    <Link
      className="group  relative aspect-[4/3] h-full w-full flex-col items-center justify-center md:aspect-square"
      to={collection.slug}
    >
      <div className="shadow-lg mx-auto max-w-md overflow-hidden rounded-md bg-white">
        <div
          className="relative h-96 bg-cover bg-center bg-[url('{{}}"
          style={{ backgroundImage: `url(${imageURL})` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">
              {storefrontCollection.title}
            </h2>
          </div>
        </div>
        {/* data={storefrontCollection.image} */}
      </div>
    </Link>
  );
}
