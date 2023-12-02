import { type HTMLProps } from "react";

import { type SanityEnvironment, useSanityEnvironment } from "./context";

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
