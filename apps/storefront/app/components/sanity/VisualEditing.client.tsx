import { useLocation, useNavigate } from "@remix-run/react";
import { enableOverlays, type HistoryUpdate } from "@sanity/overlays";
import { useEffect, useRef } from "react";

import { useLiveMode } from "~/lib/sanity";

export type VisualEditingProps = { studioUrl: string };

export default function VisualEditing(props: VisualEditingProps) {
  const { studioUrl } = props;

  const navigateRemix = useNavigate();
  const navigateComposerRef = useRef<null | ((update: HistoryUpdate) => void)>(
    null
  );

  useEffect(() => {
    const disable = enableOverlays({
      studioUrl,
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
  }, [navigateRemix, studioUrl]);

  const location = useLocation();
  useEffect(() => {
    if (navigateComposerRef.current) {
      navigateComposerRef.current({
        type: "push",
        url: `${location.pathname}${location.search}${location.hash}`,
      });
    }
  }, [location.hash, location.pathname, location.search]);

  useLiveMode();

  return null;
}
