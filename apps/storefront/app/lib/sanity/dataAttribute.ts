import { encodeSanityNodeData, SanityNode } from "@sanity/react-loader/jsx";

export function dataAttribute(
  node: Omit<SanityNode, "baseUrl" | "dataset" | "projectId">
) {
  return encodeSanityNodeData({
    baseUrl: `http://localhost:3000/studio`,
    projectId: "k4hg38xw",
    dataset: "composer-2",
    ...node,
  });
}
