import { type HTMLProps } from "react";

import {
  assertSanityEnvironment,
  type SanityEnvironment,
  useSanityEnvironment,
} from "./context";

export function Sanity(props: SanityProps) {
  const environment = useSanityEnvironment();

  assertSanityEnvironment(environment);

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

export type SanityProps = Omit<
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
