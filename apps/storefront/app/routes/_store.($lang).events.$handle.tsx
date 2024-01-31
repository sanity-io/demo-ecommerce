import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@shopify/remix-oxygen";
import invariant from "tiny-invariant";

import PageHero from "~/components/heroes/Page";
import SanityImage from "~/components/media/SanityImage";
import CallToActionModule from "~/components/modules/CallToAction";
import PortableText from "~/components/portableText/PortableText";
import { type SanityEventPage, useSanityEnvironment } from "~/lib/sanity";
import { useQuery } from "~/lib/sanity/loader";
import { ColorTheme } from "~/lib/theme";
import { notFound } from "~/lib/utils";
import { EVENT_PAGE_QUERY } from "~/queries/sanity/event";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  invariant(handle, "Missing event handle");

  const query = EVENT_PAGE_QUERY;
  const queryParams = { slug: handle };
  const initial = await context.sanity.loader.loadQuery<SanityEventPage>(
    query,
    queryParams
  );

  if (!initial.data) {
    throw notFound();
  }

  return json({ initial, query, queryParams });
}

export default function Event() {
  const { initial, query, queryParams } = useLoaderData<typeof loader>();

  const { error, data: event } = useQuery<SanityEventPage>(
    query,
    queryParams,
    // @ts-expect-error
    { initial }
  );

  const { projectId, dataset } = useSanityEnvironment();

  if (error) {
    throw error;
  } else if (!event) {
    return null;
  }

  const date =
    event?.date &&
    new Date(event?.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const price =
    typeof event?.price === "number" && event.price > 0
      ? Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(event.price)
      : null;
  const colorTheme =
    event?.image?.asset?.metadata && !event?.colorTheme
      ? {
          background: event.image.asset.metadata.palette.muted.background,
          text: event.image.asset.metadata.palette.muted.foreground,
        }
      : event?.colorTheme;

  return (
    <ColorTheme value={colorTheme}>
      <PageHero fallbackTitle="Event details" hero={{ title: event.title }} />
      <article className="grid grid-cols-1 gap-12 md:grid-cols-5">
        <div className="mb-auto flex flex-col items-start gap-4 py-4 md:col-span-3 md:col-start-3 md:gap-8 md:py-8">
          <div className="overflow-hidden rounded-xl">
            <SanityImage
              src={event?.image?.asset?._id}
              alt={event?.image?.alt}
              dataset={dataset}
              projectId={projectId}
              width={800}
            />
          </div>
          {event.callToAction ? (
            <CallToActionModule module={event.callToAction} />
          ) : null}
        </div>
        <div className="p-4 text-lg md:col-span-2 md:col-start-1 md:row-start-1 md:p-8">
          <h2 className="mb-8 text-xl font-bold">{date}</h2>

          <table className="mb-8 w-full border-b border-t border-purple-100">
            <tbody className="divide-y divide-purple-100">
              {event.capacity ? (
                <tr>
                  <td className="py-4 text-sm font-bold uppercase text-purple-400">
                    Capacity:
                  </td>
                  <td className="py-4">{event.capacity}</td>
                </tr>
              ) : null}
              {
                <tr>
                  <td className="py-4 text-sm font-bold uppercase text-purple-400">
                    Price:
                  </td>
                  <td className="py-4">
                    {Number(price) === 0 ? "Free" : price}
                  </td>
                </tr>
              }
            </tbody>
          </table>

          {event?.description ? (
            <PortableText className="text-lg" blocks={event?.description} />
          ) : null}
        </div>
      </article>
    </ColorTheme>
  );
}
