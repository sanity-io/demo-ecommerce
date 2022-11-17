import {useSession} from '@shopify/hydrogen';

/**
 *  Check whether or not the user's session is in preview mode,
 *  i.e. the request has been routed through the preview endpoint.
 **/
export default function usePreviewMode(): boolean {
  const session = useSession();
  return typeof session.preview === 'boolean' ? session.preview : false;
}
