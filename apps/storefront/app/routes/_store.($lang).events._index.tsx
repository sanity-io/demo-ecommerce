import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@shopify/remix-oxygen";

import PageHero from "~/components/heroes/Page";
import SanityImage from "~/components/media/SanityImage";
import { type SanityEventPage, useSanityEnvironment } from "~/lib/sanity";
import { useQuery } from "~/lib/sanity/loader";
import { ColorTheme } from "~/lib/theme";
import { notFound } from "~/lib/utils";
import { EVENT_INDEX_QUERY } from "~/queries/sanity/event";

export async function loader({ context }: LoaderFunctionArgs) {
  const query = EVENT_INDEX_QUERY;
  const queryParams = {};
  const initial = await context.sanity.loader.loadQuery<SanityEventPage[]>(
    query
  );

  if (!initial.data) {
    throw notFound();
  }

  return json({ initial, query, queryParams });
}

export default function Event() {
  const { initial, query, queryParams } = useLoaderData<typeof loader>();

  const { error, data: events } = useQuery<SanityEventPage[]>(
    query,
    queryParams,
    // @ts-expect-error
    { initial }
  );

  const { projectId, dataset } = useSanityEnvironment();

  if (error) {
    throw error;
  } else if (!events || !events.length) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        No upcoming events found
      </div>
    );
  }

  return (
    <>
      <PageHero fallbackTitle="Upcoming events" />

      <ul>
        {events.map((event) => {
          const colorTheme =
            event?.image?.asset?.metadata && !event?.colorTheme
              ? {
                  background:
                    event.image.asset.metadata.palette.muted.background,
                  text: event.image.asset.metadata.palette.muted.foreground,
                }
              : event?.colorTheme;
          const date =
            event?.date &&
            new Date(event?.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

          return (
            <li
              key={event._id}
              className="relative transition-transform duration-200 ease-in-out hover:scale-[0.97]"
            >
              <ColorTheme value={colorTheme}>
                <div className="grid grid-cols-3">
                  <div className="col-span-2">
                    <PageHero
                      fallbackTitle="Event details"
                      hero={{ title: event.title, content: date }}
                    />
                  </div>
                  <SanityImage
                    src={event?.image?.asset?._id}
                    alt={event?.image?.alt}
                    dataset={dataset}
                    projectId={projectId}
                    width={800}
                    className="h-full rounded-bl-xl object-cover"
                  />
                </div>
                <a href={`/events/${event.slug.current}`}>
                  <span className="bg-red-500 absolute inset-0"></span>
                </a>
              </ColorTheme>
            </li>
          );
        })}
      </ul>
    </>
  );
}
