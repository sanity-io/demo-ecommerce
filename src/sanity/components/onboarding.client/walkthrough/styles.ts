const black = '#101112';
const white = '#FFFFFF';

const gray50 = '#F2F3F5';
const gray100 = '#E6E8EC';
const gray400 = '#9EA6B3';
const gray500 = '#8690A0';
const gray600 = '#6E7683';
const gray900 = '#272A2E';
const gray950 = '#1B1D20';

const blue50 = '#E8F1FE';
const blue400 = '#4E91FC';
const blue950 = '#111B29';

const red50 = '#FDEBEA';
const red400 = '#F36458';
const red950 = '#261514';

const green50 = '#E7F9ED';
const green400 = '#43D675';
const green950 = '#14211A';

const highlights = [
  {
    '50': blue50,
    '400': blue400,
    '950': blue950,
  },
  {
    '50': red50,
    '400': red400,
    '950': red950,
  },
  {
    '50': green50,
    '400': green400,
    '950': green950,
  },
];

export const darkModeStyles: Theme = {
  backgroundColor: white,
  titleColor: black,
  textColor: gray600,
  buttons: {
    background: gray50,
    hover: gray100,
    color: gray600,
  },
  highlights,
};

export const lightModeStyles: Theme = {
  backgroundColor: black,
  titleColor: white,
  textColor: gray100,
  buttons: {
    background: gray950,
    hover: gray900,
    color: gray400,
  },
  highlights,
};

export interface Theme {
  backgroundColor: string;
  titleColor: string;
  textColor: string;
  buttons: {
    background: string;
    hover: string;
    color: string;
  };
  highlights: {
    '50': string;
    '400': string;
    '950': string;
  }[];
}
