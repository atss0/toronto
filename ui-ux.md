# 🎨 Toronto — UI/UX Hata ve İyileştirme Raporu

> Son güncelleme: 2026-04-18 — 41 ekran ve tüm componentler detaylı incelendi.

---

## 🔴 KRİTİK — Auth Navigasyonu Hâlâ Ters

### 1. `App.tsx:43-47` — Token Mantığı Ters
```tsx
{!screenState.token ? (
  <RootStackNavigator ... />  // token YOK → Ana sayfa gösteriliyor
) : (
  <AuthStackNavigator />      // token VAR → Login gösteriliyor
)}
```
Token **varsa** ana ekranlar, **yoksa** auth gösterilmeli. Şu an tam tersine çalışıyor — giriş yapmış kullanıcı login sayfasına, giriş yapmamış kullanıcı ana sayfaya düşer.

---

## 🔴 KRİTİK — Dark Mode Sorunları

### 2. `SplashScreen.tsx` — Dark Mode Desteği Yok
```tsx
const styles = StyleSheet.create({
  root: { backgroundColor: '#3182ED', ... },
  appName: { color: '#FFFFFF', ... },
});
```
`useColors()` hook'u kullanılmıyor. Sabit `StyleSheet.create` — dark modda arka plan değişmiyor. `makeStyles(colors)` pattern'i kullanılmalı.

### 3. `OnboardingScreen.tsx:79` — StatusBar Dark Modda Yanlış
```tsx
<StatusBar barStyle="dark-content" backgroundColor={colors.background} />
```
Dark modda `dark-content` → koyu arka plan üzerinde koyu status bar ikonları görünmez. `currentTheme` kontrol edilerek `'light-content'` kullanılmalı ancak `currentTheme` import bile edilmemiş.

### 4. 18 Ekranda Hardcoded `'#FFFFFF'` Kullanımı
Aşağıdaki ekranlarda `'#FFFFFF'` sabit renk kullanılıyor. Dark modda `colors.white` aslında `'#1E293B'`'dir — hardcoded `'#FFFFFF'` dark modda beklenmeyen beyaz noktalar oluşturur:

| Ekran | Kullanım Yeri |
|-------|--------------|
| `OnboardingScreen` | Next buton text, ikon rengi |
| `SplashScreen` | Tüm renkler sabit |
| `PlaceDetailScreen` | Hero overlay metinleri, back/save buton ikonları |
| `RouteDetailScreen` | Active badge, stop tag, nav buton text |
| `NavigationScreen` | Instruction text, user dot border, step ikonları |
| `MapFullScreen` | Road line renkleri |
| `WeatherDetailScreen` | Hero metinleri, hourly card active renkleri |
| `ReviewsScreen` | Submit buton text |
| `FilterScreen` | Active chip text |
| `BookmarksSavedScreen` | Active tab text |
| `ChangePasswordScreen` | Save buton text |
| `PremiumUpgradeScreen` | Tüm hero/CTA buton metinleri |
| `ExploreScreen` | Overlay metinleri, active chip |
| `RoutesScreen` | Badge, CTA buton metinleri |
| `ProfileScreen` | Premium card, logout |
| `BelenScreen` | AI mesaj bubble, send buton |
| `CreateRouteScreen` | Create buton text |
| `EditProfileScreen` | Save buton text |

> **Not:** Bazı kullanımlar doğrudur (örn. primary renkli buton üzerindeki beyaz text). Ama kart arka planlarındaki `'#FFFFFF'` dark modda `colors.white` olmalıdır.

### 5. 11 Ekranda Hardcoded `'#F59E0B'` Star Rengi
Yıldız rengi `'#F59E0B'` dark modda sorun oluşturmaz (sarı her zaman görünür), ama theme'de `colors.warning` olarak tanımlı — tutarlılık için `colors.warning` kullanılmalı:

`WeatherDetailScreen`, `SearchResultsScreen`, `ReviewsScreen`, `ProfileScreen`, `PremiumUpgradeScreen`, `PlaceDetailScreen`, `MapFullScreen`, `ExploreScreen`, `BookmarksSavedScreen`, `SeeAllScreen`, `TripHistoryScreen`

