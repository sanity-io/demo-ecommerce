import {Head} from '@shopify/hydrogen';
import groq from 'groq';
import {ReactNode} from 'react';
import {LINKS} from '../../fragments/sanity/links';
import useSanityQuery from '../../hooks/useSanityQuery';
import type {SanityMenuLink} from '../../types';
import usePreviewMode from '../../hooks/usePreviewMode';
import Footer from './Footer.server';
import Header from './Header.server';
import Preview from './Preview.client';
/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */

type Props = {
  backgroundColor?: string;
  children?: ReactNode;
};

export default function Layout({backgroundColor, children}: Props) {
  const preview = usePreviewMode();

  const {data: menuLinks} = useSanityQuery<SanityMenuLink[]>({
    query: QUERY_SANITY,
  });

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/src/index.css" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://shop.app/" />
        <link rel="preconnect" href="https://oxygenator.myshopify.com/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,500;0,700;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {preview && <Preview />}
      <div className="absolute top-0 left-0">
        <a
          href="#mainContent"
          className="sr-only p-4 focus:not-sr-only focus:block"
        >
          Skip to content
        </a>
      </div>
      <div
        className="max-w-screen flex min-h-screen flex-col"
        style={{background: backgroundColor}}
      >
        <Header menuLinks={menuLinks} />

        <main className="relative grow" id="mainContent" role="main">
          <div className="mx-auto pb-overlap">{children}</div>
        </main>
      </div>
      <Footer />
    </>
  );
}

const QUERY_SANITY = groq`
  *[_type == 'settings'][0].menu.links[] {
    ${LINKS}
  }
`;
