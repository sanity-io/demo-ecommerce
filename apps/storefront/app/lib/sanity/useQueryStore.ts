import { createQueryStore, type QueryStoreState } from "@sanity/react-loader";
import { useMemo, useRef } from "react";

import { useSanityEnvironment } from "./useSanityEnvironment";

export function useQueryStore() {
  const sanity = useSanityEnvironment();

  //  Memoize the query store so that it is only created once per environment?
  //   const queryStore = useMemo(() => {
  //     if (!sanity) {
  //       return {
  //         useQuery: (): QueryStoreState<any, any> => ({
  //           loading: true,
  //           error: undefined,
  //           data: undefined,
  //           sourceMap: undefined,
  //         }),
  //         useLiveMode: () => {},
  //       };
  //     }

  //     const { client, studioUrl } = sanity;
  //     return createQueryStore({
  //       client,
  //       studioUrl,
  //     });
  //   }, [sanity?.studioUrl]);

  //   return queryStore;

  // Store it in a ref to avoid creating a new instance?
  const queryStore = useRef(
    !sanity
      ? {
          useQuery: (): QueryStoreState<any, any> => (
            console.log("useQuery noop"),
            {
              loading: true,
              error: undefined,
              data: undefined,
              sourceMap: undefined,
            }
          ),
          useLiveMode: () => {
            console.log("useLiveMode noop");
          },
        }
      : createQueryStore({
          client: sanity.client,
        })
  );

  return queryStore.current;
}
