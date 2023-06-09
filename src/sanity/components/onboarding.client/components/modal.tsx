import {useState} from 'react';
import {TooltipProps} from './types';
// @ts-expect-error incompatibility with node16 resolution
import {CheckmarkIcon, RevertIcon, UploadIcon} from '@sanity/icons';

export default function WalkthroughModal(props: TooltipProps) {
  const {
    index,
    size,
    styleConfig: {titleTextColor, contentTextColor, isDarkMode},
  } = props;
  const isLastStep = index + 1 >= size;
  return (
    <>
      <header
        style={{
          color: titleTextColor,
          fontSize: '27px',
          fontWeight: '700',
          lineHeight: '33px',
          letterSpacing: '0.5px',
          textAlign: 'center',
        }}
      >
        {props.step.title}
      </header>
      <span
        style={{
          color: contentTextColor,
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '21px',
          letterSpacing: '0em',
          textAlign: 'center',
          width: '385px',
        }}
      >
        {props.step.subtitle}
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          ...(isLastStep && {color: '#9EA6B3'}),
        }}
      >
        <Button
          completed={index > 2}
          color="#2276FC"
          onClick={() => props.setIndex(1)}
          title="The Studio"
          isDarkMode={isDarkMode}
        />
        <Button
          completed={index > 5}
          color="#F36458"
          onClick={() => props.setIndex(3)}
          title="The Sanity way"
          isDarkMode={isDarkMode}
        />
        <Button
          completed={index >= 8}
          // color="#43D675"
          color="#3AB564"
          onClick={() => props.setIndex(5)}
          title="Ecommerce use case"
          isDarkMode={isDarkMode}
        />
        {isLastStep && (
          <button onClick={() => props.setIndex(0)}>
            Retake Tour <RevertIcon />
          </button>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <button
          style={{
            color: isLastStep
              ? isDarkMode
                ? '#FFFFFF'
                : '#101112'
              : isDarkMode
              ? '#9EA6B3'
              : '#6E7683',
            cursor: 'pointer',
          }}
          {...props.closeProps}
        >
          {isLastStep ? 'Keep exploring' : 'Explore on your own'}
        </button>
        {isLastStep ? (
          <span>
            <button
              style={{
                padding: '.5em .8em',
                border: '1px solid #F36458',
                borderRadius: '3px',
                margin: '0 .5em',
                backgroundColor: '#101112',
              }}
              onClick={() => {
                window.postMessage({studio: 'contact sales'});
              }}
            >
              Contact Sales
            </button>
            <button
              style={{
                padding: '.5em .8em',
                color: isDarkMode ? '#000000' : '#FFFFFF',
                backgroundColor: isDarkMode ? '#FFFFFF' : '#101112',
                borderRadius: '3px',
                margin: '0 .5em',
              }}
              onClick={() => {
                window.postMessage({studio: 'share'});
              }}
            >
              Share Demo <UploadIcon />
            </button>
          </span>
        ) : (
          <button
            style={{
              color: isDarkMode ? '#101112' : '#FFFFFF',
              backgroundColor: isDarkMode ? '#FFFFFF' : '#101112',
              borderRadius: '3px',
              padding: '6px 10px',
            }}
            {...props.primaryProps}
          >
            🪂 <span style={{padding: '0 0.4em'}}>Take the tour</span>
            <span style={{fontSize: '15px', verticalAlign: 'bottom'}}> →</span>
          </button>
        )}
      </div>
    </>
  );
}

function Button({
  onClick,
  title,
  completed,
  color,
  isDarkMode,
}: {
  onClick: () => void;
  title: string;
  completed: boolean;
  color: string;
  isDarkMode: boolean;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 10px',
        gap: '6px',
        cursor: 'pointer',

        width: '258px',
        height: '33px',
        backgroundColor: isDarkMode ? '#1B1D20' : '#F2F3F5',
        borderRadius: '3px',
        border: `2px solid ${isDarkMode ? '#111B29' : '#F2F3F5'}`,

        flex: 'none',
        order: 0,
        alignSelf: 'center',
        flexGrow: 0,

        color: isDarkMode ? '#FFFFFF' : '#101112',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '13px',
        lineHeight: '17px',
        boxSizing: 'border-box',
        ...(isHovering && {
          backgroundColor: isDarkMode ? '#272A2E' : '#E6E8EC',
          border: `2px solid ${isDarkMode ? '#272A2E' : '#E6E8EC'}`,
        }),
      }}
      onClick={onClick}
    >
      {title}
      <CheckmarkIcon
        style={{
          background: '#FFFFFF',
          color: '#FFFFFF',
          maxWidth: '15px',
          maxHeight: '15px',
          mixBlendMode: isDarkMode ? 'screen' : 'inherit',
          opacity: isDarkMode ? 0.15 : 1,
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
    </button>
  );
}