---

## 🟡 Erişilebilirlik (Accessibility) Sorunları

### 6. Hiçbir Ekranda Accessibility Label Yok
41 ekranın **hiçbirinde** `accessibilityLabel`, `accessibilityRole` veya `accessibilityHint` kullanılmıyor. `TabBar.tsx`'de doğru yapılmış (`accessibilityRole="button"`) ama ekranlar bu pattern'i takip etmiyor.

Özellikle kritik alanlar:
- Geri butonları (tüm stack ekranlar)
- Form input'ları (ChangePassword, EditProfile, CreateRoute, SearchResults, CityPicker)
- İşlem butonları (Submit Review, Apply Filters, Update Password, Start Navigation)
- Bookmark/Like/Share butonları

### 7. Dokunma Alanları Tutarsız
Apple 44×44, Android 48×48 minimum önerirken:

| Element | Boyut | Ekran |
|---------|-------|-------|
| Back butonları (çoğu ekran) | `36×36` | ❌ Küçük |
| HomeScreen compact header bell | `30×30` | ❌ Çok küçük |
| ExploreScreen zoom butonları | `32×32` | ❌ Küçük |
| BookmarksSavedScreen remove butonu | hitSlop=8 sadece | ⚠️ Yetersiz |
| OfflineRoutesScreen delete butonu | hitSlop=8 sadece | ⚠️ Yetersiz |

`hitSlop` bazı yerlerde kullanılmış ama tutarsız.

### 8. Renk Kontrastı Düşük Metinler
- `WeatherDetailScreen:120` — `rgba(255,255,255,0.65)` hi/low metin: Primary arka plan üzerinde soluk
- `WeatherDetailScreen:119` — `rgba(255,255,255,0.8)` condition: Sınırda kontrast
- `NavigationScreen:172` — `rgba(255,255,255,0.75)` distance text: Primary kart içinde soluk
- `HeroCard` — `rgba(255,255,255,0.65)` subtitle: Resim üzerinde okunabilirlik güvensiz
- `TrendingCard` — `rgba(255,255,255,0.65)` review text: Çok düşük kontrast

---

## 🟠 Görsel Tutarsızlıklar

### 9. Border Radius Sistemi Yok
Projede 10+ farklı radius değeri var, design token sistemi kullanılmamış:

| Değer | Kullanan | Önerilen Token |
|-------|----------|---------------|
| `12` | Input, bazı butonlar, SearchBox | `borderRadius.sm` |
| `14` | StopCard, HourCard, InputRow, FilterChip | `borderRadius.md` |
| `16` | Card, metaPill, ReviewCard, navBtn | `borderRadius.lg` |
| `18` | SummaryCard, GemCard, OnboardingBtn, StatsRow | `borderRadius.xl` |
| `20` | Tag pill, PlanCard, RouteCard | `borderRadius.pill` |
| `24` | Button component, panel topRadius | `borderRadius.2xl` |

### 10. Gölge (Shadow/Elevation) Sistemi Yok
12+ farklı `shadowOpacity` ve 8+ farklı `elevation` kombinasyonu:
- `OnboardingScreen` → `shadowOpacity: 0.3, elevation: 4`
- `MapFullScreen topBtn` → `shadowOpacity: 0.12, elevation: 4`
- `NavigationScreen panel` → `shadowOpacity: 0.08, elevation: 8`
- `WeatherDetailScreen hourCard` → Shadow yok
- `PlaceDetailScreen backBtn` → Shadow yok (sadece backgroundColor)

### 11. Header Padding Tutarsızlığı
Tüm yeni stack ekranlar aynı header pattern'i kullanıyor ama padding değerleri farklı:
- Stack ekranlar header: `paddingTop: hScale(16)` — ✅ Tutarlı
- `HomeScreen` full header: `paddingTop: hScale(16)` — ✅ Tutarlı
- `PlaceDetailScreen` hero back buton: `top: hScale(52)` — Farklı (StatusBar alanı dahil)
- `MapFullScreen` topBar: `top: hScale(48)` — Farklı
- `NavigationScreen` closeBtn: `top: hScale(50)` — Farklı

