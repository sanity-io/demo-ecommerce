import { Await, useLoaderData, useParams } from "@remix-run/react";

import {
  loader as queryStore,
  type SanityHeroPage,
  type SanityPage,
  useSanityEnvironment,
} from "~/lib/sanity";
const { useQuery } = queryStore;

import {
  defer,
  LoaderFunctionArgs,
  SerializeFrom,
} from "@shopify/remix-oxygen";
import { Suspense } from "react";
import invariant from "tiny-invariant";

import PageHero from "~/components/heroes/Page";
import SanityImage from "~/components/media/SanityImage";
import { ColorTheme } from "~/lib/theme";
import { notFound } from "~/lib/utils";

const EVENT_QUERY = `*[_type == "event" && slug.current == $slug][0]`;

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  invariant(handle, "Missing event handle");

  const event = await context.sanity.loader.loadQuery(
    EVENT_QUERY,
    {
      slug: handle,
    },
    { perspective: "previewDrafts" }
  );

  if (!event.data) {
    throw notFound();
  }
  return defer({ event });
}

export default function Event() {
  const { event: eventData } = useLoaderData<SerializeFrom<typeof loader>>();
  const { handle } = useParams();

  //return <pre>{JSON.stringify(event, null, 2)}</pre>;
  const { error, data: event } = useQuery(
    EVENT_QUERY,
    {
      slug: handle,
    },
    { initial: eventData }
  );
  if (error) {
    throw error;
  }
  const { projectId, dataset } = useSanityEnvironment();
  const date = event?.date && new Date(event?.date).toLocaleDateString();
  return (
    <ColorTheme value={event?.colorTheme}>
      <Suspense>
        <PageHero fallbackTitle={event?.title || ""} />
        <SanityImage
          src={event?.image?.asset?._ref}
          alt={event?.image?.alt}
          dataset={dataset}
          projectId={projectId}
        />
        <p>Time: {date}</p>
        <p>{event?.description}</p>
      </Suspense>
    </ColorTheme>
  );
}
