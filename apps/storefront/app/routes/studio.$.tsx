import { useCatch, useLoaderData } from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@shopify/remix-oxygen";
import { lazy, type ReactElement, Suspense } from "react";

import { GenericError } from "~/components/global/GenericError";
import styles from "~/styles/studio.css";

/**
 * Provide a consistent fallback to prevent hydration mismatch errors.
 */
function SanityStudioFallback(): ReactElement {
  return <></>;
}

/**
 * If server-side rendering, then return the fallback instead of the heavy dependency.
 * @see https://remix.run/docs/en/1.14.3/guides/constraints#browser-only-code-on-the-server
 */
const SanityStudio =
  typeof document === "undefined"
    ? SanityStudioFallback
    : lazy(() =>
        /**
         * `lazy` expects the component as the default export
         * @see https://react.dev/reference/react/lazy
         */
        import("~/components/sanity/SanityStudio.client").then((m) => ({
          default: m.SanityStudio,
        }))
      );

export function loader({ context }: LoaderArgs) {
  return {
    projectId: context.env.SANITY_PROJECT_ID!,
    dataset: context.env.SANITY_DATASET!,
    previewSecret: context.env.SANITY_PREVIEW_SECRET!,
    storeDomain: context.env.PUBLIC_STORE_DOMAIN!,
  };
}

/**
 * (Optional) Prevent Studio from being cached
 */
export function headers(): HeadersInit {
  return {
    "Cache-Control": "no-store",
  };
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function Studio() {
  const data = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<SanityStudioFallback />}>
      <SanityStudio basePath="/studio" {...data} />
    </Suspense>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <GenericError error={{ message: `${caught.status} ${caught.data}` }} />
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <GenericError error={error} />;
}