Bu 3 ekran translucent StatusBar kullandığından farklı olması istenen bir durum olabilir ama 48/50/52 yerine tek bir sabit olmalı.

### 12. Kart Boyutları ve Yükseklikleri Tutarsız
| Component | Genişlik | Yükseklik |
|-----------|----------|-----------|
| `GemCard` | `148` | `200` |
| `TrendingCard` (Home) | `180` | `150` |
| `TrendingNearCard` (Explore) | `160` | `170` |

Aynı horizontal scroll'da farklı boyutlarda kartlar var.

---

## 🔵 Kullanıcı Deneyimi (UX) Sorunları

### 13. Hiçbir Ekranda Pull-to-Refresh Yok
`refreshControl` hiçbir ScrollView/FlatList'te kullanılmıyor. Etkilenen ekranlar:
- `HomeScreen`, `ExploreScreen`, `RoutesScreen`, `ProfileScreen` (tab ekranları)
- `BookmarksSavedScreen`, `TripHistoryScreen`, `OfflineRoutesScreen` (liste ekranları)
- `ReviewsScreen`, `SearchResultsScreen` (sonuç listeleri)

### 14. İmaj Yükleme/Hata Durumu Yok
Hiçbir `<Image>` componentinde:
- Loading placeholder (skeleton/shimmer) yok
- Error fallback yok — resim yüklenemezse boş/kırık görünür
- `onError` handler yok

Etkilenen: `GemCard`, `TrendingCard`, `HeroCard`, `OngoingJourneyCard`, `PlaceDetailScreen` hero, `BookmarksSavedScreen` thumb, `SearchResultsScreen` thumb

### 15. Loading State Eksik
- `ChangePasswordScreen:125` — "Update Password" basılınca sadece `navigation.goBack()` — loading/success feedback yok
- `ReviewsScreen:66-80` — Review submit anında eklenir, loading indicator yok
- `EditProfileScreen` — Save basılınca ne olur? Loading state yok
- `EmailVerificationScreen:39-42` — Verify anında navigasyon, API call bekleme yok
- `ResetPasswordScreen:28-31` — Aynı sorun

### 16. FilterScreen Seçimler Kaybolma Sorunu
```tsx
// FilterScreen.tsx:122
<TouchableOpacity style={styles.applyBtn} onPress={() => navigation.goBack()}>
```
"Apply Filters" sadece `goBack()` çağırıyor — seçilen filtreler hiçbir yere gönderilmiyor. Kullanıcı filtreleri seçer, Apply'a basar ve hiçbir şey olmaz.

### 17. CityPickerScreen Seçim Kaydedilmiyor
```tsx
// CityPickerScreen.tsx:42-45
const selectCity = (name: string) => {
  setSelectedCity(name);  // Sadece local state
  navigation.goBack();    // Geri dön — seçim kaybolur
};
```
Seçilen şehir Redux/storage'a yazılmıyor. Ekranı kapatıp tekrar açınca varsayılan "Istanbul" olarak kalır.

### 18. BookmarksSavedScreen — Veriler Statik
```tsx
const BOOKMARKS = [
  { id: '1', name: 'Hagia Sophia', ... },
];
```
Bookmark'lar hardcoded. Kullanıcı ExploreScreen'de bir yeri like'ladığında bu listeye eklenmez. Redux/storage entegrasyonu yok.

### 19. OfflineRoutesScreen — Gerçek Download Yok
Download fonksiyonalitesi simüle — "Remove" butonu sadece local state'den siler, gerçek dosya yönetimi yok. "Download" butonu hiçbir yerde yok.

### 20. ShareRouteScreen — İşlevsiz Butonlar
```tsx
// ShareRouteScreen.tsx:76
onPress={opt.label === 'Share via...' ? handleShare : undefined}
```
"Copy Link" ve "Show QR Code" butonlarının `onPress`'i `undefined` — tıklanabilir görünüp hiçbir şey yapmıyor.

