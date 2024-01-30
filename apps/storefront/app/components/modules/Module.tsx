import { StudioPathLike } from "@sanity/react-loader";

import CalloutModule from "~/components/modules/Callout";
import CallToActionModule from "~/components/modules/CallToAction";
import CollectionModule from "~/components/modules/Collection";
import ImageModule from "~/components/modules/Image";
import InstagramModule from "~/components/modules/Instagram";
import ProductModule from "~/components/modules/Product";
import type { EncodeDataAttributeFunction, SanityModule } from "~/lib/sanity";

type Props = {
  imageAspectClassName?: string;
  module: SanityModule;
  path?: StudioPathLike;
  encodeDataAttribute?: EncodeDataAttributeFunction;
};

export default function Module({
  imageAspectClassName,
  module,
  path,
  encodeDataAttribute,
}: Props) {
  switch (module._type) {
    case "module.callout":
      return <CalloutModule module={module} />;
    case "module.callToAction":
      return <CallToActionModule module={module} />;
    case "module.collection":
      return <CollectionModule module={module} />;
    case "module.image":
      return <ImageModule module={module} />;
    case "module.instagram":
      return <InstagramModule module={module} />;
    case "module.product":
      return (
        <ProductModule
          imageAspectClassName={imageAspectClassName}
          module={module}
          path={path}
          encodeDataAttribute={encodeDataAttribute}
        />
      );
    default:
      return null;
  }
}
