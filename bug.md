# 🐛 Toronto — Bug & Issue Raporu

> Tüm proje detaylı analiz edildi. Aşağıda mantık hataları, UI/UX sorunları ve gereksiz/tekrarlayan kodlar kategorize edilmiştir.

---

## 🔴 KRİTİK MANTIK HATALARI

### 1. Haritalar Gerçek Harita Değil WebView ile Harita kullanılmalı. OpenStreetMap benzeri ücretsiz harita servisleri ile.

---

### 2. `useEffect` Bağımlılık Eksik — `App.tsx:28`
```tsx
useEffect(() => { ... }, []);
```
**Sorun:** `dispatch` dependency array'de yok. React linting kuralları bunu uyarır. Ayrıca storage'dan okunan `user` değeri `null` olabilir ve `JSON.parse(null)` çalışma zamanı hatası verir.

---

### 3. `App.tsx:5` — Import İsmi Typo
```tsx
import AuthStackNavigatior from './src/navigators/AuthStackNavigator';
```
**Sorun:** `AuthStackNavigatior` yazım hatası. Dosya adı ile uyuşmuyor (`AuthStackNavigator`). Component adı `AuthStackNavigator` olarak export ediliyor ama import `AuthStackNavigatior` olarak yazılmış. TypeScript bunu yakalamaz çünkü default export'tur; ancak kodun okunabilirliğini bozar.

---

### 4. `App.tsx:22` — Dil Dispatch Raw Action Kullanıyor
```tsx
dispatch({ type: 'language/setLanguage', payload: lang });
```
**Sorun:** Diğer dispatch'ler (theme, user) action creator kullanırken dil için raw action dispatch ediliyor. `setLanguage` action creator'ı zaten import edilmiş ancak **kullanılmamış**. Ayrıca `setLanguage` fonksiyonunda `i18n.changeLanguage()` çağrılıyor — raw dispatch bu çağrıyı tetiklemeyecek çünkü reducer'a extraReducer kullanılmıyor.
**Gerçek etki:** Uygulama açıldığında kayıtlı dil yüklense bile `i18n.changeLanguage()` çağrılmıyor, yani i18next'in aktif dili değişmiyor — sadece Redux state güncelleniyor.

---

### 5. `RoutesScreen.tsx:253` — useMemo İçinde `today` Referans Bağımlılığı
```tsx
const today = new Date();
const weekDays = useMemo(() => buildWeekDays(today), []);
```
**Sorun:** `today` her renderda yeni referans oluşturur ama dependency array boş `[]`. `today` değişkeninin memo'ya dahil edilmemesi mantıksal bir problem. Eğer component yeniden render olursa hafta günleri hiçbir zaman güncellenmez (gün geçtiğinde bile).

---

### 6. `ExploreScreen.tsx:486` — Varsayılan Filtre "museums" Ama "All" Değil
```tsx
const [activeFilter, setActiveFilter] = useState('museums');
```
**Sorun:** Uygulama açıldığında Explore ekranında varsayılan filtre `museums`. Ancak hiçbir allResults item'ının kategorisi `museums` değil (veriler: `Historic`, `Nature`, `Nightlife`, `Shopping`). Bu yüzden filtreleme **hiçbir sonuç bulamaz** ve fallback olarak tüm sonuçları gösterir — bu da filtrenin seçili görünüp ama aslında çalışmaması demektir. Kullanıcıyı yanıltır.

---

### 7. `ExploreScreen.tsx:496-503` — Filtre Fallback Mantığı Yanlış
```tsx
const filteredResults =
  activeFilter === 'all'
    ? results
    : results.filter(r => r.category.toLowerCase() === activeFilter.toLowerCase());

const displayResults = filteredResults.length > 0 ? filteredResults : results;
```
**Sorun:** Filtre sonuç bulamazsa **tüm sonuçlar** gösteriliyor. Bu, kullanıcının aktif bir filtre seçtiğini düşünmesine rağmen hiç filtreleme yapılmadığı anlamına gelir. Filtre bulamazsa boş durum ("No results") gösterilmeli.

