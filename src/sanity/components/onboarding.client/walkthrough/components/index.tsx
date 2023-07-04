import {useRouter} from 'sanity/router';
import {Theme} from '../styles';
import WalkthroughModal from './modal';
import WalkthroughStep from './step';
import {Steps, TooltipProps} from './types';
import {useState} from 'react';

export default function createWalkthrough(
  setIndex: (n: number) => void,
  stepIndex: number,
  steps: Steps[],
  styleConfig: Theme,
  isDarkMode: boolean,
  shouldHide: (h: boolean) => void,
) {
  const {backgroundColor} = styleConfig;

  return function (props: TooltipProps) {
    const [spin, setSpin] = useState(false);
    const router = useRouter();

    if (!props.step.type) {
      throw new Error('Missing step type');
    }

    const isModalMode = props.step.type !== 'step';
    const Dialog = {
      modal: WalkthroughModal,
      step: WalkthroughStep,
    }[props.step.type];
    return (
      <div
        ref={props.tooltipProps.ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '12px',
          width: isModalMode ? '500px' : '315px',
          minHeight: isModalMode ? '310px' : 'auto',
          backgroundColor,
          border: '1px solid rgba(255, 255, 255, 0.002)',
          borderRadius: '6px',

          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Liberation Sans", Helvetica, Arial, system-ui, sans-serif',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '17px',
          letterSpacing: '0em',
          textAlign: 'left',
        }}
      >
        <Dialog
          {...props}
          nextStep={(componentProps: any, targetIndex?: number) => (e: any) => {
            e?.preventDefault();
            const nextStep = targetIndex ?? stepIndex + 1;
            const nextTarget = steps[nextStep]?.target as string;
            const nextUrl = steps[nextStep]?.url as string;
            const currentUrl = window.location.pathname;
            const isModalNext = steps[nextStep]?.type === 'modal';
            const shouldHideWhileSpinning = steps[nextStep]?.hideWhileSpinning;
            const afterLoad = steps[nextStep]?.afterLoad;

            shouldHide(!!shouldHideWhileSpinning);

            if (
              nextTarget &&
              nextUrl &&
              (nextUrl !== currentUrl || isModalNext)
            ) {
              // setSpin(true);
              // setShouldHideWhileSpinning(!!shouldHideWhileSpinning);
              router.navigateUrl({path: nextUrl, replace: true});
              Promise.resolve()
                .then(() => new Promise((resolve) => setTimeout(resolve, 333)))
                .then(() => afterLoad?.())
                .then(() => waitForElem(nextTarget))
                .then((elem) => {
                  elem?.scrollIntoView({behavior: 'instant', block: 'center'});
                  setSpin(false);
                  setIndex(nextStep);
                })
                .finally(() => {
                  shouldHide(false);
                })
                .catch(() => {
                  componentProps.closeProps.onClick(e);
                  setIndex(nextStep);
                });
              setSpin(true);
            } else {
              Promise.resolve()
                .then(() => new Promise((resolve) => setTimeout(resolve, 333)))
                .then(() => afterLoad?.())
                .then(() => {
                  const element = document.querySelector(nextTarget);
                  if (
                    element &&
                    element?.getBoundingClientRect().bottom > window.innerHeight
                  ) {
                    element?.scrollIntoView({
                      behavior: 'instant',
                      block: 'center',
                    });
                    Promise.resolve()
                      .then(
                        () =>
                          new Promise((resolve) => setTimeout(resolve, 333)),
                      )
                      .then(() => {
                        setIndex(nextStep);
                      });
                  } else {
                    setIndex(nextStep);
                  }
                })
                .finally(() => {
                  shouldHide(false);
                });
            }
          }}
          spin={spin}
          setIndex={setIndex}
          styleConfig={styleConfig}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  };
}

function waitForElem(selector: string, timeout = 4000) {
  return new Promise(
    (resolve: (n: Element | null) => void, reject: () => void) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        reject();
      }, timeout);

      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },
  );
}
