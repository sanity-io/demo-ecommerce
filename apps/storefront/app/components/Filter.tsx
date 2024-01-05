import { useSearchParams } from "@remix-run/react";
import { vercelStegaSplit } from "@vercel/stega";
import clsx from "clsx";

type FilterProps = {
  filterKey: string;
  values: {
    name: string;
    slug: string;
  }[];
};

export default function Filter({ filterKey, values }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSearchParams((prev) => {
      if (!event) {
        return prev;
      }

      const [key, value] = event.currentTarget.value.split(":");

      if (value && value !== "all") {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }

      return prev;
    });
  };

  const filterValues = [{ name: "All", slug: "all" }, ...values];
  const gridLayout = filterKey === "color";

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">{titleCase(filterKey)}</h2>
      <ul
        className={clsx(gridLayout ? "flex flex-wrap gap-3" : "flex flex-col")}
      >
        {filterValues.map((value) => {
          const isActive =
            (value.slug === "all" && !searchParams.get(filterKey)) ||
            searchParams.get(filterKey) === cleanString(value.slug);

          return (
            <li
              key={cleanString(value.slug)}
              className={clsx(
                // "All" option always full width
                value.slug === "all" && "w-full"
              )}
            >
              <button
                value={cleanString(`${filterKey}:${value.slug}`)}
                onClick={handleFilter}
                className={clsx(
                  isActive && "rounded font-bold text-purple-500",
                  isActive && !gridLayout && "bg-purple-50 px-2",
                  isActive &&
                    gridLayout &&
                    "rounded-full ring-4 ring-purple-500",
                  (!gridLayout || value.slug === "all") && "py-2",
                  `block w-full text-left transition-colors duration-100 hover:text-purple-700`
                )}
              >
                <FilterButton
                  filterKey={filterKey}
                  name={cleanString(value.name)}
                  slug={cleanString(value.slug)}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const COLOR_HEX_MAP: Record<string, string> = {
  Blue: `#3B82F6`,
  Ecru: `#F9F5F0`,
  Pink: `#F472B6`,
  White: `#FFFFFF`,
  Green: `#10B981`,
  "Light Blue": `#93C5FD`,
  Cobalt: `#1E40AF`,
  Orange: `#F97316`,
  Black: `#000000`,
  Yellow: `#FCD34D`,
};

type FilterButtonProps = {
  filterKey: string;
  name: string;
  slug: string;
};

function FilterButton({ filterKey, name, slug }: FilterButtonProps) {
  if (name === "All") {
    return <span>{name}</span>;
  }

  if (filterKey.split(":").pop() === "color") {
    return (
      <span
        className="block h-8 w-8 rounded-full shadow-inner"
        style={{ backgroundColor: COLOR_HEX_MAP[slug] }}
        title={name}
      ></span>
    );
  }

  return <span>{name}</span>;
}

export function cleanString(value?: string | null): string {
  return value ? vercelStegaSplit(value).cleaned : ``;
}

export function titleCase(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
