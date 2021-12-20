import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import fonts from "./fonts";
import commonSettings from "./global.js";

// TODO: Break repeated use color values out into list of consts declared here
// then set the values in darkTheme using the global color variables
//green rgb(70,171,21)
//dark green rgb(91,196,34)
export const darkTheme = {
  color: "#FCFCFC",
  gold: "#09B6D6", // Light green
  goldDimmed: "#4DF3F6",
  goldBright: "AADA03",
  gray: "#A3A3A3",
  textHighlightColor: "#5bc422",
  backgroundColor: "#131313",
  paperBg: "#1F1F1F",
  paperBorder: "#323232",
  modalBg: "#24242699",
  popoverBg: "rgba(54, 56, 64, 0.99)",
  menuBg: "#080c00",
  backdropBg: "rgba(3, 10, 0, 0.5)",
  largeTextColor: "#F4D092",
  activeLinkColor: "#F5DDB4",
  activeLinkSvgColor:
    "brightness(0) saturate(100%) invert(84%) sepia(49%) saturate(307%) hue-rotate(326deg) brightness(106%) contrast(92%)",
  primaryButtonColor: "#f9f9f9",
  primaryButtonBG: "#F4D092",
  primaryButtonHoverBG: "#FFEA17", //gold became dark green
  secondaryButtonHoverBG: "rgba(54, 56, 64, 1)",
  outlinedPrimaryButtonHoverBG: "#FFEA17", //gold became dark green
  outlinedPrimaryButtonHoverColor: "#333333",
  outlinedSecondaryButtonHoverBG: "transparent",
  outlinedSecondaryButtonHoverColor: "#FFEA17", //gold became dark green
  containedSecondaryButtonHoverBG: "rgba(255, 255, 255, 0.15)",
  graphStrokeColor: "rgba(255, 255, 255, .1)",
  sidebarBackground: `linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)`,
};

