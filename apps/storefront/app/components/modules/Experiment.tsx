import { useState } from "react";

import { SanityModuleImage } from "~/lib/sanity";

import { ImageModule } from "./Image";

type ExperimentModuleProps = {
  module: {
    a: SanityModuleImage;
    b: SanityModuleImage;
  };
};
export function ExperimentModule({ module }: ExperimentModuleProps) {
  // console.log(module);
  const [variation, setVariation] = useState("a");
  if (!module.a) return null;

  return (
    <div style={{ position: "relative" }}>
      <ImageModule module={module[variation]} />
      {module.b && variation === "a" ? (
        <button
          onClick={() => setVariation("b")}
          style={{
            position: "absolute",
            bottom: "0",
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          Show Test
        </button>
      ) : (
        <button
          onClick={() => setVariation("a")}
          style={{
            position: "absolute",
            bottom: "0",
            backgroundColor: "white",
            padding: "5px",
          }}
        >
          Show Control
        </button>
      )}
    </div>
  );
}
