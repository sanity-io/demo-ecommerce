import { Image } from "@shopify/hydrogen";
import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import SanityImage from "~/components/media/SanityImage";
import Button from "~/components/elements/Button";
import { Link } from "~/components/Link";
import type { SanityModuleCollection } from "~/lib/sanity";
import { useGid } from "~/lib/utils";
import { useRootLoaderData } from "~/root";
import { Label } from "../global/Label";

type Props = {
  module?: SanityModuleCollection;
};

export default function CollectionModule({ module }: Props) {
  const collection = module?.collection;
  const collectionGid = collection?.gid;
  const storefrontCollection = useGid<Collection>(collectionGid);
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  if (!collection || !collection?.slug || !storefrontCollection) {
    return null;
  }

  return (
    <Link
      className="group relative flex aspect-[4/3] h-full w-full flex-col items-center justify-center md:aspect-square"
      to={collection.slug}
    >
      <div className="relative h-full w-full flex-col items-center justify-center">
        <div className="shadow-lg mx-auto overflow-hidden bg-white">
          <div
            className="relative h-96 bg-cover bg-center"
            style={{
              backgroundImage:
                //'url("https://www.stevemadden.com/cdn/shop/files/WOMENS-SHOES_SM_NOV_Site-Assets_250x.jpg?v=1699007283")',
                'url(${(collection.image?.asset?._ref)})',
            }}
          >
            <SanityImage
              alt={collection.collectionImage?.altText}
              crop={collection.collectionImage?.crop}
              dataset={sanityDataset}
              hotspot={collection.collectionImage?.hotspot}
              layout="fill"
              objectFit="cover"
              projectId={sanityProjectID}
              sizes="25vw"
              src={collection.collectionImage?.asset?._ref}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-white ">
                {storefrontCollection.title}
              </h2>
              {/* <br />
              <span className="text-lg font-bold  text-white ">shop collection</span> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
