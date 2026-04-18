# 🎨 Toronto — UI/UX Hata ve İyileştirme Raporu

> Son güncelleme: 2026-04-18 — 41 ekran ve tüm componentler detaylı incelendi.
> Durum güncellemesi: 2026-04-18 — Kod tabanı tek tek incelenerek her sorunun mevcut durumu işaretlendi.

**Durum ikonları:** ✅ Çözüldü · ⚠️ Kısmen çözüldü · ❌ Henüz çözülmedi

---

## 🔴 KRİTİK — Auth Navigasyonu

### 1. ✅ `App.tsx:43-47` — Token Mantığı Düzeltildi

```tsx
{screenState.token ? (
  <RootStackNavigator />   // token VAR → Ana sayfa ✅
) : (
  <AuthStackNavigator />   // token YOK → Auth ✅
)}
```

---

## 🔴 KRİTİK — Dark Mode Sorunları

### 2. ✅ `SplashScreen.tsx` — Dark Mode Desteği Eklendi

`useColors()` + `makeStyles(colors)` pattern'i kullanılıyor; arka plan `colors.primary` ile dinamik.

### 3. ✅ `OnboardingScreen.tsx:79` — StatusBar Dark Modda Düzeltildi

```tsx
<StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} />
```

`currentTheme` import edilip doğru koşula bağlandı.

### 4. ⚠️ 18 Ekranda Hardcoded `'#FFFFFF'` Kullanımı

Kart arka planları artık `colors.white` kullanıyor. Ancak bazı ekranlarda **icon/accent rengi** olarak tasarım amacıyla kullanılan `'#FFFFFF'` kalıyor (primary mavi buton üzerindeki beyaz ikon/metin — bunlar intentional). Gerçek anlamda sorun olan **kart arka planı** kullanımları düzeltildi.

Hâlâ dikkat edilmesi gereken dosyalar (accent değil, gerçek arka plan çakışması riski):
- `OnboardingScreen` — slide `iconBg` renkleri hardcoded (ama sabit pastel renkler, dark modda görsel bozukluk yok)

### 5. ⚠️ 11 Ekranda Hardcoded `'#F59E0B'` Star Rengi

Yıldız renkleri `colors.warning` kullanan ekranlar büyük çoğunluk oldu. Hâlâ literal `'#F59E0B'` kullanan 7 dosya var (`ShareRouteScreen`, `OnboardingScreen`, `InterestsScreen`, `BudgetSettingsScreen`, `TravelStyleScreen`, `NotificationSettingsScreen`, `NotificationsScreen`) — bunlar çoğunlukla yıldız değil, UI accent rengi olarak kullanıyor. Yine de `colors.warning` ile değiştirilmeli.

---

## 🟡 Erişilebilirlik (Accessibility) Sorunları

### 6. ✅ Accessibility Label'lar Eklendi

15 kritik ekranda `accessibilityLabel` ve `accessibilityRole` eklendi:
`WeatherDetailScreen`, `NavigationScreen`, `EditProfileScreen`, `SearchResultsScreen`, `BookmarksSavedScreen`, `MapFullScreen`, `RouteDetailScreen`, `PlaceDetailScreen`, `OfflineRoutesScreen`, `TripHistoryScreen`, `CityPickerScreen`, `ShareRouteScreen`, `ReviewsScreen`, `FilterScreen`, `ChangePasswordScreen`

❌ Hâlâ eksik olan ekranlar: `HomeScreen`, `ExploreScreen`, `RoutesScreen`, `ProfileScreen`, `PremiumUpgradeScreen`, `CreateRouteScreen`, `SeeAllScreen`, `BelenScreen` header butonları.

### 7. ✅ Dokunma Alanları Standardize Edildi

`Layout.hitArea.min = wScale(44)` ve `Layout.hitArea.backButton = wScale(44)` token'ları eklendi. Tüm back/close butonları bu değerleri kullanıyor. `StackHeader` back butonu 44×44.

### 8. ✅ Renk Kontrastı İyileştirildi

- `WeatherDetailScreen` `hiLow`: `rgba(255,255,255,0.75)` → `rgba(255,255,255,0.9)` ✅ (bu oturum)
- `WeatherDetailScreen` `condition`: `rgba(255,255,255,0.85)` ✅
- `NavigationScreen` distance text: `rgba(255,255,255,0.85)` ✅
- `HeroCard` subtitle: `rgba(255,255,255,0.85)` ✅
- `TrendingCard` review text: `rgba(255,255,255,0.85)` ✅

---

## 🟠 Görsel Tutarsızlıklar

### 9. ✅ Border Radius Sistemi Eklendi

