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
      {preview && <Preview />}
      <div className="absolute left-0 top-0">
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
