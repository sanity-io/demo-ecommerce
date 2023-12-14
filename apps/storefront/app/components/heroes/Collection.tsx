import clsx from "clsx";

import HeroContent from "~/components/heroes/HeroContent";
import type { SanityHeroCollection } from "~/lib/sanity";
import { useColorTheme } from "~/lib/theme";

type Props = {
  fallbackTitle: string;
  hero?: SanityHeroCollection;
};

export default function CollectionHero({ fallbackTitle, hero }: Props) {
  const colorTheme = useColorTheme();

  if (!hero) {
    return (
      <h1
        className={clsx(
          "max-w-[60rem] px-4 pt-24 text-xl", //
          "te uppercase md:px-8 md:pt-34 md:text-2xl"
        )}
      >
        {fallbackTitle}
      </h1>
    );
  }

  return (
    <div
      className={clsx(
        "rounded-b-xl px-4 pb-4 pt-24", //
        "md:px-8 md:pb-8 md:pt-34"
      )}
      style={{ background: colorTheme?.background || "white" }}
    >
      {/* Title */}
      {hero.title && (
        <h1
          className={clsx(
            "max-w-[60rem] whitespace-pre-line text-2xl",
            "md:text-2xl"
          )}
          style={{ color: colorTheme?.text || "black" }}
        >
          {hero.title}
        </h1>
      )}

      {/* Description */}
      {hero.description && (
        <div
          className="mx-auto mb-8 max-w-[40rem] whitespace-pre-line text-center text-md leading-paragraph"
          style={{ color: colorTheme?.text || "black" }}
        >
          {hero.description}
        </div>
      )} 

      {/* Hero content */}
      {hero.content && (
        <div className="mt-8">
          <HeroContent content={hero.content} />
        </div>
      )}
    </div>
  );
}
