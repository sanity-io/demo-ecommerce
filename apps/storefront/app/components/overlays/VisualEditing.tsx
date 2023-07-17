// import { enableVisualEditing } from "@sanity/overlays";
// import { useEffect } from "react";

export default function VisualEditing() {
  // useEffect(enableVisualEditing, []);

  return (
    <div
      className="bg-red-500/50 fixed inset-0 flex items-center justify-center"
      style={{ opacity: 0.5 }}
    >
      Visual Editing!
    </div>
  );
}
