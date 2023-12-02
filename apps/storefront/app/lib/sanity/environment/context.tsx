import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

import { isServer } from "~/lib/utils";

export type SanityEnvironment = {
  dataset: string;
  projectId: string;
};

const SanityContext = createContext<SanityEnvironment | null>(null);
const SanityProvider = SanityContext.Provider;

export function createSanityEnvironment({
  projectId,
  dataset,
}: SanityEnvironment) {
  const Provider = ({ children }: { children: ReactNode }) => {
    return createElement(
      SanityProvider,
      { value: { projectId, dataset } },
      children
    );
  };

  return { SanityProvider: Provider };
}

export const useSanityEnvironment = () => {
  const serverContext = useContext(SanityContext);
  return useMemo(
    () =>
      isServer()
        ? serverContext
        : // @ts-expect-error
          globalThis[Symbol.for("Sanity Environment")],
    [serverContext]
  );
};
