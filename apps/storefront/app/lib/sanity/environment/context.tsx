import { createContext, createElement, useContext, useMemo } from "react";

import { isServer } from "~/lib/utils";

export type SanityEnvironment = {
  dataset: string;
  projectId: string;
  apiVersion?: string;
};

export function assertSanityEnvironment(
  environment: SanityEnvironment | null | undefined
): environment is SanityEnvironment {
  if (!environment) {
    throw new Error(
      "Failed to find a Sanity environment. Did you forget to wrap your app in a SanityProvider?"
    );
  }

  return true;
}

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
  return useMemo<SanityEnvironment>(() => {
    const environment = isServer()
      ? serverContext
      : // @ts-expect-error
        globalThis[Symbol.for("Sanity Environment")];

    assertSanityEnvironment(environment);

    return environment;
  }, [serverContext]);
};
