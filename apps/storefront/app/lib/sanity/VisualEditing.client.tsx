import { useLocation, useNavigate } from "@remix-run/react";
import { createClient, type FilterDefault } from "@sanity/client/stega";
import { enableOverlays, type HistoryAdapterNavigate } from "@sanity/overlays";
import { useEffect, useMemo, useRef, useState } from "react";

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

  const client = useMemo(
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
          filter,
          studioUrl,
        },
      }),
    [projectId, dataset, apiVersion, filter, studioUrl]
  );
  const navigateRemix = useNavigate();
  const navigateRemixRef = useRef(navigateRemix);
  const [navigate, setNavigate] = useState<
    HistoryAdapterNavigate | undefined
  >();

  useEffect(() => {
    navigateRemixRef.current = navigateRemix;
  }, [navigateRemix]);
  useEffect(() => {
    const disable = enableOverlays({
      history: {
        subscribe: (navigate) => {
          setNavigate(() => navigate);
          return () => setNavigate(undefined);
        },
        update: (update) => {
          if (update.type === "push" || update.type === "replace") {
            navigateRemixRef.current(update.url, {
              replace: update.type === "replace",
            });
          } else if (update.type === "pop") {
            navigateRemixRef.current(-1);
          }
        },
      },
    });
    return () => disable();
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (navigate) {
      navigate({
        type: "push",
        url: `${location.pathname}${location.search}${location.hash}`,
      });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  useLiveMode({ client, studioUrl });

  return null;
}

export { VisualEditing as default };
