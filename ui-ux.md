# 🎨 Toronto — UI/UX Hata ve İyileştirme Raporu

> Proje genelinde tüm ekranlar ve componentler detaylı incelenerek UI/UX açısından sorunlu ve düzgün olmayan noktalar listelenmiştir.

---

## 🔴 KRİTİK — Dark Mode Sorunları

### 1. Auth Ekranları Dark Mode'u Desteklemiyor
**Dosyalar:** `LoginScreen.tsx`, `RegisterScreen.tsx`, `ForgotPasswordScreen.tsx`

Bu 3 ekran `Colors.ts` (sadece light renkler) kullanıyor, `useColors()` hook'unu kullanmıyor. Dark modda:
- Arka plan beyaz kalır → göz yakar
- Metin renkleri değişmez → okunmaz olur
- Input alanları dark arka plan üzerinde beyaz kalır

### 2. 6 Component Dark Mode Desteklemiyor
Aşağıdaki componentler `Colors.ts` import edip sabit renkler kullanıyor:

| Component | Sorun |
|-----------|-------|
| `Header/Header.tsx` | Tüm renkler sabit — dark modda beyaz üstüne beyaz |
| `SearchBar/SearchBar.tsx` | Input ve container renkleri değişmiyor |
| `FilterChips/FilterChips.tsx` | Chip renkleri sabit `Colors.white` |
| `PlaceListItem/PlaceListItem.tsx` | Kart arka planı, metin renkleri sabit |
| `Input/Input.tsx` | `placeholderTextColor` sabit |
| `Button/Button.tsx` | `indicatorColor` sabit `Colors.white` |

### 3. `ScreenWrapper.tsx` Dark Mode Bozmaz Ama Zorlayıcı
```tsx
backgroundColor = Colors.inputBackground  // Varsayılan hardcoded light renk
statusBarStyle = 'dark-content'           // Her zaman dark-content
```
Auth ekranları bu wrapper'ı kullanıyor. Dark modda StatusBar `dark-content` kalır → koyu arka plan üzerinde koyu status bar ikonları görünmez.

---

## 🟡 Erişilebilirlik (Accessibility) Sorunları

### 4. Dokunma Alanlarının Çoğu Çok Küçük
Apple yönergeleri minimum **44×44 pt**, Android ise **48×48 dp** tıklama alanı öneriyor.

| Dosya | Element | Mevcut Boyut | Gerekli |
|-------|---------|-------------|---------|
| `HomeScreen.tsx:143` | Compact header bell butonu | 30×30 | 44×44 |
| `ExploreScreen.tsx:253-283` | Harita zoom butonları | 32×32 | 44×44 |
| `BelenScreen.tsx:508` | Header back/settings butonları | 36×36 | 44×44 |
| `ProfileScreen.tsx:270` | Camera butonu | 26×26 | 44×44 |

`hitSlop={8}` bazı yerlerde kullanılmış ama tutarsız — bazı butonlarda var, bazılarında yok.

### 5. Accessibility Label Eksiklikleri
- `HomeScreen` — Hiçbir buton/kart `accessibilityLabel` veya `accessibilityRole` içermiyor.
- `ExploreScreen` — Harita pin'lerinde, zoom butonlarında, filtre butonlarında accessibility yok.
- `BelenScreen` — Chat mesajları, suggestion chip'leri, send butonu — accessibility yok.
- `RoutesScreen` — Date strip, plan card, action butonları — accessibility yok.
- `ProfileScreen` — Setting satırlarında accessibility yok.

`TabBar.tsx` doğru yapıyor (`accessibilityRole="button"`, `accessibilityState`) — diğer componentler de böyle olmalı.

