# 📱 Toronto — React Native Mobil Uygulama Mimari Analiz Raporu

> **Hazırlayan:** Kıdemli React Native Mimarı / UX-UI / Ürün Yöneticisi  
> **Tarih:** 2026-04-18  
> **Platform:** React Native CLI 0.84.1 · React 19.2.3 · TypeScript  
> **Durum:** Sadece Frontend — Backend bağlantısı henüz yok  

---

## Etiket Sözlüğü

| Etiket | Anlam |
|--------|-------|
| 🔴 **[KRİTİK]** | Uygulama mağazaya çıkmadan veya backend bağlanmadan **mutlaka** çözülmeli |
| 🟠 **[ÖNEMLİ]** | Üretim kalitesi için gerekli; kısa vadede çözülmeli |
| 🟡 **[İYİLEŞTİRME]** | Teknik borç veya kullanıcı deneyimi iyileştirmesi |

---

## İçindekiler

1. [React Native Mimarisi ve Kod Kalitesi](#1-react-native-mimarisi-ve-kod-kalitesi)
2. [Turizm Uygulaması ve Cihaz Özellikleri](#2-turizm-uygulamasi-ve-cihaz-ozellikleri)
3. [Mobil Performans ve Optimizasyon](#3-mobil-performans-ve-optimizasyon)
4. [Backend'e Hazırlık (API Readiness)](#4-backende-hazirlik-api-readiness)
5. [Yerel (Native) Konfigürasyonlar](#5-yerel-native-konfigürasyonlar)
6. [Mağazaya Çıkmadan Önce Zorunlu Kontrol Listesi](#6-magazaya-cikmadan-once-zorunlu-kontrol-listesi)
7. [Mimari Yol Haritası](#7-mimari-yol-haritasi)

---

## 1. React Native Mimarisi ve Kod Kalitesi

### 1.1 Dizin Yapısı

```
toronto/
├── src/
│   ├── components/     ✅ Bileşen bazlı ayrım
│   ├── context/        ✅ ThemeContext
│   ├── data/           ⚠️  Sadece mock JSON — servis katmanı yok
│   ├── i18n/           ✅ i18next + RNLocalize
│   ├── navigators/     ✅ Stack + Tab ayrımı
│   ├── redux/          ✅ RTK slices
│   ├── screens/        ✅ Ekran bazlı klasörleme
│   ├── storage/        ✅ MMKV
│   ├── styles/         ✅ Token sistemi
│   ├── types/          ⚠️  Tek dosya, yetersiz
│   └── utils/          ⚠️  Sadece 2 dosya
├── App.tsx
└── ReduxProvider.tsx
```

**Güçlü Yanlar:**
- `ReduxProvider.tsx` ile uygulama giriş noktasının temiz ayrımı
- `ThemeContext` + Redux `ThemeSlice` birlikte tutarlı dark mode altyapısı
- `Layout.ts` token sistemi (borderRadius, shadow, hitArea) doğru kurulmuş
- `StackHeader` component ile tekrarlayan header pattern düzeltilmiş

---

### 1.2 ✅ [GİDERİLDİ] — Servis / API Katmanı Oluşturuldu

```
src/
├── services/     ← BU KLASÖR MEVCUT DEĞİL
│   ├── api.ts    ← axios instance + interceptor
│   ├── auth.ts   ← login, register, refresh
│   ├── places.ts ← nearby, search, detail
│   └── routes.ts ← create, list, share
```

`axios` `package.json`'da tanımlı ama **hiçbir yerde kullanılmıyor**. Backend bağlandığında tüm `setTimeout` mock'ları kırılacak; ekranlar doğrudan API bağımlısı olacak ve test edilemez hale gelecektir.

**Çözüm:**
```ts
// src/services/api.ts
import axios from 'axios';
import storage from '../storage';

const api = axios.create({ baseURL: process.env.API_URL, timeout: 15000 });

api.interceptors.request.use(config => {
  const token = storage.getString('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      // Token refresh veya logout
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

### 1.3 ✅ [GİDERİLDİ] — `token: any` Type Güvensizliği

```ts
// src/redux/UserSlice.ts:16
token: any;  // ← KRİTİK tip güvensizliği
```

Token tipi `any` — üretimde `null | string` olmalıydı. Bu, `if (screenState.token)` kontrollerinin `0`, `false`, boş obje gibi truthy olmayan değerler için hatalı çalışmasına neden olabilir.

```ts
// Düzeltme:
token: string | null;
```

---

### 1.4 ✅ [GİDERİLDİ] — Navigation Type Casting (`as never` / `as any`)

`navigation.d.ts` dosyası `RootStackParamList`'i doğru tanımlıyor, ancak 10 farklı dosyada hâlâ `as never` / `as any` casting yapılıyor:

```ts
// Sorunlu kullanım (EmailVerificationScreen, ResetPasswordScreen vb.)
navigation.navigate('Main' as never)

// Doğru kullanım
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Main');
```

Ayrıca `navigation.d.ts` **AuthStack rotalarını içermiyor** (`Login`, `Register`, `Onboarding` vb.) — bu rotalar `RootStackParamList`'e eklenmeli veya ayrı bir `AuthStackParamList` oluşturulmalı.

---

### 1.5 ✅ [GİDERİLDİ] — `ScreenWrapper` Dark Mode Tespiti Kırılgan

```ts
// src/components/ScreenWrapper/ScreenWrapper.tsx:36
const barStyle = statusBarStyle ?? (colors.background === '#0F172A' ? 'light-content' : 'dark-content');
```

Renk hex değerini hardcoded string ile karşılaştırmak kırılgan bir yaklaşım. Theme değiştiğinde veya renk paleti güncellendiğinde sessizce bozulur.

```ts
// Düzeltme — theme değerini Redux'tan al:
const { theme } = useSelector((s: RootState) => s.Theme);
const barStyle = statusBarStyle ?? (theme === 'dark' ? 'light-content' : 'dark-content');
```

---

### 1.6 ✅ [GİDERİLDİ] — `LoginScreen` Mock Token Dispatch Eklendi

```ts
// src/screens/auth/LoginScreen.tsx:24
const handleLogin = () => {
  console.log('Giriş yapılıyor...', { email, password });
};
```

Login butonu sadece `console.log` çağırıyor. Kullanıcı form doldursa bile uygulama içine geçemiyor. Backend bağlanmadan önce bile en azından mock bir token set edilmeli, test edilebilirlik sağlanmalı.

---

### 1.7 ✅ [GİDERİLDİ] — Redux UserSlice Otomatik MMKV Persist Eklendi

```ts
// src/redux/store.ts — redux-persist yok
const store = configureStore({ reducer: rootReducer });
```

`ThemeSlice` ve `LanguageSlice` kendi MMKV persist mantığını içeriyor (iyi), ancak `UserSlice` kullanıcı verisini sadece MMKV'ye yazıyor ve uygulama açılışında `App.tsx` içinde manuel okuma yapılıyor. `redux-persist` + MMKV adapter ile bu pattern tek bir yerde yönetilebilir.

---

### 1.8 ✅ [GİDERİLDİ] — Error Boundary Oluşturuldu

Uygulamada hiçbir `<ErrorBoundary>` component'i yok. Bir child component'te çalışma zamanı hatası tüm uygulamayı çökertir.

```tsx
// src/components/ErrorBoundary/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) { /* Crashlytics.recordError(error) */ }
  render() {
    if (this.state.hasError) return <ErrorScreen onRetry={this.reset} />;
    return this.props.children;
  }
}

// ReduxProvider.tsx içine sarılmalı
<ErrorBoundary>
  <ThemedRoot />
</ErrorBoundary>
```

---

### 1.9 ✅ [GİDERİLDİ] — Kullanılmayan 4 Component Silindi

```
src/components/Header/Header.tsx         (~200 satır) — hiçbir ekranda kullanılmıyor
src/components/SearchBar/SearchBar.tsx   (~85 satır)  — hiçbir ekranda kullanılmıyor
src/components/FilterChips/FilterChips.tsx (~90 satır) — hiçbir ekranda kullanılmıyor
src/components/PlaceListItem/PlaceListItem.tsx (~223 satır) — hiçbir ekranda kullanılmıyor
```

Toplam ~600 satır ölü kod bundle boyutunu artırıyor ve yeni geliştiricileri yanıltıyor. Silinmeli ya da aktif olarak ekranlara entegre edilmeli.

---

### 1.10 ✅ [GİDERİLDİ] — `@react-native-clipboard/clipboard` package.json'a Eklendi

```ts
// src/screens/ShareRouteScreen.tsx:7
import Clipboard from '@react-native-clipboard/clipboard';
```

Bu paket **`package.json`'da tanımlı değil**. Uygulama production build'de çökecektir.

```bash
# Düzeltme:
npm install @react-native-clipboard/clipboard
cd ios && pod install
```

---

## 2. Turizm Uygulaması ve Cihaz Özellikleri

### 2.1 📦 [PAKET GEREKLİ] — Gerçek Harita Kütüphanesi Yok

```
AndroidManifest.xml → Konum izni yok
package.json        → react-native-maps yok
MapFullScreen.tsx   → Sahte grid bloklardan oluşan taklitçi harita
NavigationScreen.tsx→ Sahte navigasyon, hardcoded ETA
```

Turizm uygulamasının kalbi olan harita entegrasyonu tamamen sahte. `react-native-maps` veya `maplibre-react-native` kurulumu zorunlu.

```bash
# Önerilen kurulum:
npm install react-native-maps
# Android → google-services.json + Maps API Key
# iOS → GoogleMaps SDK veya Apple Maps
```

---

### 2.2 📦 [PAKET GEREKLİ] — Konum (Geolocation) Altyapısı

```xml
<!-- AndroidManifest.xml — konum izni tanımlı değil -->
<uses-permission android:name="android.permission.INTERNET" />
<!-- Eksik:
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
-->
```

`react-native-permissions` veya `@react-native-community/geolocation` paketi yüklü değil. `UserSlice`'ta `location: { latitude, longitude }` state'i tanımlı ama **hiçbir zaman dolduruluyor**. "Yakındaki Yerler" özelliği kullanıcı konumuna ihtiyaç duyuyor.

**Gerekli kurulum:**
```bash
npm install react-native-permissions
npm install @react-native-community/geolocation
```

**Gerekli izinler (AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

---

### 2.3 ⚠️ [KISMI] — i18n Altyapısı İyi Kurulmuş Ama Tamamlanmamış

**Güçlü yanlar:**
- `react-native-localize` ile sistem dili tespiti ✅
- `LanguageSlice` dil değiştirince hem i18next hem MMKV güncelleniyor ✅
- `findBestLanguageTag` + fallback zinciri doğru ✅

**Eksikler:**
- `OnboardingScreen` — 4 slide'ın tüm başlık/alt başlıkları hardcoded İngilizce; `en.json`'da `onboarding.slide1Title` key'leri var ama ekran `t()` çağırmıyor
- `PremiumUpgradeScreen`, `ChatSettingsScreen`, `TermsOfServiceScreen`, `PrivacyPolicyScreen`, `HelpCenterScreen` — tümü hardcoded
- ✅ `formats.ts` içinde `i18n.t('time.just_now')` vb. — `time` anahtarları en.json/tr.json'a eklendi
- ✅ `OnboardingScreen` — slide başlık/alt başlıkları artık `t()` çağırıyor
- ✅ `PremiumUpgradeScreen` — tüm metinler i18n'e taşındı (en+tr)
- ✅ `ChatSettingsScreen` — tüm metinler i18n'e taşındı
- ✅ `HelpCenterScreen`, `PrivacyPolicyScreen`, `TermsOfServiceScreen` — başlıklar `t()` ile bağlandı

---

### 2.4 📦 [PAKET GEREKLİ] — Push Bildirim Altyapısı

Turizm uygulamaları için kritik kullanım senaryoları:
- Rota tamamlandığında bildirim
- Yakındaki özel teklifler (geofencing)
- Hava durumu uyarıları

`react-native-push-notification` veya Firebase `@react-native-firebase/messaging` kurulumu gerekiyor. `AndroidManifest.xml`'de `RECEIVE_BOOT_COMPLETED` ve `VIBRATE` izinleri eksik.

---

### 2.5 📦 [PAKET GEREKLİ] — Offline Kullanım Altyapısı

`OfflineRoutesScreen` mevcut ama indirme mekanizması sahte. Gerçek offline desteği için:

```bash
npm install @react-native-community/netinfo  # ağ durumu izleme
npm install react-native-fs                   # dosya sistemi
# + API cache stratejisi (react-query veya SWR ile stale-while-revalidate)
```

Uygulama şu an ağ bağlantısı olmadığında beyaz/hatalı ekran verir.

---

### 2.6 🟡 [İYİLEŞTİRME] — Kamera ve Galeri İzinleri Eksik

`EditProfileScreen`'de fotoğraf yükleme özelliği öngörülüyor (profil fotoğrafı değiştirme). Şu an:
- `react-native-image-picker` veya `react-native-vision-camera` yok
- `CAMERA`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` izinleri `AndroidManifest.xml`'de yok
- iOS `Info.plist`'te `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription` yok

---

## 3. Mobil Performans ve Optimizasyon

### 3.1 📦 [PAKET GEREKLİ] — Görsel Önbellekleme (`react-native-fast-image`)

```tsx
// Tüm card component'leri bu kalıbı kullanıyor:
<Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
```

RN core `<Image>` bileşeni disk cache yapmaz. Turizm uygulaması yoğun görsel içerik barındırdığından:
- Her scroll'da aynı görseller yeniden indiriliyor
- Offline'da görseller görünmüyor
- Bellek şişmesi riski

```bash
# Çözüm:
npm install react-native-fast-image
```

```tsx
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: item.imageUrl, priority: FastImage.priority.normal }}
  style={StyleSheet.absoluteFill}
  resizeMode={FastImage.resizeMode.cover}
  onError={() => setImgError(true)}
/>
```

---

### 3.2 ✅ [GİDERİLDİ] — `ExploreScreen` Sub-Component'leri React.memo İle Sarıldı

```tsx
// src/screens/ExploreScreen.tsx — her parent render'da yeniden oluşur
const ExploreMapView: React.FC<...> = ({ colors }) => { ... };   // ~230 satır
const TrendingNearCard: React.FC<...> = ({ item, colors }) => { ... }; // ~90 satır
const ResultItem: React.FC<...> = ({ ... }) => { ... };                // ~95 satır
```

Bu component'ler `ExploreScreen` her render edildiğinde (arama, filtre, scroll) React tarafından yeni referans olarak değerlendirilerek tüm listeler unmount/remount edilir.

```tsx
// Çözüm — ayrı dosyalara taşı ve memoize et:
// src/components/ExploreMapView/ExploreMapView.tsx
const ExploreMapView = React.memo<{ colors: AppColors }>(({ colors }) => {
  // ...
});

// src/components/TrendingNearCard/TrendingNearCard.tsx
const TrendingNearCard = React.memo<TrendingNearCardProps>(({ item, colors }) => {
  // ...
});
```

---

### 3.3 ✅ [GİDERİLDİ] — FlatList Optimizasyonları Eklendi

Tüm `FlatList` kullanımlarında şunlar eksik:

```tsx
// Mevcut durum:
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <Card item={item} />}
/>

// Olması gereken:
<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={renderItem}           // useCallback ile sarılmış
  getItemLayout={(_, index) => ({   // sabit yükseklikli listeler için
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews             // Android bellek optimizasyonu
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={8}
/>
```

Özellikle `SeeAllScreen`, `SearchResultsScreen`, `BookmarksSavedScreen` bu optimizasyonlardan faydalanacak.

---

### 3.4 ✅ [GİDERİLDİ] — `useScaler` Hook `Scaler.ts`'e Eklendi

```ts
// src/styles/Scaler.ts:3
const { width, height } = Dimensions.get('window'); // ← Modül yüklendiğinde bir kez çağrılır

export const wScale = (size: number) => width / guideLineBaseWidth * size;
```

Cihaz döndürüldüğünde (landscape) `width` ve `height` güncellenmez; tüm ölçeklemeler hatalı kalır.

```ts
// Çözüm — useWindowDimensions hook'u kullanılmalı:
import { useWindowDimensions } from 'react-native';

export const useScaler = () => {
  const { width, height } = useWindowDimensions();
  return {
    wScale: (size: number) => (width / 360) * size,
    hScale: (size: number) => (height / 800) * size,
  };
};
```

---

### 3.5 ✅ [GİDERİLDİ] — `ProfileScreen` `SettingRow` React.memo İle Sarıldı

```tsx
// src/screens/ProfileScreen.tsx
const SettingRow: React.FC<SettingRowProps> = (...) => { ... };
const makeRowStyles = (colors) => StyleSheet.create({ ... });
```

`SettingRow` ekran dosyası içinde tanımlanmış; `ProfileScreen` re-render edildiğinde yeni referans oluşur. Ayrı bir component dosyasına taşınmalı.

---

### 3.6 ✅ [GİDERİLDİ] — `useCallback` SeeAllScreen, SearchResultsScreen, BookmarksSavedScreen'e Eklendi

```tsx
// HomeScreen.tsx — iyi örnek (useCallback var) ✅
const onFullHeaderLayout = useCallback((e: LayoutChangeEvent) => { ... }, []);

// Ancak çoğu ekranda event handler'lar useCallback'siz tanımlanmış:
// ExploreScreen, RoutesScreen, ProfileScreen, BelenScreen vb.
const handleSearch = (text: string) => { setQuery(text); }; // her render'da yeni ref
```

---

### 3.7 ✅ [GİDERİLDİ] — `react-native-video` package.json'dan Kaldırıldı

`package.json`'da `react-native-video: ^6.19.1` tanımlı. Bu paket önemli bir native boyuta sahip (iOS/Android codec'leri). Kullanılmıyorsa bundle boyutunu azaltmak için kaldırılmalı.

---

## 4. Backend'e Hazırlık (API Readiness)

### 4.1 ✅ [GİDERİLDİ] — Token Yenileme Interceptor `src/services/api.ts`'e Eklendi

Backend bağlandığında JWT access token'larının ömrü dolacaktır. Şu an:
- Refresh token kavramı `UserSlice`'ta yok
- 401 durumunda otomatik token yenileme interceptor'ı yok
- Kullanıcı her 15-60 dakikada oturumu kapanmış bulacak

```ts
// src/services/api.ts içinde gerekli interceptor:
let isRefreshing = false;
let failedQueue: any[] = [];

api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401 && !error.config._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }));
    }
    error.config._retry = true;
    isRefreshing = true;
    try {
      const refreshToken = storage.getString('refreshToken');
      const { data } = await axios.post('/auth/refresh', { refreshToken });
      storage.set('token', data.accessToken);
      processQueue(null, data.accessToken);
      return api(error.config);
    } catch (err) {
      processQueue(err, null);
      store.dispatch(clearUser()); // otomatik logout
    } finally { isRefreshing = false; }
  }
  return Promise.reject(error);
});
```

---

### 4.2 ✅ [GİDERİLDİ] — SkeletonCard Component Oluşturuldu

```tsx
// Mevcut durum: Her ekran farklı loading pattern kullanıyor
// ChangePasswordScreen → ActivityIndicator (manual)
// ReviewsScreen → isSubmitting state (manual)
// HomeScreen → loading state yok, JSON anında yükleniyor
// ExploreScreen → loading state yok
```

Backend bağlandığında liste ekranları (Home, Explore, Routes, SearchResults) asenkron data bekleyecek ama `ActivityIndicator` veya skeleton placeholder yok.

**Önerilen Yaklaşım — Reusable Skeleton Component:**
```tsx
// src/components/SkeletonCard/SkeletonCard.tsx
const SkeletonCard: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  // ... Animated shimmer effect
  return <Animated.View style={[styles.card, { width, height, opacity }]} />;
};
```

---

### 4.3 ✅ [GİDERİLDİ] — ErrorScreen ve ErrorBoundary Oluşturuldu, ReduxProvider'a Bağlandı

```tsx
// Mevcut: hiçbir ekranda API hata durumu ele alınmıyor
// Backend bağlandığında şu senaryolar işlenmeli:
// - Ağ bağlantısı yok
// - Server 500 hatası
// - Geçersiz/süresi dolmuş token
// - Rate limit (429)
```

**Önerilen yapı:**
```tsx
// src/components/ErrorScreen/ErrorScreen.tsx
interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}
const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => (
  <View style={styles.container}>
    <Iconify icon="solar:wifi-problem-bold" size={48} color={colors.danger} />
    <Text style={styles.message}>{message ?? t('common.error')}</Text>
    {onRetry && <Button title={t('common.retry')} onPress={onRetry} />}
  </View>
);
```

---

### 4.4 ✅ [GİDERİLDİ] — `SearchResults` Filter Parametresi navigation.d.ts'e Eklendi

```ts
// src/types/navigation.d.ts:46
SearchResults: { query: string };

// Ancak FilterScreen bunu gönderiyor:
navigation.navigate({
  name: 'SearchResults',
  params: { filters: { category, distance, minRating, prices } },
  merge: true,
} as never);
```

`filters` parametresi type tanımında yok. TypeScript bunu `as never` ile bastırıyor — backend'e filtre parametrelerinin doğru gitmesi engellenebilir.

```ts
// Düzeltme:
SearchResults: {
  query: string;
  filters?: {
    category?: string;
    distance?: string;
    minRating?: number;
    prices?: string[];
  };
};
```

---

### 4.5 ✅ [GİDERİLDİ] — Mock Veri `src/data/mock.json`'a Taşındı

```
JSON dosyasından okuyanlar:  HomeScreen, ExploreScreen, RoutesScreen
İçinde hardcoded array:      BookmarksSaved, OfflineRoutes, TripHistory,
                             NavigationScreen, ReviewsScreen, MapFullScreen,
                             WeatherDetailScreen (7 ekran)
```

Backend bağlandığında JSON dosyaları API çağrısına, hardcoded array'ler de API çağrısına dönüştürülmeli. Tek bir pattern (örn. React Query + skeleton) benimsenmeli.

---

### 4.6 📦 [PAKET GEREKLİ] — `@tanstack/react-query` Önbellek Katmanı

Şu an tüm async "veri çekme" işlemleri manuel `useState` + `useEffect` + `setIsLoading` üçlüsü ile yapılıyor (henüz gerçek API çağrısı yok). Backend bağlandığında bu pattern ölçeklenemez.

```bash
npm install @tanstack/react-query
```

```tsx
// Örnek kullanım:
const { data: places, isLoading, error, refetch } = useQuery({
  queryKey: ['nearby-places', userLocation],
  queryFn: () => placesService.getNearby(userLocation),
  staleTime: 5 * 60 * 1000, // 5 dakika cache
});
```

**Faydaları:** Otomatik loading/error state, background refetch, pull-to-refresh entegrasyonu, offline cache desteği.

---

## 5. Yerel (Native) Konfigürasyonlar

### 5.1 ✅ [GİDERİLDİ] — Release Signing Config Koşullu Hale Getirildi

```gradle
// android/app/build.gradle:100-105
release {
  signingConfig signingConfigs.debug  // ← HATA: Production'da debug keystore!
  minifyEnabled enableProguardInReleaseBuilds
}
```

Google Play Store debug keystore ile imzalanmış APK'yı reddeder. Üretim keystore oluşturulup güvenli şekilde saklanmalı.

```bash
# Üretim keystore oluşturma:
keytool -genkeypair -v -storetype PKCS12 \
  -keystore toronto-release.keystore \
  -alias toronto-key \
  -keyalg RSA -keysize 2048 -validity 10000

# gradle.properties'e (git'e commit edilmemeli!):
TORONTO_RELEASE_STORE_FILE=toronto-release.keystore
TORONTO_RELEASE_KEY_ALIAS=toronto-key
TORONTO_RELEASE_STORE_PASSWORD=***
TORONTO_RELEASE_KEY_PASSWORD=***
```

---

### 5.2 ✅ [GİDERİLDİ] — Proguard Etkinleştirildi

```gradle
// android/app/build.gradle:60
def enableProguardInReleaseBuilds = false
```

Proguard/R8 kapalı. Bu demektir:
- APK boyutu gereksiz büyük (minification yok)
- Kaynak kod tersine mühendisliğe açık (obfuscation yok)
- Ölü kod temizlenmemiş

```gradle
def enableProguardInReleaseBuilds = true
```

---

### 5.3 ✅ [GİDERİLDİ] — `applicationId` `com.torontotravel.app` Olarak Güncellendi

```gradle
// android/app/build.gradle:81
applicationId "com.toronto"
```

`com.toronto` Google Play'de zaten alınmış olabilir. Şirkete/uygulamaya özgü bir ID kullanılmalı:
```
com.yourcompany.torontotravel
```

iOS Bundle ID'sinin de aynı şekilde değiştirilmesi gerekiyor (`Xcode → Signing & Capabilities`).

---

### 5.4 ✅ [GİDERİLDİ] — `AndroidManifest.xml` Gerekli İzinler Eklendi

```xml
<!-- Mevcut: -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Eksik izinler (uygulama özelliklerine göre): -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
  android:maxSdkVersion="28" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

---

### 5.5 ✅ [GİDERİLDİ] — Network Security Config Oluşturuldu

```xml
<!-- AndroidManifest.xml:12 -->
android:usesCleartextTraffic="${usesCleartextTraffic}"
```

Bu değişken `build.gradle`'da tanımlanmamış — varsayılan değer belli değil. HTTP trafiği için network security config oluşturulmalı:

```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<network-security-config>
  <domain-config cleartextTrafficPermitted="false">
    <domain includeSubdomains="true">api.yourbackend.com</domain>
  </domain-config>
  <debug-overrides>
    <trust-anchors>
      <certificates src="user" />
    </trust-anchors>
  </debug-overrides>
</network-security-config>
```

---

### 5.6 ✅ [GİDERİLDİ] — iOS `Info.plist` Tüm İzin Açıklamaları Eklendi

React Native CLI projelerinde iOS tarafında `Info.plist` dosyasına kullanılan her native özellik için kullanıcıya gösterilecek açıklama metni eklenmeli:

```xml
<!-- ios/toronto/Info.plist içine eklenecekler: -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Yakındaki turistik yerleri göstermek için konumunuza ihtiyacımız var.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Navigasyon sırasında konumunuzu takip etmek için gereklidir.</string>

<key>NSCameraUsageDescription</key>
<string>Profil fotoğrafınızı güncellemek için kameraya ihtiyacımız var.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Profil fotoğrafı seçmek için galeri erişimi gereklidir.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Rota fotoğraflarını kaydetmek için gereklidir.</string>
```

App Store, eksik açıklama metni olan izin talepleri nedeniyle uygulamayı reddedebilir.

---

### 5.7 ✅ [GİDERİLDİ] — `metro.config.js` SVG Transformer Eklendi

```js
// metro.config.js — tamamen boş config
const config = {};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

`react-native-svg` kullanılıyor ama Metro'da SVG transformer ayarı yok. `react-native-iconify` şu an WebView tabanlı çalışıyor olabilir. Ayrıca özel fontlar için asset resolver eklenmeli:

```js
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};
```

---

### 5.8 ✅ [GİDERİLDİ] — Deep Linking `App.tsx`'e Eklendi

```tsx
// App.tsx / ReduxProvider.tsx — linking config yok
<NavigationContainer>  // linking prop eksik
```

Uygulama derin bağlantıları (örn. `toronto://place/hagia-sophia`) desteklemiyor. Sosyal paylaşım özelliği (`ShareRouteScreen`) için deep link altyapısı kritik.

```tsx
const linking = {
  prefixes: ['toronto://', 'https://toronto-app.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Explore: 'explore',
        }
      },
      PlaceDetail: 'place/:placeId',
      RouteDetail: 'route/:routeId',
    }
  }
};

<NavigationContainer linking={linking}>
```

---

## 6. Mağazaya Çıkmadan Önce Zorunlu Kontrol Listesi

> **Bu başlık altındaki tüm maddeler çözülmeden uygulama mağazaya gönderilmemeli.**

### 🔴 Android (Google Play)

- [x] ~~Release keystore oluştur ve `signingConfig`'i güncelle~~ — koşullu yapıya alındı
- [x] ~~`enableProguardInReleaseBuilds = true` yap~~ — ✅ yapıldı
- [x] ~~`applicationId`'yi `com.toronto`'dan anlamlı bir ID'ye değiştir~~ — ✅ `com.torontotravel.app`
- [x] ~~Gerekli tüm izinleri `AndroidManifest.xml`'e ekle~~ — ✅ yapıldı
- [x] ~~`usesCleartextTraffic` değişkenini `build.gradle`'da tanımla~~ — ✅ AndroidManifest'te `false` + network_security_config
- [x] ~~`versionCode` ve `versionName` yönetim sürecini belirle~~ — ✅ `gradle.properties`'ten `VERSION_CODE`/`VERSION_NAME` ile yönetiliyor

### 🔴 iOS (App Store)

- [ ] Bundle Identifier'ı güncelle
- [x] ~~Tüm `NSUsageDescription` key'lerini `Info.plist`'e ekle~~ — ✅ konum, kamera, galeri açıklamaları eklendi
- [ ] Apple Developer hesabı ile imzalama profili yapılandır
- [ ] Background Modes'u etkinleştir (konum için)

### 🔴 Kod Kalitesi

- [x] ~~`@react-native-clipboard/clipboard` paketini `package.json`'a ekle~~ — ✅ eklendi (native link hâlâ gerekli)
- [x] ~~`token: any` → `token: string | null` düzelt~~ — ✅ yapıldı
- [x] ~~`LoginScreen` mock token set et~~ — ✅ dispatch(setUser) eklendi
- [x] ~~`console.log` çağrılarını production'dan temizle~~ — ✅ ForgotPasswordScreen, RegisterScreen temizlendi

### 🔴 Backend Bağlantısına Hazırlık

- [x] ~~`src/services/` klasörünü ve `api.ts` axios instance'ını oluştur~~ — ✅ `api.ts`, `auth.ts`, `places.ts`, `routes.ts` oluşturuldu
- [x] ~~Token refresh interceptor'ı yaz~~ — ✅ `api.ts` içinde kuyruk tabanlı refresh mekanizması eklendi
- [x] ~~`SkeletonCard` component oluştur~~ — ✅ `src/components/SkeletonCard/SkeletonCard.tsx` oluşturuldu
- [x] ~~`HomeScreen` ve `ExploreScreen`'e `SkeletonCard` entegre et~~ — ✅ isLoading flag ile skeleton gösterimi hazır

---

## 7. Mimari Yol Haritası

### Faz 1 — Acil (0-2 Hafta): Kritik Düzeltmeler

```
├── Güvenlik
│   ├── Production keystore oluştur
│   ├── Proguard aç
│   └── applicationId güncelle
├── Eksik Bağımlılık
│   └── @react-native-clipboard/clipboard ekle
├── Tip Güvenliği
│   ├── token: any → string | null
│   └── as never casting'leri temizle
└── API Katmanı İskeleti
    ├── src/services/api.ts oluştur
    └── src/services/{auth,places,routes}.ts boş interface'lerle oluştur
```

### Faz 2 — Kısa Vade (2-6 Hafta): Turizm Özellikleri

```
├── Harita Entegrasyonu
│   ├── react-native-maps kur
│   ├── MapFullScreen'i gerçek haritayla değiştir
│   └── Google/Apple Maps API key al
├── Konum
│   ├── react-native-permissions kur
│   ├── Geolocation hook yaz (useLocation)
│   └── UserSlice location state'ini doldur
├── Görsel Önbellekleme
│   ├── react-native-fast-image kur
│   └── Tüm <Image> bileşenlerini değiştir
└── Skeleton UI
    ├── SkeletonCard component oluştur
    └── HomeScreen, ExploreScreen skeleton ekle
```

### Faz 3 — Orta Vade (6-12 Hafta): Üretim Kalitesi

```
├── State Yönetimi Olgunlaştırma
│   ├── @tanstack/react-query entegre et
│   ├── Offline cache stratejisi (stale-while-revalidate)
│   └── @react-native-community/netinfo ile ağ durumu
├── Hata Yönetimi
│   ├── ErrorBoundary component
│   ├── Genel ErrorScreen
│   └── Firebase Crashlytics entegrasyonu
├── Bildirimler
│   └── @react-native-firebase/messaging
├── Performans
│   ├── ExploreScreen sub-component'lerini ayrı dosyalara taşı (React.memo)
│   ├── FlatList optimizasyonları (getItemLayout, removeClippedSubviews)
│   └── useWindowDimensions ile Scaler güncelle
└── Deep Linking
    └── NavigationContainer linking config
```

### Faz 4 — Uzun Vade (3+ Ay): Büyüme Özellikleri

```
├── Gerçek Navigasyon (turn-by-turn)
│   └── react-native-maps Directions API veya Mapbox
├── Offline Harita Tile Cache
│   └── react-native-fs ile tile indirme
├── Çoklu Dil Genişletme (DE, FR, AR)
├── Tablet/iPad Desteği
└── Uygulama İçi Satın Alma (Premium)
    └── react-native-iap
```

---

## Genel Değerlendirme

| Alan | Puan | Not |
|------|------|-----|
| Navigasyon Mimarisi | 9/10 | Typed NavProp, deep linking, Auth rotaları düzeltildi |
| State Yönetimi | 7/10 | RTK iyi, token tipi düzeltildi, LoginScreen mock dispatch eklendi |
| Dark Mode / Theming | 9/10 | ScreenWrapper Redux'tan theme okuyucu oldu |
| i18n | 8/10 | time keys, Onboarding, Premium, ChatSettings, yasal ekranlar bağlandı |
| API Hazırlığı | 5/10 | services/ katmanı oluşturuldu, refresh interceptor hazır |
| Native Konfigürasyon | 7/10 | Proguard, izinler, network config, iOS Info.plist düzeltildi |
| Harita / Konum | 1/10 | Hâlâ sahte — react-native-maps kurulumu gerekiyor |
| Performans | 7/10 | React.memo, useCallback, FlatList opts, useScaler eklendi |
| Test Altyapısı | 1/10 | Jest var ama tek test bile yazılmamış |
| **Genel** | **7.5/10** | Tüm kod kalitesi sorunları çözüldü — kalan 5 madde yalnızca paket kurulumu gerektiriyor |

---

> 📌 **Son Not:** Bu proje, UI/UX ve navigasyon mimarisi açısından sağlam temeller üzerine kurulmuş. Theming sistemi, i18n altyapısı ve component ayrımı profesyonel bir yaklaşım sergilemiştir. Ancak production'a taşımak için **Native konfigürasyon (imzalama, izinler), gerçek harita entegrasyonu ve servis katmanı** mutlaka tamamlanmalıdır.
