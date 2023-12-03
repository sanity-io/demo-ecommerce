import { useLocation, useNavigate } from "@remix-run/react";
import { createClient, type FilterDefault } from "@sanity/client/stega";
import type { HistoryUpdate } from "@sanity/overlays";
import { enableOverlays } from "@sanity/overlays";
import { useEffect, useMemo, useRef } from "react";

import { useSanityEnvironment } from "./environment";
import { loader } from "./loader";
const { useLiveMode } = loader;

export type VisualEditingProps = {
  filter: FilterDefault;
  studioUrl?: string;
};

export function VisualEditing({
  filter,
  studioUrl = "/studio",
}: VisualEditingProps) {
  const { projectId, dataset, apiVersion } = useSanityEnvironment();
  const allowStudioOrigin = `location.origin`;

  const client = useMemo(
    () =>
      createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        stega: {
          enabled: true,
          filter,
          studioUrl,
        },
      }),
    [projectId, dataset, apiVersion, filter, studioUrl]
  );
  const navigateRemix = useNavigate();
  const navigateComposerRef = useRef<null | ((update: HistoryUpdate) => void)>(
    null
  );

  useEffect(() => {
    // When displayed inside an iframe
    if (window.parent !== window.self) {
      const disable = enableOverlays({
        allowStudioOrigin,
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
      return () => disable();
    }
  }, [allowStudioOrigin, navigateRemix]);

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
  useLiveMode({ allowStudioOrigin, client });

  return null;
}

export { VisualEditing as default };
