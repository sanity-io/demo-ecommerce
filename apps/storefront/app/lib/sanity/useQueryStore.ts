import { createQueryStore } from "@sanity/react-loader";

export const { query, useQuery, setServerClient, useLiveMode } =
  createQueryStore({ client: false, ssr: true });
