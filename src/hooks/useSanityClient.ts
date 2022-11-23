import PicoSanity from 'picosanity';
import usePreviewMode from './usePreviewMode';

export default function useSanityClient() {
  const preview = usePreviewMode();

  return new PicoSanity({
    projectId: import.meta.env.SANITY_PROJECT_ID,
    dataset: import.meta.env.SANITY_DATASET,
    apiVersion: import.meta.env.SANITY_API_VERSION,
    ...(preview
      ? {
          useCdn: false,
          token: import.meta.env.SANITY_API_TOKEN,
        }
      : {}),
  });
}