### 6. Renk Kontrastı Yetersiz Olan Metinler
- `GemCard.tsx:138` — `rgba(255,255,255,0.85)` rating text: Resim üzerinde okunabilirlik güvensiz.
- `TrendingCard.tsx:181` — `rgba(255,255,255,0.65)` review text: Çok soluk, kontrast oranı düşük.
- `HeroCard.tsx:139` — `rgba(255,255,255,0.65)` subtitle: Aynı sorun.
- `OngoingJourneyCard.tsx:58` — "Route Map" mini label: Çok küçük (`10px`), mapBackground üstünde zor okunur.

### 7. Resim İçerikli Kartlarda Scrim Tutarsızlığı
- `GemCard` — `rgba(10,20,40,0.72)` bottomOverlay, karanlık ama sabit.
- `TrendingCard` — `rgba(10,20,40,0.45)` overlay, daha açık.
- `HeroCard` — `rgba(10,18,35,0.18)` + `rgba(10,18,35,0.72)` iki katman.

Her kartta farklı scrim opacity'si var — tutarlı bir gradient overlay yaklaşımı kullanılmalı.

---

## 🟠 Görsel Tutarsızlıklar

### 8. Kart Boyutları ve Yükseklikleri Tutarsız
| Component | Genişlik | Yükseklik |
|-----------|----------|-----------|
| `GemCard` | `148` | `200` |
| `TrendingCard` (HomeScreen) | `180` | `150` |
| `TrendingNearCard` (ExploreScreen) | `160` | `170` |

Aynı horizontal scroll'da farklı boyutlarda kartlar var. Tutarlı bir boyut sistemi olmalı.

### 9. Border Radius Tutarsızlığı
| Element | Radius |
|---------|--------|
| `GemCard` | `18` |
| `TrendingCard` | `18` |
| `HeroCard` | `22` |
| `OngoingJourneyCard` | `20` |
| `PlanCard` (RoutesScreen) | `20` |
| `BelenScreen` route card | `16` |
| `Button` | `24` (pill) |
| `LocationChip` | `20` (pill) |
| `Tab Bar special button` | `25` (circle) |
| `ProfileScreen statsCard` | `18` |

5 farklı radius kullanılmış. Bir design token sistemi (`borderRadius.sm/md/lg/xl`) olmalı.

### 10. Gölge (Shadow) Tutarsızlığı
Her componette farklı shadow değerleri var:
- `shadowOpacity`: 0.05, 0.06, 0.07, 0.08, 0.10, 0.12, 0.18, 0.25, 0.30, 0.35, 0.40
- `shadowRadius`: 3, 4, 6, 8, 10, 12, 14
- `elevation`: 1, 2, 3, 4, 6, 8, 10, 16

Standart bir elevation sistemi (`shadow.xs/sm/md/lg/xl`) tanımlanmalı.

### 11. Padding/Margin Tutarsızlığı
Section aralarında farklı spacing değerleri:
- `HomeScreen.heroSection`: `marginTop: hScale(20)`, `marginBottom: hScale(20)`
- `HomeScreen.section`: `marginBottom: hScale(32)`
- `ExploreScreen.section`: `marginBottom: hScale(28)`
- `RoutesScreen.section`: `marginTop: hScale(24)`
- `ProfileScreen.statsCard`: `marginTop: hScale(20)`, `marginBottom: hScale(16)`

Bir spacing sistemi (`spacing.xs/sm/md/lg/xl`) tanımlanmalı.

### 12. Hardcoded `'#FFFFFF'` ve `'#F59E0B'` Renk Değerleri
Theme sistemi var ama birçok yerde renkler hardcoded:
- `TabBar.tsx:95` — `color='#FFFFFF'` special tab ikonu
- `GemCard.tsx:50,51,99,121,127` — `'#FFFFFF'` birçok yerde
- `TrendingCard.tsx:124,139,149,164,176` — `'#FFFFFF'`
- `HeroCard.tsx:117,132,151,166,174` — `'#FFFFFF'`
- `ExploreScreen.tsx:204,337` — `'#F59E0B'` star rengi
- `ProfileScreen.tsx:338,339` — `'#D1FAE5'`, `'#10B981'` sabit renkler

