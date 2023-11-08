import type { StegaConfig } from "@sanity/client/stega";
import { createQueryStore } from "@sanity/react-loader";

const denyList = new Set(["seo"]);
const allowList = new Set(["title", "text", "body"]);

export const stegaFilter: StegaConfig["filter"] = (props) => {
  if (
    props.sourcePath.some((path) =>
      typeof path === "string" ? denyList.has(path) : false
    )
  ) {
    return false;
  }
  const endPath = props.sourcePath.at(-1);
  if (typeof endPath === "string" && allowList.has(endPath)) {
    return true;
  }
  return props.filterDefault(props);
};

export const { query, useQuery, setServerClient, useLiveMode } =
  createQueryStore({ client: false, ssr: true });
