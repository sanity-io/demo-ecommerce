import {useState} from 'react';
import {useRouter} from 'sanity/router';
import {TooltipProps} from './types';
import SpinnerIcon from '../../../../components/icons/Spinner';
// @ts-expect-error incompatibility with node16 resolution
import {ArrowRightIcon, CloseIcon} from '@sanity/icons';

export default function WalkthroughStep(props: TooltipProps) {
  const [spin, setSpin] = useState(false);
  const router = useRouter();

  return spin ? (
    <div style={{margin: 'auto'}}>
      <SpinnerIcon />
    </div>
  ) : (
    <>
      <span
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '18px',
        }}
      >
        <span>{props.step.chapter}</span>
        <button {...props.closeProps}>
          <CloseIcon style={{fontSize: '1.5em'}} />
        </button>
      </span>
      <h1>{props.step.title}</h1>
      <div>{props.step.content}</div>
      <span>
        Hit <strong>⏎ Enter</strong> to proceed
      </span>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '4px',
        }}
      >
        <div
          style={{
            borderRadius: '1.5px',
            height: '3px',
            flex: 1,
            background: '#4E91FC',
          }}
        />
        <div
          style={{
            borderRadius: '1.5px',
            height: '3px',
            flex: 1,
            background: '#17396F',
          }}
        />
        <div
          style={{
            borderRadius: '1.5px',
            height: '3px',
            flex: 1,
            background: '#17396F',
          }}
        />
      </div>
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
        Next <ArrowRightIcon style={{fontSize: '1.5em'}} />
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
