import { useMemo } from "react";
import { sanity, unwrapData } from "@sanity/react-loader/jsx";
import ImageWithProductHotspots from "~/components/media/ImageWithProductHotspots";
import ProductHero from "~/components/product/ProductHero";
import type {
  SanityImageWithProductHotspots,
  SanityProductWithVariant,
} from "~/lib/sanity";

type Props = {
  content?: SanityImageWithProductHotspots | SanityProductWithVariant;
};

export default function HeroContent({ content }: Props) {
  const heroContent = useMemo(() => {
    switch (content?._type) {
      case "imageWithProductHotspots": {
        return (
          <div className="relative w-full">
            <ImageWithProductHotspots content={content} />
          </div>
        );
      }

      case "productWithVariant": {
        if (!content?.gid || !content.variantGid) {
          return null;
        }

        return (
          <div className="aspect-[1300/768] w-full">
            <ProductHero gid={content?.gid} variantGid={content.variantGid} />
          </div>
        );
      }
    }
  }, [content]);

  return (
    <sanity.div className="relative flex w-full place-content-center overflow-hidden rounded-md bg-lightGray">
      {heroContent}
    </sanity.div>
  );
}
