import {HydrogenUseQueryOptions, useQuery, CacheNone} from '@shopify/hydrogen';
import useSanityClient from './useSanityClient';
import usePreviewMode from './usePreviewMode';

interface Props {
  /** A string of the GROQ query. */
  query: string;
  /** An object of the variables for the GROQ query. */
  params?: Record<string, unknown>;
  /** Query options to pass to Hydrogen's `useQuery` hook */
  options?: HydrogenUseQueryOptions;
}

export default function useSanityQuery<T>({
  options = {},
  query,
  params = {},
}: Props) {
  const preview = usePreviewMode();

  if (preview) {
    options.cache = CacheNone();
  }

  const client = useSanityClient();

  return useQuery<T>(
    [query, params, preview],
    () => client.fetch(query, params),
    options,
  );
}
