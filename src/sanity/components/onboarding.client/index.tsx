import {useEffect, useRef, useState} from 'react';
import Joyride, {CallBackProps, ACTIONS, STATUS, EVENTS} from 'react-joyride';
import createWalkthrough from './steps';
import {Steps} from './steps/types';
import {BlueImg, RedImg, GreenImg} from './assets';

export default function OnboardingLayout(props: any) {
  const [run, setRun] = useState(false);
  const [closed, setClosed] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const [isMinWidth, setIsMinWidth] = useState(false);
  const [isMinHeight, setIsMinHeight] = useState(false);

  const minWidthRef = useRef(window?.matchMedia('(min-width: 980px)'));
  const minHeightRef = useRef(window?.matchMedia('(min-height: 620px)'));

  useEffect(() => {
    const handleMinWidth = ({matches}: MediaQueryListEvent) =>
      setIsMinWidth(matches);
    const currentMinWidthRef = minWidthRef.current;
    currentMinWidthRef?.addEventListener('change', handleMinWidth);

    const handleMinHeight = ({matches}: MediaQueryListEvent) =>
      setIsMinHeight(matches);
    const currentMinHeightRef = minHeightRef.current;
    currentMinHeightRef?.addEventListener('change', handleMinHeight);

    // for first render
    const initialCheck = setTimeout(() => {
      setIsMinWidth(currentMinWidthRef?.matches ?? false);
      setIsMinHeight(currentMinHeightRef?.matches ?? false);
      clearTimeout(initialCheck);
    }, 2000);

    return () => {
      currentMinWidthRef?.removeEventListener('change', handleMinWidth);
      currentMinHeightRef?.removeEventListener('change', handleMinHeight);
    };
  }, []);

  useEffect(() => {
    if (!closed) {
      const matchesRequirements = true && isMinWidth && isMinHeight;
      setRun(matchesRequirements);
    }
  }, [isMinWidth, isMinHeight, closed]);

  const steps: Steps[] = [
    {
      target: 'body',
      placement: 'center',
      content: null,
      title: 'Welcome to a Sanity Studio',
      subtitle:
        'Super short about where we are and what this tour is (3 short steps)',
      type: 'modal',
    },
    {
      target: "[data-ui='Navbar'] [data-ui='Button']", // logo
      chapter: 'The Studio',
      themeColor: '#4E91FC',
      chapterPosition: 1,
      chapterLength: 3,
      title: 'This is a Sanity Studio for a store called AKVA',
      disableBeacon: true,
      placement: 'bottom-start',
      image: BlueImg,
      content:
        '[This is where their editors do stuff]\n[connected to content lake, through apis]',
      nextUrl: '/studio/desk/home',
      nextUrlTarget: "[data-testid='permission-check-banner']",
      type: 'step',
    },
    {
      target: "[data-testid='permission-check-banner']", // roles warning banner
      chapter: 'The Studio',
      themeColor: '#4E91FC',
      chapterPosition: 2,
      chapterLength: 3,
      title: 'Read only demo',
      disableBeacon: true,
      placement: 'bottom',
      content:
        'Every Studio is different. You can customize it however you want. That’s the power of Sanity, you can get it just the way you’d want',
      type: 'step',
    },
    {
      target: 'body',
      chapter: 'The Studio',
      themeColor: '#4E91FC',
      chapterPosition: 3,
      chapterLength: 3,
      title: 'Create your own workspace',
      disableBeacon: true,
      placement: 'center',
      content:
        'Every Studio is different. You can customize it however you want. That’s the power of Sanity, you can get it just the way you’d want',
      type: 'step',
    },
    {
      target: "[href='/studio/desk/guides']",
      chapter: 'The Sanity Way',
      themeColor: '#F36458',
      chapterPosition: 1,
      chapterLength: 3,
      title: 'Documents and references',
      disableBeacon: true,
      placement: 'right',
      type: 'step',
      image: RedImg,
      content:
        'Every Studio is different. You can customize it however you want. That’s the power of Sanity, you can get it just the way you’d want',
      nextUrl: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
      nextUrlTarget: "[data-testid='field-hero.content']",
    },
    {
      target: "[data-testid='field-hero.content']",
      chapter: 'The Sanity Way',
      themeColor: '#F36458',
      chapterPosition: 2,
      chapterLength: 3,
      title: 'Content as data',
      disableBeacon: true,
      placement: 'left-end',
      content:
        'Every Studio is different. You can customize it however you want. That’s the power of Sanity, you can get it just the way you’d want',
      type: 'step',
    },
    {
      target: "[data-testid='field-hero.content']",
      chapter: 'The Sanity Way',
      themeColor: '#F36458',
      chapterPosition: 3,
      chapterLength: 3,
      title: 'Rich commerce experience',
      disableBeacon: true,
      placement: 'left-end',
      content:
        'Every Studio is different. You can customize it however you want. That’s the power of Sanity, you can get it just the way you’d want',
      type: 'step',
    },
    {
      target: "[data-testid='field-hero.content']",
      chapter: 'Ecommerce use cases',
      themeColor: '#43D675',
      chapterPosition: 1,
      chapterLength: 3,
      image: GreenImg,
      disableBeacon: true,
      placement: 'left-end',
      content: 'This another awesome feature!',
      type: 'step',
    },
    {
      target: "[data-testid='field-hero.content']",
      chapter: 'Ecommerce use cases',
      themeColor: '#43D675',
      chapterPosition: 2,
      chapterLength: 3,
      title: 'Synced with Shopify',
      disableBeacon: true,
      placement: 'left-end',
      content:
        'Every Studio is different. You can customize it however you want. That’s the power of Sanity, you can get it just the way you’d want',
      type: 'step',
    },
    {
      target: "[data-testid='field-hero.content']",
      chapter: 'Ecommerce use cases',
      themeColor: '#43D675',
      chapterPosition: 3,
      chapterLength: 3,
      title: 'Live preview, side by side',
      disableBeacon: true,
      placement: 'left-end',
      content:
        'Every Studio is different. You can customize it however you want. That’s the power of Sanity, you can get it just the way you’d want',
      type: 'step',
    },
    {
      target: 'body',
      placement: 'center',
      content: null,
      title: 'That’s the tour!..',
      subtitle:
        '... but we haven’t even gotten to features like real time editing, presence, revision history, image hotspot, mobile, a11y, responsiveness, AI plugins – and so much more!',
      type: 'modal',
    },
  ];

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const {action, index, status, type} = data;
    if (stepIndex !== index) {
      // manual change, not using primary button
      return;
    }

    if (
      action === ACTIONS.CLOSE ||
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED
    ) {
      setStepIndex(0);
      setRun(false);
      setClosed(true);
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }
  };

  return (
    <div style={{widows: '100vw', height: '100vh'}}>
      {props.renderDefault(props)}
      {
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          disableScrolling
          hideBackButton
          hideCloseButton
          run={run}
          showSkipButton={false}
          steps={steps}
          disableOverlayClose={true}
          disableOverlay={false}
          /*
          // @ts-ignore */
          tooltipComponent={createWalkthrough(setStepIndex)}
          styles={{
            options: {
              arrowColor: '#101112',
              overlayColor: 'rgba(11, 11, 12, 0.4)',
              // primaryColor: '#000000',
              // width: 900,
            },
          }}
          stepIndex={stepIndex}
        />
      }
    </div>
  );
}