export const dark = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: darkTheme.color,
      },
      palette: {
        type: "dark",
        background: {
          default: darkTheme.backgroundColor,
          paper: darkTheme.paperBg,
        },
        contrastText: darkTheme.color,
        primary: {
          main: darkTheme.color,
        },
        neutral: {
          main: darkTheme.color,
          secondary: darkTheme.gray,
        },
        text: {
          primary: darkTheme.color,
          secondary: darkTheme.gray,
        },
        graphStrokeColor: darkTheme.graphStrokeColor,
      },
      typography: {
        fontFamily: "Square",
      },
      props: {
        MuiSvgIcon: {
          color: darkTheme.color,
        },
      },
      overrides: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": fonts,
            body: {
              background: darkTheme.background,
            },
          },
        },
        MuiDrawer: {
          paper: {
            backgroundColor: darkTheme.paperBg,
            zIndex: 7,
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: darkTheme.paperBg,
            "&.ohm-card": {
              backgroundColor: `${darkTheme.paperBg}AA`,
              border: "1px solid " + darkTheme.paperBorder,
            },
            "&.ohm-modal": {
              backgroundColor: darkTheme.modalBg,
            },
            "&.ohm-menu": {
              backgroundColor: darkTheme.menuBg,
              backdropFilter: "blur(33px)",
            },
            "&.ohm-popover": {
              backgroundColor: darkTheme.popoverBg,
              color: darkTheme.color,
              backdropFilter: "blur(15px)",
            },
          },
        },
        MuiTooltip: {
          tooltip: {
            fontSize: "1.1em",
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: darkTheme.backdropBg,
          },
        },
        MuiLink: {
          root: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
              textDecoration: "none",
              "&.active": {
                color: darkTheme.color,
              },
            },
            "&.active": {
              color: darkTheme.color,
              textDecoration: "underline",
            },
          },
        },
        MuiTableCell: {
          root: {
            color: darkTheme.color,
          },
        },
        MuiInputBase: {
          root: {
            // color: darkTheme.gold,
          },
        },

        MuiOutlinedInput: {
          root: {
            "&:hover $notchedOutline": {
              borderColor: darkTheme.goldDimmed,
            },
            "&$focused $notchedOutline": {
              borderColor: darkTheme.gold,
            },
          },
        },
        MuiTab: {
          textColorPrimary: {
            color: darkTheme.gray,
            "&$selected": {
              color: darkTheme.gold,
            },
          },
        },
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: darkTheme.gold,
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: darkTheme.paperBg,
            "&:hover": {
              color: darkTheme.color,
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            selected: {
              backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "@media (hover:none)": {
              "&:hover": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
              },
              "&:focus": {
                color: darkTheme.color,
                backgroundColor: darkTheme.paperBg,
                borderColor: "transparent",
                outline: "#00000000",
              },
            },
          },
        },
        MuiButton: {
          root: {
            "&$disabled": {
              boxShadow: "none",
            },
          },
          containedPrimary: {
            color: darkTheme.primaryButtonColor,
            backgroundColor: darkTheme.gold,
            boxShadow: `0px 0px 10px 5px rgba(70,171,21,0.3)`,
            "&:hover": {
              backgroundColor: darkTheme.primaryButtonHoverBG,
              color: darkTheme.primaryButtonHoverColor,
              boxShadow: `0px 0px 5px 3px rgba(70,171,21,0.3)`,
            },
            "&:active": {
              backgroundColor: darkTheme.primaryButtonHoverBG,
              color: darkTheme.primaryButtonHoverColor,
            },
            "@media (hover:none)": {
              color: darkTheme.primaryButtonColor,
              backgroundColor: darkTheme.gold,
              "&:hover": {
                backgroundColor: darkTheme.primaryButtonHoverBG,
              },
            },
          },
          containedSecondary: {
            backgroundColor: darkTheme.paperBg,
            color: darkTheme.color,
            "&:hover": {
              backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
            },
            "&:active": {
              backgroundColor: darkTheme.containedSecondaryButtonHoverBG,
            },
            "&:focus": {
              backgroundColor: darkTheme.paperBg,
            },
            "@media (hover:none)": {
              color: darkTheme.color,
              backgroundColor: darkTheme.paperBg,
              "&:hover": {
                backgroundColor: `${darkTheme.containedSecondaryButtonHoverBG} !important`,
              },
            },
          },
          outlinedPrimary: {
            color: darkTheme.gold,
            borderColor: darkTheme.gold,
            "&:hover": {
              color: darkTheme.outlinedPrimaryButtonHoverColor,
              backgroundColor: darkTheme.primaryButtonHoverBG,
            },
            "@media (hover:none)": {
              color: darkTheme.gold,
              borderColor: darkTheme.gold,
              "&:hover": {
                color: darkTheme.outlinedPrimaryButtonHoverColor,
                backgroundColor: `${darkTheme.primaryButtonHoverBG} !important`,
                textDecoration: "none !important",
              },
            },
          },
          outlinedSecondary: {
            color: darkTheme.color,
            borderColor: darkTheme.color,
            "&:hover": {
              color: darkTheme.outlinedSecondaryButtonHoverColor,
              backgroundColor: darkTheme.outlinedSecondaryButtonHoverBG,
              borderColor: darkTheme.gold,
            },
          },
          textPrimary: {
            color: "#A3A3A3",
            "&:hover": {
              color: darkTheme.gold,
              backgroundColor: "#00000000",
            },
            "&:active": {
              color: darkTheme.gold,
              borderBottom: "#F8CC82",
            },
          },
          textSecondary: {
            color: darkTheme.color,
            "&:hover": {
              color: darkTheme.textHighlightColor,
            },
          },
          disabled: {
            boxShadow: "none",
          },
        },
        MuiRadio: {
          colorPrimary: {
            color: darkTheme.color,
            "&$checked": {
              color: darkTheme.gold,
            },
            "&:hover": {
              color: darkTheme.gold,
            },
          },
        },
        MuiSelect: {
          selectMenu: {
            color: darkTheme.gold,
          },
        },
        MuiSlider: {
          thumb: {
            border: `2px solid ${darkTheme.gold}`,
            color: darkTheme.paperBg,
            boxShadow: `0px 0px 10px ${darkTheme.gold}`,
            height: 18,
            width: 18,
          },
          track: {
            background: `linear-gradient(90deg,${darkTheme.goldBright},${darkTheme.gold} 90%)`,
            boxShadow: `0px 0px 10px ${darkTheme.gold}`,
            height: 8,
            borderRadius: 7,
          },
          rail: {
            border: `2px solid ${darkTheme.gold}`,
            color: darkTheme.paperBg,
            height: 5,
            borderRadius: 7,
          },
        },
      },
    },
    commonSettings,
  ),
);