---

### 8. `ExploreScreen.tsx:599,632` — Sahte Sayı Çarpanı
```tsx
{displayResults.length * 20} places on map
{displayResults.length * 20} places found
```
**Sorun:** Sonuç sayısı `* 20` ile çarpılarak sahte bir büyük sayı gösteriliyor. Kullanıcıya yanlış bilgi veriyor — 6 sonuç varken "120 places found" yazıyor.

---

### 9. `ExploreScreen.tsx:490-494` — Bookmark State Sadece Lokal
```tsx
const handleToggleLike = (id: string) => {
  setResults(prev => prev.map(r => (r.id === id ? { ...r, isLiked: !r.isLiked } : r)));
};
```
**Sorun:** Like/bookmark durumu yalnızca yerel component state'inde tutuluyor. Sayfa değiştirilip geri gelindiğinde veya uygulama yeniden açıldığında tüm like'lar sıfırlanır. Redux veya storage ile persist edilmeli.

---

### 10. `ExploreScreen.tsx:536` — Arama Çubuğu İşlevsiz
`searchText` state'i var ama hiçbir yerde filtreleme için kullanılmıyor. Kullanıcı arama yaptığında hiçbir şey olmuyor.

---

### 11. `ProfileScreen.tsx:276` — Hardcoded Türkçe
```tsx
<Text style={styles.displayRole}>Gezgin</Text>
```
**Sorun:** Uygulama i18n destekliyor ama profil rolü "Gezgin" olarak hardcoded. İngilizce modda da Türkçe görünüyor.

---

