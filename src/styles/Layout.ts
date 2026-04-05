import { wScale, hScale } from './Scaler';

const Layout = {
  // Yatay kenar boşlukları (sağ & sol) — tüm ekranlarda standart
  screenPaddingH: wScale(24),

  // Dikey kenar boşlukları
  screenPaddingTop: hScale(40),
  screenPaddingBottom: hScale(24),

  // İçerik alanı tam yatay padding objesi (spread için)
  screenPadding: {
    paddingHorizontal: wScale(24),
    paddingTop: hScale(40),
    paddingBottom: hScale(24),
  },
};

export default Layout;
