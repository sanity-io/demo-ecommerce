import {useState} from 'react';
import {useRouter} from 'sanity/router';
import {TooltipProps} from './types';

export default function WalkthroughStep(props: TooltipProps) {
  const [spin, setSpin] = useState(false);
  const router = useRouter();

  return spin ? (
    <SpinnerIcon />
  ) : (
    <>
      <span style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '18px'}}>
        <span>{props.step.chapter}</span>
      <button
        style={{
          color: '#101112',
          background: '#FFFFFF',
          borderRadius: '3px',
          padding: '6px 10px',
        }}
        {...props.primaryProps}
        onClick={(e) => {
          e.preventDefault();
          const {nextUrlTarget, nextUrl} = props.step;
          if (nextUrlTarget && nextUrl) {
            router.navigateUrl({path: nextUrl});
            Promise.resolve()
              .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
              .then(() => waitForElem(nextUrlTarget))
              .then(() => {
                props.primaryProps.onClick(e);
              })
              .catch(() => {
                props.closeProps.onClick(e);
              });
            setSpin(true);
          } else {
            props.primaryProps.onClick(e);
          }
        }}
      >
        NEXT
      </button>
    </>
  );
}

function waitForElem(selector: string) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
