import { Link } from "~/components/Link";
import { SanityGuideProducts } from "~/lib/sanity";

import { Label } from "../global/Label";
import Image from "../modules/Image";

export default function Guide({
  productGuide,
}: {
  productGuide: SanityGuideProducts;
}) {
  return (
    <div className="mb-10 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
      <div className="col-span-2">
        <div className="overflow-hidden rounded">
          {productGuide.images[2] && <Image module={productGuide.images[2]} />}
        </div>
      </div>
      <div className="col-span-2">
        <div className="overflow-hidden rounded">
          <Image module={productGuide.images[1]} />
        </div>
      </div>
      <div className="col-span-2 grid auto-rows-min grid-cols-2 gap-3">
        <Link
          to={productGuide.slug}
          className="col-span-1 flex overflow-hidden rounded bg-darkGray p-5 text-white hover:bg-lightGray hover:text-darkGray"
        >
          <div className="leading-paragraph">
            <h2 className="lg-text-lg">
              <Label _key="guide.title" />
            </h2>
            <p className="text-lg lg:text-xl">{productGuide.title}</p>
          </div>
        </Link>
        <div className="col-span-2 rounded">
          <Image module={productGuide.images[0]} />
        </div>
      </div>
    </div>
  );
}
