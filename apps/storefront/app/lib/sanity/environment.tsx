import {
  createContext,
  createElement,
  type HTMLProps,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

import { isServer } from "../utils";

type SanityEnvironment = {
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

  const context = useMemo(
    () =>
      isServer()
        ? serverContext
        : // @ts-expect-error
          globalThis[Symbol.for("Sanity Environment")],
    [serverContext]
  );

  console.log(context);

  return context;
};

export function SanityEnvironment(props: SanityProps) {
  const environment = useSanityEnvironment();

  if (!environment) {
    throw new Error(
      "Failed to find a Sanity environment. Did you forget to wrap your app in a SanityProvider?"
    );
  }

  return (
    <script
      {...props}
      dangerouslySetInnerHTML={{
        __html: `(${setEnvironment})(${JSON.stringify(environment)})`,
      }}
      suppressHydrationWarning
    />
  );
}

type SanityProps = Omit<
  HTMLProps<HTMLScriptElement>,
  | "children"
  | "async"
  | "defer"
  | "src"
  | "type"
  | "noModule"
  | "dangerouslySetInnerHTML"
  | "suppressHydrationWarning"
>;

function setEnvironment(environment: SanityEnvironment) {
  const SANITY_ENVIRONMENT = Symbol.for("Sanity Environment");

  Object.defineProperty(globalThis, SANITY_ENVIRONMENT, {
    value: Object.freeze(environment),
  });
}
