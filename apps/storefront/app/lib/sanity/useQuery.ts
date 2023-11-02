import { QueryParams } from "@sanity/client";
import { type UseQueryOptions } from "@sanity/react-loader";
import { wrapData } from "@sanity/react-loader/jsx";
import { useMemo } from "react";

import { useQueryStore } from "./useQueryStore";
import { useSanityEnvironment } from "./useSanityEnvironment";

export function useQuery<Response>(
  query: string,
  params?: QueryParams,
  options?: UseQueryOptions<Response>
) {
  const { useQuery: _useQuery } = useQueryStore();
  const {
    data: rawData,
    sourceMap,
    ...result
  } = _useQuery(query, params, options);

  const sanity = useSanityEnvironment();
  const data = useMemo(() => {
    if (rawData === undefined || !sanity) return undefined;

    const { projectId, dataset, studioUrl } = sanity;

    // `wrapData` embeds the content source map within the data
    return wrapData(
      { projectId, dataset, baseUrl: studioUrl },
      rawData,
      sourceMap
    );
  }, [rawData, sanity, sourceMap]);

  return {
    ...result,
    data,
    rawData,
    sourceMap,
  };
}
