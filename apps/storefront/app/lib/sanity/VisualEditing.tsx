import { lazy, useEffect, useState, useTransition } from "react";

import { isServer } from "../utils";

/**
 * Provide a consistent fallback to prevent hydration mismatch errors.
 */
function VisualEditingFallback(): React.ReactElement {
  return <></>;
}

/**
 * If server-side rendering, then return the fallback instead of the heavy dependency.
 * @see https://remix.run/docs/en/1.14.3/guides/constraints#browser-only-code-on-the-server
 */
const VisualEditingHydrated = isServer()
  ? VisualEditingFallback
  : lazy(
      () =>
        /**
         * `lazy` expects the component as the default export
         * @see https://react.dev/reference/react/lazy
         */
        import("./VisualEditing.client")
    );

// Default export required for lazy loading
export default function VisualEditing() {
  const [, startTransition] = useTransition();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => startTransition(() => setHydrated(true)), []);

  // Prevent hydration mismatch
  return hydrated ? <VisualEditingHydrated /> : <VisualEditingFallback />;
}
