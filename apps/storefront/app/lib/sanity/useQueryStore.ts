import type { StegaConfig } from "@sanity/client/stega";
import { createQueryStore } from "@sanity/react-loader";

const denylist = new Set(["seo", "variantGid"]);

export const stegaFilter: StegaConfig["filter"] = (props) => {
  if (
    props.sourcePath.some((path) =>
      typeof path === "string" ? denylist.has(path) : false
    )
  ) {
    return false;
  }
  return props.filterDefault(props);
};

export const { query, useQuery, setServerClient, useLiveMode } =
  createQueryStore({ client: false, ssr: true });
