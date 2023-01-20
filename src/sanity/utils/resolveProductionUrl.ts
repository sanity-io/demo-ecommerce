import type {
  ResolveProductionUrlContext,
  SanityDocumentLike,
  Slug,
} from 'sanity';

type store = {
  slug: Slug;
};

export default async function resolveProductionUrl(
  _: string | undefined,
  context: ResolveProductionUrlContext,
) {
  const {document} = context;

  return resolvePreviewUrl(document);
}

export const resolvePreviewUrl = (document: SanityDocumentLike) => {
  const previewUrl = new URL('/api/preview', location.origin);

  previewUrl.searchParams.append(
    `secret`,
    import.meta.env.PUBLIC_PREVIEW_SECRET,
  );

  if (document?._type === 'page') {
    const slug = (document?.slug as Slug)?.current;
    const path = slug == null ? '/' : `pages/${slug}`;

    previewUrl.searchParams.append('slug', path);

    return previewUrl.toString();
  }

  if (document?._type === 'product') {
    const slug = (document?.store as store)?.slug?.current;
    const path = slug == null ? '/' : `products/${slug}`;

    previewUrl.searchParams.append('slug', path);

    return previewUrl.toString();
  }

  return '';
};