Dark modda `#FFFFFF` her zaman beyaz kalır — `colors.white` kullanılmalı (dark modda `#1E293B`'dir).

---

## 🔵 Kullanıcı Deneyimi (UX) Sorunları

### 13. İşlevsiz Butonlar — Tıklanabilir Görünüp Hiçbir Şey Yapmayan Elemanlar
Kullanıcı bir butona bastığında bir sonuç bekler. Aşağıdakiler hayal kırıklığına neden olur:

**HomeScreen:**
- Bildirim bell butonu × 2 (full header + compact)
- Lokasyon chip'i (dropdown oku var ama açılmıyor)
- "View Route" butonu (HeroCard)
- "Save" butonu (HeroCard)
- Tüm GemCard ve TrendingCard tıklamaları
- "See all" butonları × 2

**ExploreScreen:**
- Bell butonu
- Filtre butonu (sarı, göze çarpan ama işlevsiz)
- "See all" butonu
- Harita zoom butonları (+/−)
- Harita üzerindeki pin'ler (sadece tooltip açar ama navigasyon yok)

**RoutesScreen:**
- Continue butonu
- Details butonu
- Tüm SavedRouteRow tıklamaları
- Create New Route butonu
- SEE ALL butonu

**ProfileScreen:**
- Edit Profile butonu
- Camera butonu (profil foto değiştirme)
- Currency, Notifications, Location Access, Interests, Budget, Travel Style
- Help Center, Privacy Policy, Terms of Service
- Upgrade to Premium butonu

**BelenScreen:**
- Back butonu (←)
- Settings butonu
- Start Navigation butonu
- Share ve Download butonları (RouteCard)

### 14. İmaj Yükleme/Hata Durumu Yok
Hiçbir `<Image>` componentinde:
- Loading placeholder (skeleton/shimmer) yok
- Error fallback yok — resim yüklenemezse boş/kırık görünür
- `onError` handler yok

`GemCard`, `TrendingCard`, `HeroCard`, `OngoingJourneyCard`, `PlaceListItem` — hepsi remote URL kullanıyor.

### 15. ScrollView'larda Pull-to-Refresh Yok
Ana ekranlar (`HomeScreen`, `ExploreScreen`, `RoutesScreen`, `ProfileScreen`) `ScrollView` kullanıyor ama `refreshControl` yok — kullanıcı aşağı çekerek yenileyemiyor.

### 16. Loading State Gösterimi Yok
Hiçbir ekranda:
- Veri yükleme sırasında skeleton/loading indicator yok
- JSON dosyalarından veri çekilse bile ekran ilk açıldığında bir anlık boş görünebilir
- Login/Register submit edildiğinde loading state yok (Button'da `isLoading` prop'u var ama kullanılmıyor)

### 17. Empty State Gösterimi Yok
- ExploreScreen filtre sonuç bulamazsa empty state gösterilmiyor (tüm sonuçlar gösteriliyor)
- RoutesScreen saved routes boşsa ne gösterilir? Tanımsız.
- BelenScreen mesaj yoksa empty state yok.

### 18. Hata Gösterimi Yok
- Login/Register'da validation feedback yok (Input'ta `error` prop'u var ama kullanılmıyor)
- Email format doğrulaması yok (`checkEmail` fonksiyonu utils'de var ama import edilmiyor)
- Şifre güçlülük göstergesi yok
- Password mismatch RegisterScreen'de sadece `console.log` ile bildirilir — UI feedback yok

### 19. Keyboard Handling Eksiklikleri
- `ExploreScreen` — Arama input'u var ama `KeyboardAvoidingView` yok.
- `BelenScreen:498-499` — `keyboardVerticalOffset={hScale(0)}` → Tab bar yüksekliği hesaba katılmıyor, klavye input'u kapatabilir.
- `ScrollView` içindeki input'larda `keyboardShouldPersistTaps="handled"` eksik (sadece `ScreenWrapper`'da var).

### 20. Tab Bar'da "Belen" İsmi Anlaşılmaz
```json
"belen": "Discover"  // en.json
"belen": "Keşif"     // tr.json
```
Tab ismi "Discover" ama ekran içindeki başlık "Travel Assistant" — birbiriyle tutarsız. Kullanıcı "Discover" sekmesine tıklayınca AI chat görmesi kafa karıştırıcı. `ExploreScreen`'in başlığı da "DISCOVER / New Adventures" — iki farklı sekme "Discover" adını kullanıyor.

### 21. Horizontal Scroll Göstergesi Yok
`HomeScreen` ve `ExploreScreen`'deki yatay kart listeleri (`showsHorizontalScrollIndicator={false}`):
- Kullanıcı sağa kaydırılabilir olduğunu anlamayabilir
- Listenin sonunda olduğunu anlayamaz
- En azından ilk el hareketi ipucu (peek animation) veya dot indicator olmalı

### 22. Arama Çubuğu Eksik Özellikler
`ExploreScreen` arama çubuğu:
- Clear butonu yok (x ikonu)
- Arama geçmişi yok
- Son aramalar yok
- Zaten arama fonksiyonalitesi yok (sadece state, filtreleme bağlantısı yok)

### 23. `PlaceListItem` Prop Senkronizasyon Sorunu
```tsx
isLiked: initialLiked = false,
// ...
const [liked, setLiked] = useState(initialLiked);
```
`isLiked` prop'u değiştiğinde state güncellenmez çünkü `useState` sadece ilk render'da initial değeri alır. Parent yeniden veri çekerse like durumu eski kalır.

### 24. BelenScreen Chat UX Sorunları
- Mesaj gönderildiğinde typing indicator/loading animasyonu yok — cevap anında geliyor, yapay hissettiriyor
- Mesaj gönderildikten sonra scroll otomatik oluyor ama `setTimeout(100ms)` ile — güvenilir değil, `onContentSizeChange` zaten ayrıca tanımlı → çift scroll çağrısı olabilir
- Kullanıcı mesajlarını silme/düzenleme yolu yok
- Mesaj timestamp'i gösterilmiyor

### 25. RoutesScreen Takvim UX Sorunu
- Seçili güne göre farklı plan gösterilmiyor — hangi günü seçersen seç aynı "Today's Plan" görünüyor
- Hafta değiştirme (önceki/sonraki hafta) butonu yok
- Bugünün hangi gün olduğu grafiksel olarak belirtilmiyor (sadece seçili gün = bugün varsayımı)

---

## 🟣 Gereksiz / Kullanılmayan Componentler

### 26. `Header/Header.tsx` — Hiçbir Yerde Kullanılmıyor
200 satırlık Header component'i var ama hiçbir ekranda import edilmiyor. `HomeScreen` kendi header'ını inline olarak oluşturmuş.

### 27. `SearchBar/SearchBar.tsx` — Hiçbir Yerde Kullanılmıyor
85 satırlık component var ama `ExploreScreen` kendi search bar'ını inline oluşturmuş.

### 28. `FilterChips/FilterChips.tsx` — Hiçbir Yerde Kullanılmıyor
90 satırlık component var ama `ExploreScreen` chips'leri inline oluşturmuş.

### 29. `PlaceListItem/PlaceListItem.tsx` — Hiçbir Yerde Kullanılmıyor
223 satırlık component var ama `ExploreScreen` kendi `ResultItem`'ını inline oluşturmuş.

### 30. Boş Style Dosyaları
- `TabBar/TabBar.style.ts` — İçeriği sadece `export {};` — birkaç component'te stiller ayrı dosyada, birkaçında inline.

---

## ⚡ Performans Bazlı UI Sorunları

### 31. `StyleSheet.create` Her Render'da Yeniden Oluşturuluyor
`makeStyles(colors)` pattern'i `useMemo` ile kullanılıyor — bu doğru. Ama `ExploreScreen` içindeki `TrendingNearCard` ve `ResultItem` sub-component'leri ayrı `useMemo` ile kendi style'larını oluşturuyor — bu gereksiz re-creation.

### 32. Büyük Inline Component'ler Re-Render Sorunu
- `ExploreScreen.tsx:60-287` — `ExploreMapView` (227 satır) tüm state değişikliklerinde yeniden render olur çünkü parent'ın içinde tanımlı ve `React.memo` kullanılmıyor.
- `ExploreScreen.tsx:291-378` — `TrendingNearCard` aynı sorun.
- `ExploreScreen.tsx:382-476` — `ResultItem` aynı sorun.

### 33. `Animated.ScrollView` + `useNativeDriver: true` Sınırlaması
`HomeScreen.tsx:156-159` — `useNativeDriver: true` kullanılmış bu iyi. Ama layout-dependent animasyonlarda (opacity ve transform) native driver sınırlıdır. Eğer gelecekte color veya layout animasyonu eklenecekse warning verecektir.

### 34. Resimlerde Cache Stratejisi Yok
Tüm resimler `<Image source={{ uri: ... }}>` kullanıyor — React Native varsayılan cache'ini kullanır. Büyük çaplı uygulamada `react-native-fast-image` gibi kütüphanelerle disk cache sağlanmalı.

---

## 📐 Responsive Design Sorunları

### 35. Tablet Desteği Yok
- `Scaler.ts` — Sadece `Dimensions.get('window')` tabanlı ölçekleme. Tablet'te tüm UI orantısız büyür.
- Kart genişlikleri sabit (`wScale(148)`, `wScale(180)`) — tablet'te çok küçük kalır.
- Grid layout yok — tablet'te 2 sütun kart görünümü olmalı.

### 36. Landscape Mode Desteği Yok
- `Dimensions.get('window')` uygulama açılış anında bir kez çağrılır.
- Ekran döndürüldüğünde boyutlar güncellenmez.
- Tüm layout portrait varsayımıyla tasarlanmış.

### 37. Safe Area Tutarsızlığı
- `ReduxProvider.tsx` — `SafeAreaView edges={['top', 'bottom']}` kullanıyor.
- Ama her ekran kendi `StatusBar` bileşenini ayrıca tanımlıyor.
- `ScreenWrapper` de ayrı `StatusBar` tanımlıyor.
- Çoklu `StatusBar` çakışması olabilir.

---

## 📝 Lokalizasyon (i18n) UI Sorunları

### 38. Ekranların %70'i Hardcoded İngilizce
i18n sistemi kurulu ama sadece auth ekranları ve HomeScreen selamlama kısmında kullanılıyor.

| Ekran | i18n Durumu |
|-------|------------|
| HomeScreen | ⚠️ Kısmi (sadece selamlama) — section başlıkları İngilizce |
| ExploreScreen | ❌ Tamamen İngilizce |
| RoutesScreen | ❌ Tamamen İngilizce |
| BelenScreen | ❌ Tamamen İngilizce |
| ProfileScreen | ❌ Neredeyse tamamen İngilizce (sadece dil modal'ı) |
| Auth Ekranları | ✅ Tam i18n |

### 39. Uzun Türkçe Çeviriler Layout Bozabilir
Türkçe metinler genellikle İngilizce'den %15-30 daha uzundur. `numberOfLines={1}` kullanılan yerlerde kesilme yaşanabilir. Özellikle:
- `HomeScreen` compact header selamlama
- Kart isimleri
- Buton metinleri

---

## Özet Tablo

| Kategori | Sayı |
|----------|------|
| 🔴 Dark Mode | 3 |
| 🟡 Erişilebilirlik | 4 |
| 🟠 Görsel Tutarsızlık | 5 |
| 🔵 Kullanıcı Deneyimi | 13 |
| 🟣 Gereksiz Component | 5 |
| ⚡ Performans | 4 |
| 📐 Responsive | 3 |
| 📝 Lokalizasyon | 2 |
| **Toplam** | **39** |
