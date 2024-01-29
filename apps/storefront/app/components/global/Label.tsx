import { useLayoutContext } from "~/hooks/useLayoutContext";
import { useRootLoaderData } from "~/hooks/useRootLoaderData";

import { cleanString } from "../Filter";

type props = {
  _key: string;
  replacements?: Record<string, string>;
};

export function Label(props: props) {
  const { _key, replacements } = props;
  const { labels = [] } = useLayoutContext();

  let label = labels.find(
    ({ key }: { key: string }) => cleanString(key) === cleanString(_key)
  )?.text;

  if (label && replacements) {
    Object.keys(replacements).forEach((key) => {
      label = label?.replaceAll(key, replacements[key]);
    });
  }

  //return label || `Missing translation: ${_key}`;
  // eslint-disable-next-line no-console
  return label || console.log(`Missing translation: ${_key}`);
}
