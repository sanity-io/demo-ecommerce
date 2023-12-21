import { Outlet } from "@remix-run/react";
import type { LinksFunction } from "@shopify/remix-oxygen";

import { Layout } from "~/components/global/Layout";
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

export default function Store() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
