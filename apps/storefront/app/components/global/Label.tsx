import { useLayoutContext } from "~/hooks/useLayoutContext";
import { useRootLoaderData } from "~/hooks/useRootLoaderData";

type props = {
  _key: string;
  replacements?: Record<string, string>;
};

export function Label(props: props) {
  const { _key, replacements } = props;
  const { labels = [] } = useLayoutContext();

  let label = labels.find(({ key }: { key: string }) => key === _key)?.text;

  if (label && replacements) {
    Object.keys(replacements).forEach((key) => {
      label = label?.replaceAll(key, replacements[key]);
    });
  }

  return label || `Missing translation: ${_key}`;
}