### 12. `ProfileScreen.tsx:242` — Kullanıcı Yoksa Sahte İsim
```tsx
const displayName = user ? `${user.name} ${user.surname ?? ''}`.trim() : 'Alex Johnson';
```
**Sorun:** Login olmamış kullanıcıda "Alex Johnson" ismi var ama login olmamış kullanıcı bu ekranı görmemeli (navigasyon hatası #1 ile bağlantılı). Ayrıca istatistikler ('12', '45', '8') da hardcoded.

---

### 13. `ProfileScreen.tsx:441-447` — Logout Storage Temizliyor Ama Theme/Language Temizlemiyor
`clearUser` action'ı sadece `user` ve `token` siliyor. `lang` ve `theme` storage'da kalıyor. Bu beklenen davranış olabilir ama `location` state'i de sıfırlanmıyor.

---

### 14. `BelenScreen.tsx:482-493` — User ve Assistant Aynı ID'ye Sahip Olabilir
```tsx
const userMsg: Message = { id: `u${Date.now()}`, ... };
const assistantMsg: Message = { id: `a${Date.now()}`, ... };
```
**Sorun:** `Date.now()` milisaniye hassasiyetinde. Her iki mesaj aynı `Date.now()` değerini alabilir. Prefix (`u` vs `a`) farklı olduğu için key çakışması olmaz ama mantıksal olarak zayıf. Daha güvenli UUID kullanılmalı.

---

## 🟡 UI / UX SORUNLARI

### 15. `HomeScreen.tsx` — Empty State Callbacks
```tsx
onViewRoute={() => {}}
onSave={() => {}}
onPress={() => {}}
onPressSeeAll={() => {}}
```
**Sorun:** Neredeyse tüm butonlar/kartlar boş callback'ler. Kullanıcı tıkladığında hiçbir şey olmuyor — UX açısından kötü. En azından navigasyon veya bir toast mesajı olmalı.

---

### 16. `HomeScreen.tsx:42-45` — Hava Durumu Hardcoded
```tsx
const WEATHER = { temp: 21, icon: 'solar:sun-bold-duotone' };
```
Her zaman 21°C ve güneşli. Gerçek veri veya en azından dinamik bir yapı olmalı.

---

### 17. `HomeScreen.tsx:177` — Bildirim Badge Her Zaman Görünür
```tsx
<View style={styles.badge} />
```
Bildirim badge'i her zaman render ediliyor, bildirim var/yok kontrolü yapılmıyor.

---

### 18. `HomeScreen.tsx:208` — Section Header'lar Hardcoded İngilizce
```tsx
<SectionHeader title="Nearby Gems" onPressSeeAll={() => {}} />
<SectionHeader title="Ongoing Journey" showSeeAll={false} />
<SectionHeader title="Trending Today" onPressSeeAll={() => {}} />
```
i18n sistemi var ama bu başlıklar çeviri anahtarı kullanmıyor.

---

### 19. `HomeScreen.tsx:284` — Kullanılmayan `fill` Style
```tsx
fill: { width: '100%', height: '100%' },
```
Bu style tanımlı ama hiçbir yerde kullanılmıyor.

---

### 20. `ExploreScreen.tsx` — Zoom Kontrolleri İşlevsiz
```tsx
{['+', '−'].map(label => (
  <TouchableOpacity key={label} ... >
```
Zoom butonları görsel olarak var ama hiçbir fonksiyonları yok — ne harita zoom yapıyor ne de herhangi bir state değişiyor.

---

### 21. `ExploreScreen.tsx` — Filter Butonu İşlevsiz
```tsx
<TouchableOpacity style={styles.filterBtn}>
  <Iconify icon="solar:filter-bold-duotone" ... />
</TouchableOpacity>
```
Filtre ikonu var ama `onPress` handler yok.

---

### 22. `ExploreScreen.tsx:519-521` — Explore Header Hardcoded İngilizce
```tsx
<Text style={styles.eyebrow}>DISCOVER</Text>
<Text style={styles.title}>New Adventures</Text>
```
i18n kullanılmıyor.

---

### 23. `RoutesScreen.tsx:271-273` — Routes Header Hardcoded İngilizce
```tsx
<Text style={styles.title}>My Routes</Text>
<Text style={styles.subtitle}>Plan and manage your trips</Text>
```
i18n kullanılmıyor.

---

### 24. `RoutesScreen.tsx:304,348,350` — Section İsimleri Hardcoded
```tsx
"Today's Plan", "Saved Routes", "SEE ALL", "Continue", "Details", "Create New Route"
```
Hepsi İngilizce hardcoded, i18n yok.

---

### 25. `BelenScreen.tsx:511` — Header Başlığı Hardcoded
```tsx
<Text style={styles.headerTitle}>Travel Assistant</Text>
```
i18n kullanılmıyor.

---

### 26. `BelenScreen.tsx:508-510` — Back Butonu İşlevsiz
```tsx
<TouchableOpacity style={styles.headerIconBtn} hitSlop={8}>
  <Iconify icon="solar:alt-arrow-left-linear" ... />
</TouchableOpacity>
```
`onPress` handler yok. Settings butonu da aynı durumda.

---

### 27. `ProfileScreen.tsx:278-280` — Edit Profile Butonu İşlevsiz
```tsx
<TouchableOpacity style={styles.editProfileBtn}>
  <Text style={styles.editProfileText}>Edit Profile</Text>
</TouchableOpacity>
```
`onPress` handler yok.

---

### 28. `ProfileScreen.tsx:285-297` — İstatistikler Hardcoded
```tsx
{ value: '12', label: 'ROUTES' },
{ value: '45', label: 'PLACES' },
{ value: '8',  label: 'CITIES' },
```
Backend'den gelmesi veya en azından Redux state'inden okunması gereken veriler sabit.

---

### 29. `ProfileScreen.tsx:306-322` — Premium Kart Hardcoded & İşlevsiz
Tüm Premium card içeriği hardcoded İngilizce. "Upgrade to Premium" butonu `onPress` handler'sız.

---

### 30. `ProfileScreen.tsx:337-361` — Birçok Ayar Butonu İşlevsiz
Currency, Notifications, Location Access, Interests, Budget Level, Travel Style, Help Center, Privacy Policy, Terms of Service — hepsi `onPress={() => {}}`.

---

### 31. `HomeScreen.tsx` — Dark Mode'da Compact Header Beyaz
```tsx
backgroundColor: colors.white,
```
Dark modda `colors.white` aslında `#1E293B` oluyor (doğru), ama `HomeScreen:296` satırındaki compact header örtüşen `colors.white` kullanımı dark modda garip görünebilir.

---

### 32. `data/home.json` — İstanbul Uygulaması Ama Tokyo Verileri
```json
"nearbyGems": [
  { "name": "Senso-ji Temple", ... },
  { "name": "Shibuya Crossing", ... },
  { "name": "Tokyo Tower", ... },
  { "name": "Meiji Shrine", ... }
]
```
**Sorun:** Hero card "Istanbul" diyor, `Ongoing Journey` "Asakusa Discovery" diyor ama yakındaki yerler hep Tokyo'dan. İstanbul ve Tokyo verileri karışık.

---

### 33. Auth Ekranları Dark Mode Desteklemiyor
`LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen` — hepsi `Colors.ts` import ederek (sadece light renkleri olan) sabit renkler kullanıyor, `useColors()` hook'unu kullanmıyor. Dark modda okunamaz hale gelir.

---

### 34. `BelenScreen.tsx:498-499` — KeyboardAvoidingView Offset
```tsx
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
keyboardVerticalOffset={hScale(0)}
```
**Sorun:** `keyboardVerticalOffset` `0` kullanılıyor. Bottom tab bar varken iOS'ta klavye input'un üstünü kapatabilir. Tab bar yüksekliği kadar offset verilmeli.

---

### 35. `ExploreScreen` — `ResultItem` Component İsim Çakışması
```tsx
// Line 37: interface ResultItem { ... }
// Line 382: const ResultItem: React.FC<{ ... }> = ...
```
**Sorun:** `ResultItem` hem interface hem component olarak aynı isimle tanımlanmış. TypeScript'te bu an için çalışıyor olsa da kafa karıştırıcıdır ve potansiyel hatalara yol açar.

---

## 🟠 GEREKSİZ / TEKRAR EDEN KOD

### 36. `Colors.ts` Dosyası Tamamen Gereksiz
`src/styles/Colors.ts` ile `src/styles/theme.ts`'deki `lightColors` aynı değerleri içeriyor. `Colors.ts` yalnızca auth ekranlarında import ediliyor. Theme sistemi (`useColors` hook'u) zaten `theme.ts`'i kullanıyor. **`Colors.ts` silinip auth ekranları `useColors()` kullanmalı.**

