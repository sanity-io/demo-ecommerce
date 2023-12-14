import { Outlet, useLoaderData } from "@remix-run/react";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@shopify/remix-oxygen";
import { getPreview, PreviewProvider } from "hydrogen-sanity";

import { Layout } from "~/components/global/Layout";
import { PreviewLoading } from "~/components/global/PreviewLoading";
import stylesheet from "~/styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesheet },
    {
      href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,500;0,700;1,500;1,700&display=swap",
      rel: "stylesheet",
    },
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
      crossOrigin: "anonymous",
    },
  ];
};

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
