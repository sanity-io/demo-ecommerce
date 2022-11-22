import {lazy, Suspense} from 'react';

/**
 * Provide a consistent fallback to prevent hydration mismatch errors.
 */
const StudioFallback = () => <></>;

/**
 * If server-side rendering, then return the fallback instead of the heavy dependency.
 */
const SanityStudio = import.meta.env.SSR
  ? StudioFallback
  : lazy(() => import('./SanityStudio.client'));

export default function Studio() {
  return (
    <Suspense fallback={<StudioFallback />}>
      <SanityStudio />
    </Suspense>
  );
}