---

### 37. `Scaler.ts` — `PixelRatio` Import Edilmiş Ama Kullanılmıyor
```tsx
import { Dimensions, PixelRatio } from 'react-native';
```
`PixelRatio` hiçbir yerde kullanılmıyor.

---

### 38. `UserSlice.ts:16-17` — `location` ve `locationName` Kullanılmıyor
```tsx
location: { latitude: number | null, longitude: number | null };
locationName?: string;
```
State'te tanımlı ama hiçbir reducer bu değerleri set etmiyor (setter action yok). `HomeScreen` `locationName`'i okuyor ama her zaman boş string `''` kalıyor — fallback "İstanbul" gösteriyor.

---

### 39. `formats.ts` — Hiçbir Yerde İmport Edilmiyor
`formatDate`, `fmtKm`, `fmtMin`, `formatCount` fonksiyonları hiçbir ekranda/compontentte kullanılmıyor. Ayrıca `fmtMin` fonksiyonu hardcoded Türkçe ("dk", "sa") kullanıyor — i18n ile tutarsız.

---

### 40. `validators.ts` — Hiçbir Yerde İmport Edilmiyor
`checkEmail` fonksiyonu hiçbir yerde kullanılmıyor. Login/Register ekranlarında email doğrulama yapılmıyor.

