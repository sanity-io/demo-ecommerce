import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import { defaultButtonStyles } from "~/components/elements/Button";
import { Label } from "~/components/global/Label";
import { Link } from "~/components/Link";

type ButtonMode = "default" | "inline";

export default function BuyNowButton({
  children = <Label _key="cart.buyNow" />,
  lines,
  mode = "default",
  buttonClassName,
  ...props
}: {
  children?: React.ReactNode;
  lines: CartLineInput[];
  mode?: ButtonMode;
  buttonClassName?: string;
  [key: string]: any;
}) {
  const to = lines
    .map(
      (line) =>
        `${line.merchandiseId.replace("gid://shopify/ProductVariant/", "")}:${
          line.quantity
        }`
    )
    .join(",");

  return (
    <Link
      to={`/cart/${to}`}
      className={clsx([
        mode == "default"
          ? twMerge(defaultButtonStyles(), buttonClassName)
          : buttonClassName,
        props.disabled ? "pointer-events-none bg-opacity-100 opacity-20" : "",
      ])}
      {...props}
    >
      {children}
    </Link>
  );
}
