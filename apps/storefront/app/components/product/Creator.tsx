import { Link } from "~/components/Link";
import SanityImage from "~/components/media/SanityImage";
import PortableText from "~/components/portableText/PortableText";
import type { SanityCreator } from "~/lib/sanity";
import { useRootLoaderData } from "~/root";
import type { ProductWithNodes } from "~/types/shopify";

import { Label } from "../global/Label";

type Props = {
  product: ProductWithNodes;
  creator: SanityCreator;
};

export default function Creator({ product, creator }: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  return (
    <div className="mb-10 grid grid-cols-3 gap-3 lg:grid-cols-6">
      <div className="aspect-square" />
      <div className="col-span-2">
        <div className="relative aspect-square overflow-hidden rounded bg-lightGray">
          {creator.person.image && (
            <SanityImage
              alt={creator.person.image?.altText}
              crop={creator.person.image?.crop}
              dataset={sanityDataset}
              hotspot={creator.person.image?.hotspot}
              layout="fill"
              objectFit="cover"
              projectId={sanityProjectID}
              sizes="25vw"
              src={creator.person.image?.asset?._ref}
            />
          )}
        </div>
      </div>
      <div className="aspect-square" />
      <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-3">
        <div className="col-span-2">
          <div className="">
            <div className="tracking-tight text-xl font-bold text-black">
              {creator.person.name}
            </div>
            {creator.role && (
              <div className="tracking-tight mb-2 text-xl ">
                <Label _key={`person.${creator.role}`} />
                {" // "}
                {product.title}
              </div>
            )}
            <PortableText className="text-sm" blocks={creator.person.bio} />
          </div>
        </div>
        <Link to={creator.person.slug}>
          <div className="flex aspect-square items-center overflow-hidden rounded bg-gray hover:bg-gray">
            <div className="tracking-tight block items-center p-5 text-lg font-medium text-black xl:w-10/12">
              <Label
                _key="person.checkOutWork"
                replacements={{
                  "{name}": creator.person.name.split(" ")[0],
                }}
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
