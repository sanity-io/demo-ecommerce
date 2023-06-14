import {useState} from 'react';
import {useRouter} from 'sanity/router';
import {TooltipProps} from './types';
import SpinnerIcon from '../../../../../components/icons/Spinner';
// @ts-expect-error incompatibility with node16 resolution
import {ArrowRightIcon, CloseIcon, ArrowTopRightIcon} from '@sanity/icons';

export default function WalkthroughStep(props: TooltipProps) {
  const [spin, setSpin] = useState(false);
  const router = useRouter();
  const {themeColor, chapterPosition, chapterLength, externalLink} = props.step;
  const hasChapter =
    themeColor &&
    chapterPosition &&
    chapterPosition > 0 &&
    chapterLength &&
    chapterLength > 0;

  const {titleColor, textColor, backgroundColor} = props.styleConfig;
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
          margin: '0 16px 16px 16px',
        }}
      >
        <span
          style={{
            background: themeColor ?? '#4E91FC',
            borderRadius: '3px',
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: '11px',
            color: titleColor,
            letterSpacing: '0.5px',
            padding: '2px 4px',
          }}
        >
          {props.step.chapter}
        </span>
        <button {...props.closeProps}>
          <CloseIcon style={{fontSize: '1.5em', color: textColor}} />
        </button>
      </span>
      <h2
        style={{
          fontStyle: 'normal',
          fontWeight: 700,
          fontSize: '21px',
          lineHeight: '27px',
          letterSpacing: '0.5PX',
          color: titleColor,
          marginBottom: '10px',
        }}
      >
        {props.step.title}
      </h2>
      <p
        style={{
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '13px',
          lineHeight: '17px',
          marginBottom: '12px',
          color: textColor,
        }}
      >
        {props.step.content}
      </p>
      {externalLink && (
        <a
          target="_blank"
          href={`${externalLink.url}/?ref=ecommerce-walkthrough`}
          rel="noreferrer"
          style={{
            alignSelf: 'flex-start',
            color: titleColor,
            fontStyle: 'semibold',
            cursor: 'pointer',
          }}
        >
          {externalLink.text}
          <ArrowTopRightIcon
            style={{
              color: themeColor,
              transform: 'scale(2.7)',
              paddingLeft: '5px',
              marginTop: '-2px',
            }}
          />
        </a>
      )}
      {typeof props.step.image === 'function' && (
        <div
          style={{
            width: '100%',
            resize: 'horizontal',
            height: 'auto',
            overflow: 'hidden',
          }}
        >
          {props.step.image()}
        </div>
      )}
      <span
        style={{
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: '13px',
          color: textColor,
          alignSelf: 'flex-start',
          margin: '12px 0',
        }}
      >
        Hit <strong>⏎ Enter</strong> to proceed
      </span>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '4px',
          marginBottom: '12px',
        }}
      >
        {hasChapter &&
          Array.from(Array(props.step.chapterLength), (_, i) =>
            chapterPositionCrumbs(
              themeColor,
              i === (chapterPosition as number) - 1,
            ),
          )}
      </div>
      <button
        style={{
          color: backgroundColor,
          background: titleColor,
          borderRadius: '3px',
          padding: '8px',
          width: '100%',
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
        Next{' '}
        <ArrowRightIcon style={{fontSize: '1.5em', paddingBottom: '1px'}} />
      </button>
    </>
  );
}

function chapterPositionCrumbs(color: string, selected: boolean) {
  return (
    <div
      style={{
        borderRadius: '1.5px',
        height: '3px',
        flex: 1,
        background: color,
        opacity: selected ? 1 : 0.4,
      }}
    />
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