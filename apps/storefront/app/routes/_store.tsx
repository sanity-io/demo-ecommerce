import { Outlet, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { getPreview, PreviewProvider } from "hydrogen-sanity";

import { Layout } from "~/components/global/Layout";
import { PreviewLoading } from "~/components/global/PreviewLoading";
import { VisualEditing } from "~/components/sanity/VisualEditing";

export async function loader({ context }: LoaderFunctionArgs) {
  const preview = getPreview(context);
  const client = context.sanity.config();
  const { projectId, dataset } = client;

  const sanityEnv = {
    projectId,
    dataset,
    studioUrl: "http://localhost:3000/studio",
    client,
  };
  console.log("Heads up, studioUrl is: ", sanityEnv.studioUrl);
  return json({
    preview,
    sanityEnv,
  });
}

export default function Store() {
  const { preview, sanityEnv } = useLoaderData<typeof loader>();

  return (
    <>
      <PreviewProvider previewConfig={preview} fallback={<PreviewLoading />}>
        <Layout>
          <Outlet />
        </Layout>
      </PreviewProvider>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.SANITY_ENV = ${JSON.stringify(sanityEnv)}`,
        }}
      />
      <VisualEditing studioUrl={sanityEnv.studioUrl} />
    </>
  );
}