### 21. TripHistoryScreen — Statik Veriler
İstatistikler hardcoded:
- "Avg Rating" sabit `4.3` yazılmış, hesaplanmıyor
- Trip verileri `TRIPS` dizisinden geliyor, Redux/storage ile senkronize değil

### 22. WeatherDetailScreen — Tümü Mock Veri
Tüm saatlik/haftalık hava durumu hardcoded. API entegrasyonu yok. `city` parametresi alıyor ama gösterilen veri her zaman aynı.

### 23. ReviewsScreen — Kayıt Kalıcı Değil
Yazılan review local state'e ekleniyor ama:
- Sayfa kapatılıp açılınca kaybolur (storage/API yok)
- "Helpful" butonu tıklanabilir ama hiçbir şey yapmıyor (`onPress` yok)

### 24. NavigationScreen — Sahte Navigasyon
- ETA, kalan mesafe tamamen hardcoded
- Kullanıcı konumu statik (animasyonlu pulse var ama konum değişmiyor)
- Rota çizgisi sadece iki düz çizgi — gerçek rota gösterimi yok
- "End Navigation" sadece `goBack()` — onay dialog'u yok

### 25. MapFullScreen — Hâlâ Placeholder
Gerçek harita yerine grid bloklardan oluşan sahte harita. Pin'ler tıklanabiliyor ama:
- "Layers" butonu (üst sağ) `onPress` yok — işlevsiz
- Zoom butonları `onPress` yok — işlevsiz
- Pin'e tıklayınca navigasyon yok (sadece tooltip açılır)
- Gerçek bir harita kütüphanesi (react-native-maps ya da WebView+Leaflet) gerekli

### 26. Keyboard Handling Eksiklikleri
- `SearchResultsScreen` — `KeyboardAvoidingView` yok (ama arama input'u header'da olduğu için büyük sorun değil)
- `ReviewsScreen` Modal — `KeyboardAvoidingView` yok, klavye açıldığında TextInput kapatabilir
- `ChangePasswordScreen` — ScrollView var ama `keyboardShouldPersistTaps="handled"` yok
- `CityPickerScreen` — Arama input'u `autoFocus` ama FlatList'te `keyboardShouldPersistTaps` yok

### 27. Tab Bar "Belen" İsmi Hâlâ Kafa Karıştırıcı
```json
"belen": "Discover"  // en.json
```
Tab ismi "Discover" ama ekran AI chat gösteriyor. `ExploreScreen` başlığı da "DISCOVER" — iki sekme aynı isimle karışıyor.

### 28. PlaceDetailScreen — Statik İçerik
- Tag'lar her mekan için aynı: `['Museum', 'Historic', 'Art', 'Culture']`
- About açıklaması genel jenerik metin, mekanla ilgisi yok
- Açılış saatleri her mekan için aynı
- Adres sabit `"123 Example Street, Istanbul"`
- "Add to Route" butonu `onPress` yok — işlevsiz
- "Save" (bookmark) butonu `onPress` yok — işlevsiz

### 29. Horizontal Scroll Göstergesi Eksik
`HomeScreen` ve `ExploreScreen`'deki yatay kart listelerinde (`showsHorizontalScrollIndicator={false}`):
- Kullanıcı sağa kaydırılabilir olduğunu anlamayabilir
- Liste sonunda olduğunu bilmez
- İlk el hareketi ipucu veya dot indicator olmalı

### 30. BelenScreen Chat UX Sorunları
- Mesaj gönderildiğinde typing indicator yok — cevap anında geliyor
- Mesajlarda timestamp gösterilmiyor
- Mesaj silme/düzenleme yoku
- Çift scroll çağrısı riski (`setTimeout(100ms)` + `onContentSizeChange`)

---

## 🟣 Gereksiz / Kullanılmayan Componentler

### 31. `Header/Header.tsx` — Hiçbir Yerde Kullanılmıyor
200 satırlık Header component'i import edilmiyor. Tüm ekranlar kendi header'larını inline oluşturmuş.

