import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const guideLineBaseWidth = 360;
const guideLineBaseHeight = height < 800 ? 736 : 800;

export const wScale = (size: number) => width / guideLineBaseWidth * size;
export const hScale = (size: number) => height / guideLineBaseHeight * size;