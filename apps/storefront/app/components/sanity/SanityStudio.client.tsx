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
  };

export function SanityStudio(props: SanityStudioProps) {
  const { projectId, dataset, previewSecret, storeDomain, ...rest } = props;

  const config = defineSanityConfig({
    projectId,
    dataset,
    preview: {
      domain: globalThis.location.origin,
      secret: previewSecret,
    },
    shopify: {
      storeDomain,
    },
  });

  return (
    <div id="sanity">
      <Studio {...rest} config={config} unstable_globalStyles />
    </div>
  );
}
