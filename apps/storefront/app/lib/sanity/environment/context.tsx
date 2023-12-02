import { createContext, createElement, useContext, useMemo } from "react";

import { isServer } from "~/lib/utils";

export type SanityEnvironment = {
  dataset: string;
  projectId: string;
};

const SanityContext = createContext<SanityEnvironment | null>(null);
const SanityProvider = SanityContext.Provider;

export function createSanityEnvironment(environment: SanityEnvironment) {
  const Provider = ({ children }: { children: React.ReactNode }) => {
    return createElement(
      SanityProvider,
      { value: Object.freeze(environment) },
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