`Layout.borderRadius` token sistemi aktif:

```ts
borderRadius: { xs, sm, md, lg, xl, '2xl', pill, circle }
```

Tüm yeni ekranlar bu token'ları kullanıyor.

### 10. ✅ Gölge (Shadow/Elevation) Sistemi Eklendi

`Layout.shadow` token sistemi aktif: `{ xs, sm, md, lg, xl }` — her biri tutarlı `shadowOpacity` + `elevation` çiftiyle.

### 11. ✅ Header Padding Tutarsızlığı Giderildi

`Layout.translucentTopOffset = hScale(52)` sabit değeri eklendi. Translucent StatusBar kullanan 3 ekran (`PlaceDetailScreen`, `MapFullScreen`, `NavigationScreen`) bu sabiti kullanıyor.

### 12. ❌ Kart Boyutları ve Yükseklikleri Tutarsız

| Component | Genişlik | Yükseklik |
|-----------|----------|-----------|
| `GemCard` | `148` | `200` |
| `TrendingCard` (Home) | `180` | `150` |
| `TrendingNearCard` (Explore) | `160` | `170` |

Horizontal scroll'larda tutarsız boyutlar devam ediyor.

---

## 🔵 Kullanıcı Deneyimi (UX) Sorunları

### 13. ⚠️ Pull-to-Refresh Kısmen Eklendi

`RefreshControl` eklenen ekranlar: `ReviewsScreen` ✅, `BookmarksSavedScreen` ✅, `TripHistoryScreen` ✅, `OfflineRoutesScreen` ✅

❌ Hâlâ eksik: `HomeScreen`, `ExploreScreen`, `RoutesScreen`, `ProfileScreen`, `SearchResultsScreen`

### 14. ❌ İmaj Yükleme/Hata Durumu Yok

Hiçbir `<Image>` componentinde:
- Loading placeholder (skeleton/shimmer) yok
- Error fallback yok — `onError` handler yok

Etkilenen: `GemCard`, `TrendingCard`, `HeroCard`, `OngoingJourneyCard`, `PlaceDetailScreen` hero, `BookmarksSavedScreen` thumb, `SearchResultsScreen` thumb, `BelenScreen` route card images

### 15. ⚠️ Loading State Kısmen Eklendi

- `ChangePasswordScreen` — ✅ `ActivityIndicator` + simüle API
- `ReviewsScreen` — ✅ `isSubmitting` + `ActivityIndicator`

❌ Hâlâ eksik:
- `EditProfileScreen` — Save basılınca loading state yok
- `EmailVerificationScreen` — Verify anında direkt navigate
- `ResetPasswordScreen` — Aynı sorun

### 16. ✅ FilterScreen Filtreler Artık Uygulanıyor

```tsx
const applyFilters = () => {
  navigation.navigate({ name: 'SearchResults', params: { filters: { ... } }, merge: true });
};
```

Filtreler `SearchResultsScreen`'e navigation params ile iletiliyor.

### 17. ✅ CityPickerScreen Şehir Seçimi Redux'a Kaydediliyor

```tsx
const selectCity = (name: string) => {
  dispatch(setLocationName(name));  // Redux'a yazılıyor ✅
  navigation.goBack();
};
```

### 18. ❌ BookmarksSavedScreen — Veriler Statik

```tsx
const BOOKMARKS = [
  { id: '1', name: 'Hagia Sophia', ... },
];
```

Hardcoded. Redux/storage entegrasyonu yok.

### 19. ❌ OfflineRoutesScreen — Gerçek Download Yok

`OFFLINE_ROUTES` hardcoded. "Download" butonu yok, silme sadece local state'den siliyor.

### 20. ✅ ShareRouteScreen — Tüm Butonlar Çalışıyor

- "Copy Link" → `Clipboard.setString` + `Alert` ✅
- "Share via..." → `Share.share()` native sheet ✅
- "Show QR Code" → `Alert` (coming soon) ✅

### 21. ⚠️ TripHistoryScreen — İstatistikler Artık Hesaplanıyor

`avgRating` ve `totalKm` artık `TRIPS` dizisinden dinamik hesaplanıyor ✅. Ancak `TRIPS` dizisi hâlâ hardcoded.

### 22. ❌ WeatherDetailScreen — Tümü Mock Veri

`HOURLY` ve `WEEKLY` dizileri hardcoded. `city` parametresi alınıyor ama veriler değişmiyor.

### 23. ⚠️ ReviewsScreen — Kısmen İyileştirildi

- "Helpful" butonu artık çalışıyor (`toggleHelpful`) ✅
- `isSubmitting` loading state var ✅
- `RefreshControl` var ✅
- ❌ Veriler session'da kaybolur (storage/API yok)