---

### 41. `index.js:8` — Kullanılmayan Import
```tsx
import App from './App';
```
`App` import edilmiş ama `AppRegistry`'de `ReduxProvider` kullanılıyor. `App` import'u gereksiz.

---

### 42. `HomeScreen.tsx:8,11` — Kullanılmayan Import'lar
```tsx
import { TouchableOpacity, Image, ... } from 'react-native';
```
- `Image` hiçbir yerde kullanılmıyor (resimler component'ler içinde).
- `useState` kullanılıyor ama `LayoutChangeEvent` re-export yoluyla zaten mevcut.

---

### 43. `ProfileScreen.tsx` — i18n Anahtarları Tanımlı Ama Kullanılmıyor
`en.json` ve `tr.json`'da `profile.title`, `profile.settings`, `profile.language` gibi çeviri anahtarları var ama `ProfileScreen` içinde hardcoded "Profile", "Edit Profile", "Account Settings", "Language", "Currency" gibi İngilizce metinler kullanılıyor.

---

### 44. `BelenScreen.tsx:45-77,80-114` — INITIAL_MESSAGES ve MOCK_REPLIES Büyük Hardcoded Veri
Chat ekranı tamamen mock veri ile çalışıyor, herhangi bir API entegrasyonu yok. Bu mock veriler büyük yer kaplıyor ve production'da olmamalı.

---

### 45. `RoutesScreen.tsx:282-299` — Date Strip Aynı Gün Numarasında Çakışma Olabilir
`dayNum` key olarak kullanılıyor. Eğer ay sonu/başı gibi bir durumda aynı `dayNum` (ör: 1) iki kez görünürse key çakışması olur. Ancak haftalık gösterimde bu pratikte olmaz — yine de daha güvenli bir key (ör: ISO date string) tercih edilmeli.

---

### 46. `ExploreScreen.tsx:60-287` — ExploreMapView Çok Büyük İnline Component
`ExploreMapView` 227 satırlık büyük bir component ama `ExploreScreen.tsx` içinde inline tanümlı. Ayrı bir dosyaya çıkarılmalı.

---

### 47. `RoutesScreen.tsx:45-145` — MapPlaceholder Aynı Dosyada
`MapPlaceholder` component'i ve `mapStyles` ayrı bir componente çıkarılmalı.

---

### 48. `theme.ts:3` — `secondary` Renk Kullanımı Sınırlı
`secondary: '#334155'` (light) sadece `BelenScreen`'deki user avatar'da kullanılıyor. Çok sınırlı kullanım — gerekli mi değerlendirilmeli.

---

## 🔵 DİĞER NOTLAR

### 49. TypeScript Strict Mode Kullanılmıyor
`tsconfig.json` çok minimal. `strict: true` yok — birçok tip hatası yakalanmıyor.

### 50. `storage/index.tsx` — `.tsx` Uzantısı Yanlış
Storage dosyası JSX içermiyor, `.ts` uzantısı olmalı.

### 51. `i18n` İçinde `time.*` Anahtarları Eksik
`formats.ts` `i18n.t('time.just_now')`, `i18n.t('time.minutes')` gibi anahtarlar kullanıyor ama `en.json` ve `tr.json`'da bu anahtarlar tanımlı değil. Fonksiyonlar çağrılsa çeviri bulunamaz.

### 52. Proje İsmi Tutarsızlığı
- `package.json`: `"name": "toronto"`
- `ProfileScreen`: `"Toronto 1.0.0 (2025)"`
- `data/home.json`: Hero başlığı `"Istanbul"`
- `BelenScreen`: İstanbul rotaları
- Veriler: Tokyo landmark'ları

Projenin gerçek konusu/amacı belirsiz.
