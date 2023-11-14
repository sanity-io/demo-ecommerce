import { useLocation, useNavigate } from "@remix-run/react";
import {
  enableOverlays,
  HistoryAdapterNavigate,
  type HistoryUpdate,
} from "@sanity/overlays";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLiveMode, useSanityEnvironment } from "~/lib/sanity";

export type VisualEditingProps = { studioUrl: string };

export default function VisualEditing(props: VisualEditingProps) {
  const { studioUrl } = props;

  console.log("Heads up, allowStudioOrigin is: ", studioUrl);
  // @TODO stop manual override
  const allowStudioOrigin = "/"; // A relative URL is resoled to the current one, it's the same effect as same-origin

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
      allowStudioOrigin,
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
  const sanity = useSanityEnvironment();
  const [client] = useState(() => sanity?.client);

  useLiveMode({
    allowStudioOrigin,
    client,
  });

  return null;
}
