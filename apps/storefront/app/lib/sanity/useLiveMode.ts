import { createQueryStore } from "@sanity/react-loader";

import { useSanityEnvironment } from "./useSanityEnvironment";

export function useLiveMode() {
  const sanity = useSanityEnvironment();

  if (!sanity) {
    return () => {};
  }

  const { client, studioUrl } = sanity;

  const { useLiveMode } = createQueryStore({
    client,
    studioUrl,
  });

  return useLiveMode;
}