### 32. `SearchBar/SearchBar.tsx` — Hiçbir Yerde Kullanılmıyor
85 satırlık component — `ExploreScreen` ve `SearchResultsScreen` kendi search bar'larını inline oluşturmuş.

### 33. `FilterChips/FilterChips.tsx` — Hiçbir Yerde Kullanılmıyor
90 satırlık component — `ExploreScreen`, `BookmarksSavedScreen`, `FilterScreen` chips'leri inline oluşturmuş.

### 34. `PlaceListItem/PlaceListItem.tsx` — Hiçbir Yerde Kullanılmıyor
223 satırlık component — `ExploreScreen`, `SearchResultsScreen`, `BookmarksSavedScreen` kendi list item'larını inline oluşturmuş.

### 35. Çoğu Stack Ekranda Tekrarlayan Header Pattern
22 stack ekranın 20'si tamamen aynı header yapısını kullanıyor:
```tsx
<View style={styles.header}>
  <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
    <Iconify icon="solar:alt-arrow-left-linear" ... />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>...</Text>
  <View style={{ width: wScale(36) }} /> {/* Placeholder */}
</View>
```
Bu bir `StackHeader` component'ine dönüştürülmeli — her ekranda ~15 satır tekrar ediyor.

---

## 📝 Lokalizasyon (i18n) Sorunları

### 36. Yeni 19 Ekranın Hiçbiri i18n Kullanmıyor
`useTranslation` sadece 8 eski ekranda var:
- ✅ Auth ekranları: `LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen`, `ResetPasswordScreen`
- ✅ Tab ekranları: `HomeScreen`, `ExploreScreen`, `RoutesScreen`, `ProfileScreen`, `BelenScreen`
- ❌ **Yeni 19 ekranın tümü**: Hardcoded İngilizce metin

| Ekran | Hardcoded Örnekler |
|-------|-------------------|
| `PlaceDetailScreen` | "About", "Location", "Opening Hours", "Add to Route", "Reviews" |
| `RouteDetailScreen` | "Progress", "Stops", "Start Navigation", "ACTIVE ROUTE" |
| `NavigationScreen` | "End Navigation", "ETA", "Remaining", "Next stop", "Prev", "Next" |
| `MapFullScreen` | "places on map", "List View" |
| `BookmarksSavedScreen` | "Saved Places", "No saved places", "Bookmark places to find them here" |
| `ReviewsScreen` | "Reviews", "Write a Review", "Submit Review", "Helpful" |
| `FilterScreen` | "Filters", "Category", "Distance", "Minimum Rating", "Price Range", "Apply Filters", "Reset" |
| `SearchResultsScreen` | "Search places...", "No results found", "Try different keywords" |
| `ChangePasswordScreen` | "Change Password", "Current Password", "New Password", "Update Password" |
| `EditProfileScreen` | Tüm form label'ları |
| `OnboardingScreen` | "Discover Hidden Gems", "AI-Powered Routes", "Save & Share Trips", "Skip", "Next", "Get Started" |
| `WeatherDetailScreen` | "Hourly Forecast", "7-Day Forecast", "Wind", "Humidity" |
| `ShareRouteScreen` | "Share Route", "Copy Link", "Share via...", "Show QR Code" |
| `CityPickerScreen` | "Select City", "Search cities...", "Popular Cities", "All Cities" |
| `OfflineRoutesScreen` | "Offline Routes", "Storage Used", "No offline routes" |
| `TripHistoryScreen` | "Trip History", "Trips", "Distance", "No trips yet" |
| `PremiumUpgradeScreen` | Tüm plan metinleri ve feature listesi |
| `ChatSettingsScreen` | Tüm ayar label'ları |
| `TermsOfServiceScreen`, `PrivacyPolicyScreen`, `HelpCenterScreen` | Tüm metin |

