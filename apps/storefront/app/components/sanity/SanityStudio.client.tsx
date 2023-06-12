/**
 * To keep the worker bundle size small, only load
 * the Studio and its configuration in the client
 */
import { defineSanityConfig } from "@demo-ecommerce/sanity";
import { type SourceOptions, Studio, type StudioProps } from "sanity";

type SanityStudioProps = Omit<StudioProps, "config"> &
  Pick<SourceOptions, "projectId" | "dataset"> & {
    previewSecret: string;
    storeDomain: string;
    storefrontToken: string;
  };

export function SanityStudio(props: SanityStudioProps) {
  const {
    projectId,
    dataset,
    previewSecret,
    storeDomain,
    storefrontToken,
    ...rest
  } = props;

  const config = defineSanityConfig({
    projectId,
    dataset,
    preview: {
      domain: globalThis.location.origin,
      secret: previewSecret,
    },
    shopify: {
      storeDomain,
      storefrontToken,
    },
  });

  return <Studio {...rest} config={config} />;
}
