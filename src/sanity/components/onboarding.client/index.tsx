import {useEffect, useRef, useState} from 'react';
import Joyride, {CallBackProps, ACTIONS, STATUS, EVENTS} from 'react-joyride';
import createWalkthrough from './components';
import {steps} from './steps';

export default function OnboardingLayout(props: any) {
  const [run, setRun] = useState(false);
  const [closed, setClosed] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const [isMinWidth, setIsMinWidth] = useState(false);
  const [isMinHeight, setIsMinHeight] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const minWidthRef = useRef(window?.matchMedia('(min-width: 980px)'));
  const minHeightRef = useRef(window?.matchMedia('(min-height: 620px)'));
  const darkModeRef = useRef(
    window?.matchMedia('(prefers-color-scheme: dark)'),
  );

  useEffect(() => {
    const handleMediaEvent =
      (func: React.Dispatch<React.SetStateAction<boolean>>) =>
      ({matches}: MediaQueryListEvent) =>
        func(matches);

    const handleDarkMode = handleMediaEvent(setIsDarkMode);
    const currentDarkModRef = darkModeRef.current;
    currentDarkModRef?.addEventListener('change', handleDarkMode);

    const handleMinWidth = handleMediaEvent(setIsMinWidth);
    const currentMinWidthRef = minWidthRef.current;
    currentMinWidthRef?.addEventListener('change', handleMinWidth);

    const handleMinHeight = handleMediaEvent(setIsMinHeight);
    const currentMinHeightRef = minHeightRef.current;
    currentMinHeightRef?.addEventListener('change', handleMinHeight);

    // for first render
    const initialCheck = setTimeout(() => {
      setIsMinWidth(currentMinWidthRef?.matches ?? false);
      setIsMinHeight(currentMinHeightRef?.matches ?? false);
      clearTimeout(initialCheck);
    }, 2000);

    return () => {
      currentDarkModRef?.removeEventListener('change', handleDarkMode);
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
          tooltipComponent={createWalkthrough(setStepIndex, isDarkMode)}
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
