import { createQueryStore } from "@sanity/react-loader";
import type { StegaConfig } from "@sanity/client/stega";

const denylist = new Set([
  "color",
  "colour",
  "gid",
  "hex",
  "hsl",
  "hsla",
  "icon",
  "id",
  "index",
  "key",
  "lqip",
  "link",
  "layout",
  "page",
  "path",
  "ref",
  "rgb",
  "rgba",
  "route",
  "slug",
  "type",
  "url",
  "variant",
]);

// @TODO this can be deleted after @sanity/client/stega defaults is updated
export const stegaFilter: StegaConfig["filter"] = (props) => {
  const endPath = props.sourcePath.at(-1);
  if (typeof endPath === "string" && denylist.has(endPath)) {
    return false;
  }
  if (typeof endPath === "number" && props.sourcePath.at(-2) === "marks") {
    return false;
  }
  // Or if it's [number].markDefs[number].href it's likely a PortableTextLink: https://github.com/portabletext/types/blob/e54eb24f136d8efd51a46c6a190e7c46e79b5380/src/portableText.ts#L163
  if (
    endPath === "href" &&
    typeof props.sourcePath.at(-2) === "number" &&
    props.sourcePath.at(-3) === "markDefs"
  ) {
    return false;
  }
  // Don't encode into asset metadata
  if (props.sourcePath.at(-2) === "metadata") {
    return false;
  }
  // Always ignore SEO fields
  if (props.sourcePath.at(-2) === "seo") {
    return false;
  }
  return props.filterDefault(props);
};

export const { query, useQuery, setServerClient, useLiveMode } =
  createQueryStore({ client: false, ssr: true });
