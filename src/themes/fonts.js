import SquareWOFF from "../assets/fonts/Inconsolata-Regular.ttf";
import SquareBoldWOFF from "../assets/fonts/Inconsolata-Bold.ttf";
import SquareSemiBoldWOFF from "../assets/fonts/Inconsolata-SemiBold.ttf";
import SquareItalicWOFF from "../assets/fonts/Inconsolata-Regular.ttf";
import SquareLightWOFF from "../assets/fonts/Inconsolata-Light.ttf";
import SquareMediumWOFF from "../assets/fonts/Inconsolata-Medium.ttf";

const square = {
  fontFamily: "Square",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('Inconsolata'),
		local('Inconsolata-Regular.'),
		url(${SquareWOFF}) format('truetype')
	`,
};

const squareLight = {
  fontFamily: "Square",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 300,
  src: `
		local('Inconsolata'),
		local('Inconsolata-Light'),
		url(${SquareLightWOFF}) format('truetype')
	`,
};

const squareMedium = {
  fontFamily: "Square",
  fontStyle: "medium",
  fontDisplay: "swap",
  fontWeight: 500,
  src: `
		local('Inconsolata'),
		local('Inconsolata-Medium'),
		url(${SquareMediumWOFF}) format('truetype')
	`,
};

const squareSemiBold = {
  fontFamily: "Square",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 600,
  src: `
		local('Inconsolata'),
		local('Inconsolata-SemiBold'),
		url(${SquareSemiBoldWOFF}) format('truetype')
	`,
};

const squareBold = {
  fontFamily: "Square",
  fontStyle: "bold",
  fontDisplay: "swap",
  fontWeight: 700,
  src: `
		local('Inconsolata-Bold'),
		local('Inconsolata-Bold'),
		url(${SquareBoldWOFF}) format('truetype')
	`,
};

const squareItalic = {
  fontFamily: "Square",
  fontStyle: "italic",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
		local('Inconsolata'),
		local('Inconsolata-Regular'),
		url(${SquareItalicWOFF}) format('truetype')
	`,
};

const fonts = [square, squareLight, squareMedium, squareBold, squareItalic];

export default fonts;
