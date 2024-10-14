import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#194868", // Dark Blue
    secondary: "#FF615F",   // peach

    // colors
    black: "#1E1F20",
    white: "#FFFFFF",
    lightGray: "#F5F7F9",
    lightGray2: '#FAFBFD',
    gray: "#BEC1D2",
    blue: '#42B0FF',
    darkgray: '#898C95',
    yellow: '#FFD573',
    lightBlue: '#95A9B8',
    darkgreen: '#008159',
    peach: '#FF615F',
    purple: '#8e44ad',
    red: '#FF0000',
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,
    padding2: 36,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,

    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Roboto-Regular", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22 },
};
export const colorScales = [
    '#E52B50', '#FFBF00', '#9966CC', '#8DB600', '#BE0032', '#FBCEB1', '#7FFFD4', '#007FFF', '#89CFF0', '#F5F5DC', '#CB4154', '#0095B6', '#8A2BE2', '#DE5D83', '#CD7F32', '#993300', '#800020', '#702963', '#960018', '#DE3163',
    '#02A4D3', '#F7E7CE', '#7FFF00', '#7B3F00', '#0047AB', '#B87333', '#FF7F50', '#DC143C', '#00FFFF', '#EDC9AF', '#7DF9FF', '#50C878', '#00C957', '#00FF3F', '#FFD700', '#808080', '#009900', '#3FFF00', '#4B0082', '#00A86B',
    '#29AB87', '#B57EDC', '#6A0DAD', '#E30B5C', '#FF0000', '#C71585', '#FF007F', '#E0115F', '#B7410E', '#FA8072', '#92000A', '#0F52BA', '#FF2400', '#C0C0C0', '#708090', '#A7FC00', '#00FF7F', '#D2B48C', '#483C32', '#008080',
    '#40E0D0', '#3F00FF', '#8000FF', '#40826D'
];
export const month = [
    'All', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const appTheme = { COLORS, SIZES, FONTS, colorScales, month };

export default appTheme;