import { STUDIO_PATH } from "@demo-ecommerce/sanity/src/constants";
import { useLocation, useNavigate } from "@remix-run/react";
import { createClient } from "@sanity/client/stega";
import type { DisableOverlays, HistoryUpdate } from "@sanity/overlays";
import { enableOverlays } from "@sanity/overlays";
import { useEffect, useMemo, useRef } from "react";

import { useSanityEnvironment } from "./environment";
import { useLiveMode } from "./loader";
import { stegaFilter } from "./stega";

// Default export required for React Lazy loading
export default function VisualEditing() {
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

  const navigateRemix = useNavigate();
  const navigateComposerRef = useRef<null | ((update: HistoryUpdate) => void)>(
    null
  );

  useEffect(() => {
    let disable: DisableOverlays | undefined;

    // When displayed inside an iframe
    if (window.parent !== window.self && !disable) {
      disable = enableOverlays({
        zIndex: 999999,
        history: {
          subscribe: (navigate) => {
            navigateComposerRef.current = navigate;
            return () => {
              navigateComposerRef.current = null;
            };
          },
          update: (update) => {
            if (update.type === "push" || update.type === "replace") {
              navigateRemix(update.url, { replace: update.type === "replace" });
            } else if (update.type === "pop") {
              navigateRemix(-1);
            }
          },
        },
      });
      return () => {
        return disable ? disable() : undefined;
      };
    } else {
      if (typeof document !== "undefined") {
        console.log(
          `Stega is enabled but Visual Editing is configured to only display in an iframe.`
        );
      }
    }
  }, [navigateRemix]);

  const location = useLocation();
  useEffect(() => {
    if (navigateComposerRef.current) {
      navigateComposerRef.current({
        type: "push",
        url: `${location.pathname}${location.search}${location.hash}`,
      });
    }
  }, [location.hash, location.pathname, location.search]);

  // Enable live queries from the specified studio origin URL
  useLiveMode({ client: stegaClient });

  return null;
}
