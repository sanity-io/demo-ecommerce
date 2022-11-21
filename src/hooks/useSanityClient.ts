import PicoSanity from 'picosanity';
import sanityConfig from '../../sanity.config';
import usePreviewMode from './usePreviewMode';

export default function useSanityClient() {
  const preview = usePreviewMode();
  const {projectId, dataset, apiVersion} = sanityConfig;

  return new PicoSanity({
    projectId,
    dataset,
    apiVersion,
    ...(preview
      ? {
          useCdn: false,
          token: Oxygen.env.PRIVATE_SANITY_API_TOKEN,
        }
      : {}),
  });
}
