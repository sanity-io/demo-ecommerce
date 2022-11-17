import PicoSanity from 'picosanity';
import sanityConfig from '../../sanity.config';
import usePreviewMode from './usePreviewMode';

export default function useSanityClient() {
  const preview = usePreviewMode();
  return new PicoSanity({
    ...sanityConfig,
    ...(preview
      ? {
          useCdn: false,
          token: Oxygen.env.PRIVATE_SANITY_API_TOKEN,
        }
      : {}),
  });
}