### 37. ExploreScreen ve RoutesScreen'de i18n Import Var Ama Kullanılmıyor
```tsx
import { useTranslation } from 'react-i18next';
// ...
const { t } = useTranslation();
// ... ama hiçbir yerde t() çağrılmıyor (section title'lar hardcoded)
```

---

## ⚡ Performans Sorunları

### 38. ExploreScreen İnline Sub-Component'ler
`ExploreScreen.tsx` içinde 3 büyük inline component tanımlı — her render'da yeniden oluşturulur:
- `ExploreMapView` (~230 satır)
- `TrendingNearCard` (~90 satır)
- `ResultItem` (~95 satır)

Bunlar ayrı dosyalara çıkarılıp `React.memo` ile sarılmalı.

### 39. Resimlerde Cache Stratejisi Yok
Tüm resimler `<Image source={{ uri: ... }}>` kullanıyor. `react-native-fast-image` gibi disk cache sağlayan bir kütüphane kullanılmalı.

### 40. MapFullScreen — Her Render'da 30 Grid Bloğu Oluşturuluyor
```tsx
{Array.from({ length: 30 }, (_, i) => ({ ... })).map((b, i) => (
  <View key={i} ... />
))}
```
Bu hesaplama `useMemo` ile memoize edilmeli.

---

## 📐 Responsive Design Sorunları

### 41. Tablet Desteği Yok
- `Scaler.ts` sadece phone boyutları için optimize
- Kart genişlikleri sabit (tablet'te çok küçük kalır)
- Grid layout yok — tablet'te çift sütun görünüm olmalı

### 42. Landscape Mode Desteği Yok
- `Dimensions.get('window')` uygulama açılışında bir kez çağrılır
- Ekran döndürüldüğünde boyutlar güncellenmez

### 43. Safe Area Tutarsızlığı
- Translucent StatusBar kullanan ekranlar (`PlaceDetailScreen`, `MapFullScreen`, `NavigationScreen`) Top safe area'yı kendileri yönetiyor
- Diğer ekranlar `StatusBar` component'i ile height ekliyor
- `ScreenWrapper` ayrıca `StatusBar` tanımlıyor — çoklu StatusBar çakışması riski

---

## 🔧 Kod Kalitesi / Mimari Sorunları

### 44. Navigation Types Eksik
`RootStackParamList` type'ını kontrol etmek lazım ama birçok ekranda `as never` veya `as any` type casting kullanılıyor:
- `EmailVerificationScreen:41` → `navigation.navigate('Main' as never)`
- `ResetPasswordScreen:30` → `navigation.navigate('Login' as never)`

Bu, navigation type'larının tam tanımlanmadığını gösteriyor.

### 45. Mock Data Pattern Tutarsız
Bazı ekranlar JSON dosyalarından veri çekiyor (`homeData`, `discoverData`, `routesData`), bazıları component içinde hardcoded array kullanıyor:
- `BookmarksSavedScreen` → İçinde `BOOKMARKS` array
- `OfflineRoutesScreen` → İçinde `OFFLINE_ROUTES` array
- `TripHistoryScreen` → İçinde `TRIPS` array
- `NavigationScreen` → İçinde `MOCK_STEPS` array
- `ReviewsScreen` → İçinde `MOCK_REVIEWS` array
- `MapFullScreen` → İçinde `MAP_PINS` array
- `WeatherDetailScreen` → İçinde `HOURLY` ve `WEEKLY` arrays

Tek bir pattern (JSON + Redux veya Context) ile tutarlı hale getirilmeli.

---

## Özet Tablo

| Kategori | Sayı |
|----------|------|
| 🔴 Auth Navigasyonu | 1 |
| 🔴 Dark Mode | 4 |
| 🟡 Erişilebilirlik | 3 |
| 🟠 Görsel Tutarsızlık | 4 |
| 🔵 Kullanıcı Deneyimi | 18 |
| 🟣 Gereksiz / Tekrarlayan Kod | 5 |
| 📝 Lokalizasyon | 2 |
| ⚡ Performans | 3 |
| 📐 Responsive | 3 |
| 🔧 Kod Kalitesi | 2 |
| **Toplam** | **45** |
