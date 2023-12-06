import {useEffect, useRef, useState} from 'react';
// @ts-expect-error incompatibility with node16 resolution
import {CheckmarkIcon} from '@sanity/icons';

export default function Navbar(props: any) {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const element = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState(0);
  const [run, setRun] = useState(false);
  const [closed, setClosed] = useState(true);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const handleTourStep = (e: any) => {
      setStep(e.detail.step);
    };
    const handleTourVisible = (e: any) => {
      setRun(e.detail.run);
      setClosed(e.detail.closed);
      setAllowed(e.detail.allowed);
    };

    window.addEventListener('tour-step', handleTourStep);
    window.addEventListener('tour-running', handleTourVisible);
    return () => {
      window.removeEventListener('tour-step', handleTourStep);
      window.removeEventListener('tour-running', handleTourVisible);
    };
  }, []);

  useEffect(() => {
    // pretty brittle, but it works
    navbarRef.current = document.querySelector(
      '[data-ui="Navbar"] > div > div:last-child',
    );
    try {
      if (
        element.current &&
        navbarRef.current &&
        navbarRef.current.firstChild
      ) {
        navbarRef.current.insertBefore(
          element.current,
          navbarRef.current.firstChild,
        );

        element.current.style.visibility = 'visible';
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, []);

  return (
    <>
      <div
        ref={element}
        style={{
          visibility: 'hidden',
          display: allowed ? 'flex' : 'none',
          alignSelf: 'stretch',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRight: '1px solid #3f434a',
          paddingRight: '22px',
          margin: '0 18px',
          boxSizing: 'border-box',
          minWidth: '240px',
          gap: '10px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Liberation Sans", Helvetica, Arial, system-ui, sans-serif',
          letterSpacing: 0,
        }}
      >
        <button
          onClick={() => {
            window.dispatchEvent(new Event('continue-tour'));
          }}
          style={{
            color: '#ffffff',
            backgroundColor: '#272A2E',
            borderRadius: '16.5px',
            minWidth: '140px',
            height: '30px',
            padding: '6px 12px',
            fontSize: '13px',
            lineHeight: '17px',
            marginRight: '4px',
          }}
        >
          {!closed
            ? 'Tour in progress'
            : !run && step > 9
            ? 'Retake tour'
            : step > 0
            ? 'Continue tour'
            : 'Start the tour'}
        </button>
        <button
          onClick={() =>
            void window.dispatchEvent(
              new CustomEvent('continue-tour', {detail: {step: 1}}),
            )
          }
        >
          <CheckMark completed={step > 2} color="#4E91FC" />
        </button>
        <button
          onClick={() =>
            void window.dispatchEvent(
              new CustomEvent('continue-tour', {detail: {step: 4}}),
            )
          }
        >
          <CheckMark completed={step > 5} color="#F36458" />
        </button>
        <button
          onClick={() =>
            void window.dispatchEvent(
              new CustomEvent('continue-tour', {detail: {step: 7}}),
            )
          }
        >
          <CheckMark completed={step > 8} color="#43D675" />
        </button>
        <span style={{marginLeft: '4px', color: '#9EA6B3'}}>
          {getSectionsCompleted(step)}
        </span>
      </div>
      {props.renderDefault(props)}
    </>
  );
}

function CheckMark({completed, color}: {completed: boolean; color: string}) {
  return (
    <CheckmarkIcon
      style={{
        background: '#FFFFFF',
        color: '#FFFFFF',
        maxWidth: '15px',
        maxHeight: '15px',
        opacity: 0.15,
        transform: 'zoom(1.5)',
        fontWeight: 'bold',
        flex: 'none',
        order: 3,
        flexGrow: 0,
        border: '2px solid #FFFFFF',
        borderRadius: '50%',
        ...(completed && {
          backgroundColor: color,
          borderColor: color,
          opacity: 1,
        }),
      }}
    />
  );
}

function getSectionsCompleted(step: number) {
  const sections = step < 3 ? 0 : step < 6 ? 1 : step < 9 ? 2 : 3;
  const stepCopy = sections === 1 ? 'step' : 'steps';
  return `${sections}/3 ${stepCopy} completed`;
}
