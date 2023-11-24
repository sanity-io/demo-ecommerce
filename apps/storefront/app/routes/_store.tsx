import { Outlet, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen";
import { getPreview, PreviewProvider } from "hydrogen-sanity";

import { Layout } from "~/components/global/Layout";
import { PreviewLoading } from "~/components/global/PreviewLoading";

export async function loader({ context }: LoaderFunctionArgs) {
  const preview = getPreview(context);

  return json({
    preview,
  });
}

export default function Store() {
  const { preview } = useLoaderData<typeof loader>();

  return (
    <PreviewProvider previewConfig={preview} fallback={<PreviewLoading />}>
      <Layout>
        <Outlet />
      </Layout>
    </PreviewProvider>
  );
}
