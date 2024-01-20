import type { PortableTextBlock } from "@portabletext/types";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  value: PortableTextBlock;
};

export default function Block({ children, value }: Props) {
  if (value.style === "h2") {
    return (
      <h2
        className={clsx(
          "first:mt-0 last:mb-0", //
          "mb-4 mt-16 text-xl font-bold"
        )}
      >
        {children}
      </h2>
    );
  }

  if (value.style === "h3") {
    return (
      <h3
        className={clsx(
          "first:mt-0 last:mb-0", //
          "my-4 mt-8 text-lg font-bold"
        )}
      >
        {children}
      </h3>
    );
  }

  if (value.style === "h4") {
    return (
      <h4
        className={clsx(
          "first:mt-0 last:mb-0", //
          "mb-4 mt-16 font-bold"
        )}
      >
        {children}
      </h4>
    );
  }

  // Pragraphs
  return (
    <p
      className={clsx(
        "first:mt-0 last:mb-0", //
        "relative my-4 leading-paragraph"
      )}
    >
      {children}
    </p>
  );
}
