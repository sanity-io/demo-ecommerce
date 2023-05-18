import {useEffect, useState} from 'react';
import Joyride, {Step} from 'react-joyride';

export default function OnboardingLayout(props: any) {
  const [run, setRun] = useState(false);
  useEffect(() => {
    const isLandscape = window?.matchMedia('(orientation: landscape)')?.matches;
    const prefersLightmode = window?.matchMedia(
      '(prefers-color-scheme: light)',
    )?.matches;
    if (isLandscape && prefersLightmode) {
      setTimeout(() => setRun(true), 2000);
    }
  }, []);

  const steps: Step[] = [
    {
      // target: 'body',
      target: "[href='/studio/desk/home']",
      placementBeacon: 'right-end',
      content: 'This is my awesome feature!',
    },
    {
      target: "[href='/studio/desk/products']",
      placementBeacon: 'right-end',
      content: 'This another awesome feature!',
    },
  ];

  return (
    <div style={{widows: '100vw', height: '100vh'}}>
      {props.renderDefault(props)}
      {run && (
        <Joyride
          // callback={handleJoyrideCallback}
          continuous
          disableScrolling
          hideBackButton
          hideCloseButton
          run={run}
          showSkipButton={false}
          steps={steps}
        />
      )}
    </div>
  );
}
