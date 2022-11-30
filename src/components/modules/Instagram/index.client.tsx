import {lazy, Suspense} from 'react';
import type {SanityModuleInstagram} from '../../../types';

const InstagramFallback = () => <>loading...</>;

const InstagramModule = import.meta.env.SSR
  ? InstagramFallback
  : lazy(() => import('./Instagram.client'));

export default function Instagram({module}: {module: SanityModuleInstagram}) {
  return (
    <Suspense fallback={<InstagramFallback />}>
      <InstagramModule module={module} />
    </Suspense>
  );
}
