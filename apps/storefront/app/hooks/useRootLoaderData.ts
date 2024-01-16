import { useMatches } from "@remix-run/react";
import { SerializeFrom } from "@shopify/remix-oxygen";

import { loader as rootLoader } from "../root";

// TODO: Work out why this hook is rendered so many times!
// This returns static data, it does not live-update
// useLayoutContext is a provider for live data
export function useRootLoaderData(): SerializeFrom<typeof rootLoader> {
  const [root] = useMatches();
  const data = root?.data as SerializeFrom<typeof rootLoader>;

  return data ?? {};
}
