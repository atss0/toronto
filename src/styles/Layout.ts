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

  // ─── Border Radius Token Sistemi ─────────────────────────────────────
  borderRadius: {
    xs: wScale(8),
    sm: wScale(12),
    md: wScale(14),
    lg: wScale(16),
    xl: wScale(18),
    '2xl': wScale(20),
    pill: wScale(24),
    circle: wScale(9999),
  },

  // ─── Shadow / Elevation Token Sistemi ────────────────────────────────
  shadow: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.20,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // ─── Translucent ekranlar için StatusBar safe offset ─────────────────
  translucentTopOffset: hScale(52),

  // ─── Standart dokunma alanı boyutları ────────────────────────────────
  hitArea: {
    min: wScale(44),         // Apple HIG minimum
    backButton: wScale(44),  // Back/close buton boyutu
  },

  // ─── Header sabitleri ────────────────────────────────────────────────
  header: {
    paddingTop: hScale(16),
    paddingBottom: hScale(14),
  },
};

export default Layout;
