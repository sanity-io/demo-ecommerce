import { STUDIO_PATH } from "@demo-ecommerce/sanity/src/constants";
import { createClient } from "@sanity/client";
import { VisualEditing } from "@sanity/visual-editing/remix";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import { useSanityEnvironment } from "./environment";
import { useLiveMode } from "./loader";
import { stegaFilter } from "./stega";

// Default export required for React Lazy loading
export default function VisualEditingClient() {
  const { projectId, dataset, apiVersion } = useSanityEnvironment();

  const stegaClient = useMemo(
    () =>
      createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        perspective: "previewDrafts",
        resultSourceMap: "withKeyArraySelector",
        stega: {
          enabled: true,
          filter: stegaFilter,
          studioUrl: STUDIO_PATH,
        },
      }),
    [projectId, dataset, apiVersion]
  );

  // Enable live queries from the specified studio origin URL
  useLiveMode({ client: stegaClient });

  const iframeOrPopup = useSyncExternalStore(
    subscribe,
    () => window.self !== window.top || !!window.opener,
    () => false
  );
  useEffect(() => {
    if (!iframeOrPopup) {
      console.log(
        `Stega is enabled but Visual Editing is configured to only display in an iframe or a popup window.`
      );
    }
  }, [iframeOrPopup]);
  if (iframeOrPopup) {
    return <VisualEditing zIndex={999999} />;
  }
  return null;
}

// Empty subscribe function for the useSyncExternalStore hook, as it's only used to return state that requires hydration to complete first
const subscribe = () => () => {};
