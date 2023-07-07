import {useState} from 'react';
import {TooltipProps} from './types';
// @ts-expect-error incompatibility with node16 resolution
import {CheckmarkIcon, RevertIcon} from '@sanity/icons';
import {useToast} from '@sanity/ui';
import SpinnerIcon from '../../../../../components/icons/Spinner';

export default function WalkthroughModal(props: TooltipProps) {
  const {
    index,
    size,
    styleConfig: {backgroundColor, titleColor, textColor, buttons, highlights},
    isDarkMode,
    spin,
  } = props;
  const isLastStep = index + 1 >= size;
  const toast = useToast();

  if (spin) {
    return (
      <div style={{margin: 'auto'}}>
        <SpinnerIcon />
      </div>
    );
  }

  return (
    <>
      <header
        style={{
          marginTop: '20px',
          color: titleColor,
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
          color: textColor,
          fontSize: '16px',
          fontWeight: '400',
          lineHeight: '21px',
          letterSpacing: '0em',
          textAlign: 'center',
          width: '385px',
          margin: '20px 5px 30px 5px',
        }}
      >
        {props.step.subtitle}
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          ...(isLastStep && {color: buttons.color}),
        }}
      >
        {highlights.map((highlight, buttonIndex) => {
          // needs to be moved out elsewhere
          const minimumStep = [2, 5, 7][buttonIndex];
          const title = [
            '1. Sanity Studio',
            '2. Content Modeling',
            '3. Sanity for E-commerce',
          ][buttonIndex];
          const skip = [1, 4, 7][buttonIndex];
          return (
            <Button
              key={highlight['50']}
              completed={index > minimumStep}
              onClick={props.nextStep(props, skip)}
              title={title}
              color={highlight['400']}
              buttonStateColors={buttons}
              fontColor={titleColor}
              isDarkMode={isDarkMode}
            />
          );
        })}
        {isLastStep && (
          <button onClick={props.nextStep(props, 0)}>
            Retake tour <RevertIcon />
          </button>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: '48px',
        }}
      >
        <button
          style={{
            color: '#9EA6B3',
            cursor: 'pointer',
            padding: '6px',
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
                border: `1px solid ${isDarkMode ? '#f9b1ab' : '#F36458'}`,
                borderRadius: '3px',
                margin: '0 .5em',
                backgroundColor,
                color: titleColor,
              }}
              onClick={() => {
                window.open(
                  'https://www.sanity.io/contact/sales?ref=studio-demo-modal',
                  '_blank',
                );
              }}
            >
              Contact sales
            </button>
            <button
              style={{
                padding: '.5em .8em',
                color: backgroundColor,
                border: `1px solid ${titleColor}`,
                backgroundColor: titleColor,
                borderRadius: '3px',
                margin: '0 .5em',
              }}
              onClick={() => {
                navigator.clipboard.writeText(
                  'https://www.sanity.io/demos/ecommerce?ref=share-demo',
                );
                toast.push({
                  status: 'success',
                  title: 'Link copied to clipboard!',
                });
              }}
            >
              Share demo
            </button>
          </span>
        ) : (
          <button
            style={{
              color: backgroundColor,
              backgroundColor: titleColor,
              borderRadius: '3px',
              padding: '6px 10px',
            }}
            {...props.primaryProps}
            onClick={props.nextStep(props)}
          >
            <span style={{padding: '0 0.4em'}}>Start the tour</span>
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
  fontColor,
  isDarkMode,
  buttonStateColors,
}: {
  onClick: (e: any) => void;
  title: string;
  completed: boolean;
  color: string;
  fontColor: string;
  isDarkMode: boolean;
  buttonStateColors: {background: string; color: string; hover: string};
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
        backgroundColor: buttonStateColors.background,
        borderRadius: '3px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: buttonStateColors.background,

        flex: 'none',
        order: 0,
        alignSelf: 'center',
        flexGrow: 0,

        color: completed ? buttonStateColors.color : fontColor,
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '13px',
        lineHeight: '17px',
        boxSizing: 'border-box',
        ...(isHovering && {
          backgroundColor: buttonStateColors.hover,
          borderColor: buttonStateColors.hover,
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
          // mixBlendMode: 'screen',
          opacity: isDarkMode ? 1 : 0.15,
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
