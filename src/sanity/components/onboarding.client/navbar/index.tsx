import {useEffect, useRef, useState} from 'react';

export default function Navbar(props: any) {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const element = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleTourStep = (e: any) => {
      setStep(e.detail.step);
    };

    window.addEventListener('tour-step', handleTourStep);
    return () => {
      window.removeEventListener('tour-step', handleTourStep);
    };
  }, []);

  useEffect(() => {
    // pretty brittle, but it works
    navbarRef.current = document.querySelector(
      '[data-ui="Navbar"] > div > div:last-child',
    );

    if (element.current && navbarRef.current) {
      navbarRef.current.insertBefore(
        element.current,
        navbarRef.current.firstChild,
      );

      element.current.style.visibility = 'visible';
    }
  }, []);

  return (
    <>
      <div
        ref={element}
        style={{
          visibility: 'hidden',
          display: 'flex',
          alignSelf: 'stretch',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid #3f434a',
          marginRight: '8px',
          paddingRight: '8px',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={() => {
            window.dispatchEvent(new Event('continue-tour'));
          }}
        >
          Continue
        </button>
        Step: {step}
      </div>
      {props.renderDefault(props)}
    </>
  );
}
