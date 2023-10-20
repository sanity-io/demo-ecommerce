import { useMatches } from "@remix-run/react";

type props = {
  _key: string;
  replacements?: Record<string, string>;
};

export function Label(props: props) {
  const { _key, replacements } = props;
  const [root] = useMatches();
  const labels = root?.data?.layout?.labels || [];

  let label = labels.find(({ key }: { key: string }) => key === _key)?.text;

  if (label && replacements) {
    Object.keys(replacements).forEach((key) => {
      label = label.replaceAll(key, replacements[key]);
    });
  }

  return label || `Missing translation: ${_key}`;
}
