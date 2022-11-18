import {CacheNone, type HydrogenRouteProps} from '@shopify/hydrogen';
import StudioPage from '../../sanity/studio.client';

export default function Studio({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  return <StudioPage />;
}
