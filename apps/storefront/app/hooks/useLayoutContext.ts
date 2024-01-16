import { QueryResponseInitial } from "@sanity/react-loader";
import { createContext, useContext } from "react";

import { SanityLayout } from "~/lib/sanity";
import { useQuery } from "~/lib/sanity/loader";

type LayoutContextValue = {
  initial: QueryResponseInitial<SanityLayout>;
  query: string;
  queryParams: Record<string, string>;
};

export const LayoutContext = createContext<LayoutContextValue>({
  initial: {
    data: {
      seo: {
        // TODO: Make dynamic!
        title: "AKVA",
      },
    },
    sourceMap: undefined,
  },
  query: "",
  queryParams: {},
});

export function useLayoutContext() {
  const { initial, query, queryParams } = useContext(LayoutContext);

  const { data: layout } = useQuery(query, queryParams, { initial });

  return layout;
}
