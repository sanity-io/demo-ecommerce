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

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">{titleCase(filterKey)}</h2>
      <ul className="flex flex-col">
        {filterValues.map((value) => (
          <li key={cleanString(value.slug)}>
            <button
              value={cleanString(`${filterKey}:${value.slug}`)}
              onClick={handleFilter}
              className={clsx(
                ((value.slug === "all" && !searchParams.get(filterKey)) ||
                  searchParams.get(filterKey) === cleanString(value.slug)) &&
                  "rounded bg-purple-50 px-2 font-bold text-purple-500",
                `block w-full py-2 text-left transition-colors duration-100 hover:text-purple-700`
              )}
            >
              {value.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
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
