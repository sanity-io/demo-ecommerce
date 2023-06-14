import {useEffect, useRef} from 'react';

export default function Navbar(props: any) {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const element = useRef<HTMLDivElement | null>(null);

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
        TEST
      </div>
      {props.renderDefault(props)}
    </>
  );
}
