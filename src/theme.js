import {createTheme} from "@mui/material";

const theme = createTheme({
    palette: {
        common: {
            black: "#100620",
            grey: '#878787',
            light: "#FBFAFB"
        },
        primary: {
            dark: '#31115F',
            main: "#7229D9",
            light: "#F5F0FC",
            contrastText: '#FFFFFF'
        },
        secondary: {
            dark: '#5F1157',
            main: "#D929C7",
            light: '#FCF0FB',
            contrastText: "#FFFFFF"
        },
        success: {
            dark: '#064125',
            main: '#12B76A',
            light: '#EBFDF4',
            contrastText: '#FFFFFF'
        },
        error: {
            dark: '#620D07',
            main: '#f04438',
            light: '#FEF2F1'
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: '"Nunito", sans-serif'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                elevation: {
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    height: 45,
                    borderRadius: 10
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    height: 45,
                    borderRadius: 10
                },
                input: {
                    height: '0.75em'
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    lineHeight: 1.25,
                    fontSize: 14,
                    fontFamily: '"Nunito", sans-serif'
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    background: '#f1f1f1',
                    borderRadius: 10,
                    padding: '12px 15px'
                },
                input: {
                    paddingTop: 0,
                    paddingBottom: 0,
                    fontSize: 14
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    padding: 20,
                    borderRadius: 20,
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontFamily: '"Nunito", sans-serif'
                },
                head: {
                    fontWeight: 600
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: "none",
                    boxShadow: "0px 5px 8px 0px rgba(11, 41, 151, 0.2)"
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: "none"
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontSize: 16
                }
            }
        }
    }
});

export default theme;