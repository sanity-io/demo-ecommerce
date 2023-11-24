import clsx from "clsx";

type Props = {
  label: string;
  mode?: "default" | "outline";
  small?: boolean;
  tone?: "default" | "critical";
  colorTheme?: {
    background?: string;
    text?: string;
  };
};

export default function Badge({
  label,
  mode = "default",
  small,
  tone = "default",
  colorTheme,
}: Props) {
  return (
    <div
      className={clsx(
        "flex place-content-center rounded-sm bg-white px-1.5 py-1 leading-none",
        small ? "text-xs" : "text-sm",
        mode === "outline" && "border",
        tone === "critical" && "border-red text-red",
        tone === "default" && "border-darkGray text-darkGray"
      )}
      style={{
        backgroundColor: colorTheme?.background,
        color: colorTheme?.text,
        marginBottom: ".5rem",
      }}
    >
      {label}
    </div>
  );
}
