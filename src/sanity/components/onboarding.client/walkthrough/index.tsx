import {useEffect, useRef, useState} from 'react';
import Joyride, {CallBackProps, ACTIONS, STATUS, EVENTS} from 'react-joyride';
import createWalkthrough from './components';
import {steps} from './steps';
import {lightModeStyles, darkModeStyles} from './styles';

export default function OnboardingLayout(props: any) {
  const [run, setRun] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [closed, setClosed] = useState(false);
  const [hide, setHide] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const [isMinWidth, setIsMinWidth] = useState(false);
  const [isMinHeight, setIsMinHeight] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const minWidthRef = useRef(window?.matchMedia('(min-width: 1240px)'));
  const minHeightRef = useRef(window?.matchMedia('(min-height: 620px)'));
  const darkModeRef = useRef(
    window?.matchMedia('(prefers-color-scheme: dark)'),
  );

  const styleConfig = isDarkMode ? darkModeStyles : lightModeStyles;

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
      setIsDarkMode(currentDarkModRef?.matches ?? false);
      clearTimeout(initialCheck);
    }, 2000);

    const continueTour = (payload: any) => {
      setRun(true);
      setClosed(false);
      if (payload?.detail?.step >= 0) {
        setStepIndex(payload.detail.step);
      }
    };

    window.addEventListener('continue-tour', continueTour);

    return () => {
      currentDarkModRef?.removeEventListener('change', handleDarkMode);
      currentMinWidthRef?.removeEventListener('change', handleMinWidth);
      currentMinHeightRef?.removeEventListener('change', handleMinHeight);

      window.removeEventListener('continue-tour', continueTour);
    };
  }, []);

  useEffect(() => {
    if (!closed) {
      const matchesRequirements = true && isMinWidth && isMinHeight;
      setRun(matchesRequirements);
      setAllowed(matchesRequirements);
    }
  }, [isMinWidth, isMinHeight, closed]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('tour-step', {detail: {step: stepIndex}}),
    );
  }, [stepIndex]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('tour-running', {detail: {run, closed, allowed}}),
    );
  }, [run, closed, allowed]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const {action, index, status, type} = data;
    if (stepIndex !== index) {
      // manual change, not using primary button
      return;
    }

    if (status === STATUS.FINISHED) {
      setStepIndex(0);
    }

    if (
      action === ACTIONS.CLOSE ||
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED
    ) {
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
          run={run && !hide}
          showSkipButton={false}
          steps={steps}
          disableOverlayClose={true}
          disableOverlay={false}
          /*
          // @ts-ignore */
          tooltipComponent={createWalkthrough(
            setStepIndex,
            stepIndex,
            steps,
            styleConfig,
            isDarkMode,
            setHide,
          )}
          styles={{
            options: {
              arrowColor: styleConfig.backgroundColor,
              overlayColor: `rgba(11, 11, 11, ${isDarkMode ? 0.8 : 0.4})`,
            },
          }}
          stepIndex={stepIndex}
        />
      }
    </div>
  );
}
