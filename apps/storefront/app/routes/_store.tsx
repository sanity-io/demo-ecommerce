import { Outlet } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@shopify/remix-oxygen";

import { Layout } from "~/components/global/Layout";

export async function loader({ context }: LoaderFunctionArgs) {
  return json({});
}

export default function Store() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
