import clsx from 'clsx';
import {Link, useUrl} from '@shopify/hydrogen';

export default function Preview() {
  const url = useUrl();

  return (
    <>
      <Link
        to={`/api/exit-preview?slug=${url.pathname}`}
        reloadDocument={true}
        className={clsx(
          'fixed bottom-4 left-4 z-10 z-10 ml-auto rounded bg-emerald-600 px-4 py-6 text-white shadow transition delay-150 duration-300 ease-in-out',
          'hover:-translate-y-1 hover:scale-110 hover:bg-emerald-700',
        )}
        role="banner"
      >
        <div className={clsx('mb-1 text-lg font-bold uppercase')}>
          Preview Mode
        </div>
        <div>Click to exit</div>
      </Link>
    </>
  );
}
