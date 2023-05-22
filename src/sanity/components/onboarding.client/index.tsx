import {useEffect, useState} from 'react';
import Joyride, {CallBackProps, ACTIONS, STATUS, EVENTS} from 'react-joyride';
import createWalkthrough from './steps';
import {Steps} from './steps/types';

export default function OnboardingLayout(props: any) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const isLandscape = window?.matchMedia('(orientation: landscape)')?.matches;
    const prefersLightmode = window?.matchMedia(
      '(prefers-color-scheme: light)',
    )?.matches;
    if (isLandscape && prefersLightmode) {
      setTimeout(() => setRun(true), 2000);
    }
  }, []);

  const steps: Steps[] = [
    {
      target: 'body',
      placement: 'center',
      content: null,
      title: 'Welcome to a Sanity Studio',
      subtitle:
        'Super short about where we are and what this tour is (3 short steps)',
      type: 'intro',
    },
    {
      target: "[data-ui='Navbar'] [data-ui='Button']", // logo
      disableBeacon: true,
      placement: 'bottom-start',
      content: 'This another awesome feature!',
      nextUrl: '/studio/desk/home',
      nextUrlTarget: "[data-testid='permission-check-banner']",
      type: 'step',
    },
    {
      target: "[data-testid='permission-check-banner']", // roles warning banner
      disableBeacon: true,
      placement: 'bottom',
      content: 'This another awesome feature!',
      type: 'step',
    },
    {
      target: 'body',
      disableBeacon: true,
      placement: 'center',
      content: 'This another awesome feature!',
      type: 'step',
    },
    {
      target: "[href='/studio/desk/guides']",
      disableBeacon: true,
      placement: 'right',
      content: 'This another awesome feature!',
      type: 'step',
      nextUrl: '/studio/desk/pages;1051150e-042e-45a6-881a-49ca2759ea63',
      nextUrlTarget: "[data-testid='field-hero.content']",
    },
    {
      target: "[data-testid='field-hero.content']",
      disableBeacon: true,
      placement: 'left-end',
      content: 'This another awesome feature!',
      type: 'step',
    },
    {
      target: 'body',
      placement: 'center',
      content: null,
      title: 'That’s the tour!..',
      subtitle:
        '... but we haven’t even gotten to features like real time editing, presence, revision history, image hotspot, mobile, a11y, responsiveness, AI plugins – and so much more!',
      type: 'final',
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