### 24. ✅ NavigationScreen — End Navigation Onayı Eklendi

```tsx
Alert.alert(
  t('navigation.endConfirmTitle'),
  t('navigation.endConfirmMessage'),
  [{ text: 'Cancel', style: 'cancel' }, { text: 'End', onPress: () => navigation.goBack() }]
);
```

### 25. ✅ MapFullScreen — Butonlar Artık Fonksiyonel

- "Layers" butonu → `Alert.alert(t('map.layersNotAvailable'))` ✅
- Zoom butonları → `setZoom()` state'i güncelliyor ✅
- Pin'e tıklanınca tooltip, ikinci tıkta `PlaceDetail` navigasyonu ✅

### 26. ⚠️ Keyboard Handling Kısmen Düzeltildi

- `ReviewsScreen` Modal — `KeyboardAvoidingView` ✅
- `ChangePasswordScreen` — `keyboardShouldPersistTaps="handled"` ✅
- `CityPickerScreen` — `keyboardShouldPersistTaps="handled"` ✅
- `EditProfileScreen` — `keyboardShouldPersistTaps="handled"` ✅

❌ Hâlâ eksik: `SearchResultsScreen` — `KeyboardAvoidingView` yok

### 27. ✅ Tab Bar "Belen" İsmi Güncellendi

```json
"belen": "AI"
```

Artık "Discover" ile karışmıyor.

### 28. ⚠️ PlaceDetailScreen — Butonlar Çalışıyor, İçerik Statik

- "Add to Route" → `Alert.alert(t('common.addedToRoute'))` ✅
- "Save" → `setIsSaved` toggle + `Alert` ✅
- "Reviews" → `navigation.navigate('Reviews', ...)` ✅
- ❌ Tags, description, address, hours hâlâ hardcoded

### 29. ❌ Horizontal Scroll Göstergesi Eksik

`HomeScreen` ve `ExploreScreen`'deki yatay kart listelerinde `showsHorizontalScrollIndicator={false}` var. Kullanıcıya scroll ipucu verilmiyor.

### 30. ✅ BelenScreen Chat Scroll Sorunu Düzeltildi

`onContentSizeChange` + `setTimeout` çift scroll çakışması giderildi. `setTimeout` kaldırıldı, `onContentSizeChange` tek ve `animated: true` olarak çalışıyor.

❌ Hâlâ eksik: Typing indicator (bot yanıt verirken "..." animasyonu), mesaj timestamp'leri.

---

## 🟣 Gereksiz / Kullanılmayan Componentler

### 31. ❌ `Header/Header.tsx` — Hiçbir Yerde Kullanılmıyor

200 satırlık component import edilmiyor.

### 32. ❌ `SearchBar/SearchBar.tsx` — Hiçbir Yerde Kullanılmıyor

85 satırlık component — ekranlar inline search bar kullanıyor.

### 33. ❌ `FilterChips/FilterChips.tsx` — Hiçbir Yerde Kullanılmıyor

90 satırlık component — ekranlar inline chip kullanıyor.

### 34. ❌ `PlaceListItem/PlaceListItem.tsx` — Hiçbir Yerde Kullanılmıyor

223 satırlık component — ekranlar kendi list item'larını inline oluşturmuş.

### 35. ✅ Tekrarlayan Header Pattern — StackHeader Component'i Oluşturuldu

`StackHeader/StackHeader.tsx` ile standardize edildi. `title`, `rightIcon`, `rightComponent`, `onRightPress` prop'larıyla esnek; `StatusBar`, `accessibilityLabel`, `hitSlop`, 44×44 back butonu dahil.

---

## 📝 Lokalizasyon (i18n) Sorunları

### 36. ⚠️ Yeni Ekranların i18n Kullanımı Kısmen Tamamlandı

`useTranslation` kullanan ekran sayısı 9'dan **24'e** çıktı.

✅ Çözülmüş ekranlar: `PlaceDetailScreen`, `RouteDetailScreen`, `NavigationScreen`, `MapFullScreen`, `BookmarksSavedScreen`, `ReviewsScreen`, `FilterScreen`, `SearchResultsScreen`, `ChangePasswordScreen`, `EditProfileScreen`, `WeatherDetailScreen`, `ShareRouteScreen`, `CityPickerScreen`, `OfflineRoutesScreen`, `TripHistoryScreen`

❌ Hâlâ i18n eksik / hardcoded metin kullanan ekranlar:

