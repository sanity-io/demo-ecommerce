import { createClient } from "@sanity/client/stega";

import { stegaFilter } from "./useQueryStore";
export function useSanityEnvironment() {
  if (typeof document === "undefined") {
    return null;
  }

  const { projectId, dataset, studioUrl, client } = window["SANITY_ENV"];

  return {
    projectId,
    dataset,
    studioUrl,
    client: createClient({
      ...client,
      resultSourceMap: "withKeyArraySelector",
      stega: {
        enabled: true,
        studioUrl,
        filter: stegaFilter,
        logger: console,
      },
    }),
  };
}
