import { createClient } from "@sanity/client/stega";
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
        logger: console,
      },
    }),
  };
}