| Ekran | Hardcoded Örnekler |
|-------|-------------------|
| `OnboardingScreen` | Slide title ve subtitle metinleri (`t('onboarding.slide1Title')` key'leri var ama kullanılmıyor) |
| `PremiumUpgradeScreen` | Plan metinleri, feature listesi |
| `ChatSettingsScreen` | Tüm ayar label'ları |
| `TermsOfServiceScreen`, `PrivacyPolicyScreen`, `HelpCenterScreen` | Tüm içerik metinleri |

### 37. ✅ ExploreScreen ve RoutesScreen i18n Kullanıyor

Her iki ekran da `t()` çağrılarını section title'lar dahil kullanıyor. Sorun giderildi.

---

## ⚡ Performans Sorunları

### 38. ❌ ExploreScreen İnline Sub-Component'ler

`ExploreScreen.tsx` içinde 3 büyük inline component tanımlı, `React.memo` yok:
- `ExploreMapView` (~230 satır)
- `TrendingNearCard` (~90 satır)
- `ResultItem` (~95 satır)

Her render'da yeniden oluşturulur.

### 39. ❌ Resimlerde Cache Stratejisi Yok

Tüm resimler `<Image source={{ uri: ... }}>`. Disk cache için `react-native-fast-image` entegre edilmeli.

### 40. ✅ MapFullScreen Grid `useMemo` ile Memoize Edildi

```tsx
const gridBlocks = useMemo(() => Array.from({ length: 30 }, ...), []);
```

`NavigationScreen`'deki aynı sorun da bu oturumda düzeltildi (inline `useMemo` → component değişkeni).

---

## 📐 Responsive Design Sorunları

### 41. ❌ Tablet Desteği Yok

`Scaler.ts` sadece phone boyutları için. Kart genişlikleri sabit, grid layout yok.

### 42. ❌ Landscape Mode Desteği Yok

`Dimensions.get('window')` uygulama açılışında bir kez çağrılır; döndürme olayına tepki vermez.

### 43. ⚠️ Safe Area Kısmen Standardize Edildi

`Layout.translucentTopOffset = hScale(52)` ile 3 ekranın farklı değerleri (`48`, `50`, `52`) tek sabite indirgendi ✅. `ScreenWrapper` ile diğer ekranlar arasındaki StatusBar çakışması hâlâ gözlemlenmeli.

---

## 🔧 Kod Kalitesi / Mimari Sorunları

### 44. ❌ Navigation Types Eksik — `as never` Kullanımı Devam Ediyor

`as never` / `as any` hâlâ 10 dosyada mevcut (`BelenScreen`, `SeeAllScreen`, `ExploreScreen`, `SearchResultsScreen`, `FilterScreen`, `OnboardingScreen`, `RoutesScreen`, `EmailVerificationScreen`, `ResetPasswordScreen`, `OngoingJourneyCard`).

`RootStackParamList` tüm ekranları kapsayacak şekilde genişletilmeli.

### 45. ❌ Mock Data Pattern Tutarsız

JSON + inline array karışıklığı devam ediyor:
- JSON kullananlar: `HomeScreen` (`homeData`), `ExploreScreen` (`discoverData`), `RoutesScreen` (`routesData`)
- Inline array kullananlar: `BookmarksSavedScreen` (`BOOKMARKS`), `OfflineRoutesScreen` (`OFFLINE_ROUTES`), `TripHistoryScreen` (`TRIPS`), `NavigationScreen` (`MOCK_STEPS`), `ReviewsScreen` (`MOCK_REVIEWS`), `MapFullScreen` (`MAP_PINS`), `WeatherDetailScreen` (`HOURLY`, `WEEKLY`)

---

## Özet Tablo

| Kategori | Toplam | ✅ Çözüldü | ⚠️ Kısmen | ❌ Açık |
|----------|--------|-----------|-----------|---------|
| 🔴 Auth Navigasyonu | 1 | 1 | 0 | 0 |
| 🔴 Dark Mode | 4 | 3 | 1 | 0 |
| 🟡 Erişilebilirlik | 3 | 2 | 1 | 0 |
| 🟠 Görsel Tutarsızlık | 4 | 3 | 0 | 1 |
| 🔵 Kullanıcı Deneyimi | 18 | 8 | 6 | 4 |
| 🟣 Gereksiz / Tekrarlayan Kod | 5 | 1 | 0 | 4 |
| 📝 Lokalizasyon | 2 | 1 | 1 | 0 |
| ⚡ Performans | 3 | 1 | 0 | 2 |
| 📐 Responsive | 3 | 0 | 1 | 2 |
| 🔧 Kod Kalitesi | 2 | 0 | 0 | 2 |
| **Toplam** | **45** | **20** | **10** | **15** |
