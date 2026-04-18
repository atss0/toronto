import { Dimensions, useWindowDimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const guideLineBaseWidth = 360;
const guideLineBaseHeight = height < 800 ? 736 : 800;

export const wScale = (size: number) => width / guideLineBaseWidth * size;
export const hScale = (size: number) => height / guideLineBaseHeight * size;

export const useScaler = () => {
  const { width: w, height: h } = useWindowDimensions();
  const baseH = h < 800 ? 736 : 800;
  return {
    wScale: (size: number) => (w / 360) * size,
    hScale: (size: number) => (h / baseH) * size,
  };
};