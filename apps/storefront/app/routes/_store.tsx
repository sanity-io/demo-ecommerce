import { Outlet, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen";

import { Layout } from "~/components/global/Layout";
import { VisualEditing } from "~/components/sanity/VisualEditing";

export async function loader({ context }: LoaderFunctionArgs) {
  const client = context.sanity.config();
  const { projectId, dataset } = client;

  const sanityEnv = {
    projectId,
    dataset,
    studioUrl: "/studio",
    client,
  };

  return json({
    sanityEnv,
  });
}

export default function Store() {
  const { sanityEnv } = useLoaderData<typeof loader>();

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>

      <script
        dangerouslySetInnerHTML={{
          __html: `window.SANITY_ENV = ${JSON.stringify(sanityEnv)}`,
        }}
      />
      <VisualEditing studioUrl={sanityEnv.studioUrl} />
    </>
  );
}
