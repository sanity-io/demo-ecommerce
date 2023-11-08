import { QueryParams } from "@sanity/client";
import { type UseQueryOptions } from "@sanity/react-loader";

import { useQueryStore } from "./useQueryStore";

export function useQuery<Response>(
  query: string,
  params?: QueryParams,
  options?: UseQueryOptions<Response>
) {
  const { useQuery } = useQueryStore();
  return useQuery(query, params, options);
}
