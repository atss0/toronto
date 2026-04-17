# 📱 Eksik Ekranlar Listesi — Toronto

> Mevcut kod, navigasyon referansları, boş `onPress` handler'lar ve bir seyahat uygulaması için gerekli olan akışlar analiz edilerek hazırlanmıştır.

---

## ✅ Mevcut Ekranlar (8 adet)

| Ekran | Dosya | Durum |
|-------|-------|-------|
| Home | `screens/HomeScreen.tsx` | ✅ Var |
| Explore | `screens/ExploreScreen.tsx` | ✅ Var |
| Belen (AI Chat) | `screens/BelenScreen.tsx` | ✅ Var |
| Routes | `screens/RoutesScreen.tsx` | ✅ Var |
| Profile | `screens/ProfileScreen.tsx` | ✅ Var |
| Login | `screens/auth/LoginScreen.tsx` | ✅ Var |
| Register | `screens/auth/RegisterScreen.tsx` | ✅ Var |
| Forgot Password | `screens/auth/ForgotPasswordScreen.tsx` | ✅ Var |

---

## ❌ Eksik Ekranlar

### 🔴 Kritik — Mevcut Butonlardan Referans Edilen Ama Olmayan Sayfalar

#### 1. `PlaceDetailScreen`
- **Neden gerekli:** HomeScreen'deki GemCard, TrendingCard ve ExploreScreen'deki ResultItem tıklamaları hep `onPress={() => {}}`. Bir mekan detay sayfası şart.
- **İçermesi gerekenler:** Mekan görselleri, açıklama, rating, yorumlar, konum (harita), çalışma saatleri, fiyat bilgisi, "Rotaya Ekle" butonu.

#### 2. `RouteDetailScreen`
- **Neden gerekli:** RoutesScreen'deki "Details" butonu, SavedRouteRow tıklamaları ve OngoingJourneyCard hep boş `onPress`. Ayrıca BelenScreen'deki "Start Navigation" butonu da bir rota detay/navigasyon sayfasına yönlenmeli.
- **İçermesi gerekenler:** Rotanın harita üzerindeki görünümü, tüm duraklar listesi, süre/mesafe bilgileri, ilerleme durumu, navigasyon başlatma.

#### 3. `NotificationsScreen`
- **Neden gerekli:** HomeScreen'de bildirim bell ikonu var (hem full header hem compact header'da), badge her zaman görünüyor ama tıklama `onPress` yok.
- **İçermesi gerekenler:** Bildirim listesi, okundu/okunmadı durumu, bildirim tipleri (rota hatırlatma, yeni öneriler vb.).

#### 4. `EditProfileScreen`
- **Neden gerekli:** ProfileScreen'de "Edit Profile" butonu var ama `onPress` handler yok.
- **İçermesi gerekenler:** İsim, soyisim, email, fotoğraf değiştirme, şifre güncelleme.

#### 5. `NotificationSettingsScreen`
- **Neden gerekli:** ProfileScreen → Account Settings → "Notifications" satırı `onPress={() => {}}`.
- **İçermesi gerekenler:** Push bildirim açma/kapama, bildirim tipleri (rota, öneri, promosyon vb.).

#### 6. `LocationSettingsScreen`
- **Neden gerekli:** ProfileScreen → "Location Access" satırı `onPress={() => {}}`.
- **İçermesi gerekenler:** Konum izni durumu, konum servisi açma/kapama, varsayılan şehir seçimi.

#### 7. `InterestsScreen`
- **Neden gerekli:** ProfileScreen → Travel Preferences → "Interests" satırı `onPress={() => {}}`, value="Nature, Food" hardcoded.
- **İçermesi gerekenler:** İlgi alanları listesi (Nature, Food, History, Art, Shopping vb.), çoklu seçim.

#### 8. `BudgetSettingsScreen`
- **Neden gerekli:** ProfileScreen → "Budget Level" satırı `onPress={() => {}}`, value="Mid-range" hardcoded.
- **İçermesi gerekenler:** Bütçe seviyesi seçimi (Budget, Mid-range, Luxury).

#### 9. `TravelStyleScreen`
- **Neden gerekli:** ProfileScreen → "Travel Style" satırı `onPress={() => {}}`, value="Solo" hardcoded.
- **İçermesi gerekenler:** Seyahat tarzı seçimi (Solo, Couple, Family, Group).

#### 10. `CurrencySettingsScreen`
- **Neden gerekli:** ProfileScreen → "Currency" satırı `onPress={() => {}}`, value="USD" hardcoded.
- **İçermesi gerekenler:** Para birimi seçimi (USD, EUR, TRY vb.).

#### 11. `HelpCenterScreen`
- **Neden gerekli:** ProfileScreen → Support → "Help Center" satırı `onPress={() => {}}`.
- **İçermesi gerekenler:** SSS, destek talebi oluşturma, iletişim bilgileri.

#### 12. `PrivacyPolicyScreen`
- **Neden gerekli:** ProfileScreen → "Privacy Policy" satırı `onPress={() => {}}`.
- **İçermesi gerekenler:** Gizlilik politikası metni (WebView veya statik metin).

#### 13. `TermsOfServiceScreen`
- **Neden gerekli:** ProfileScreen → "Terms of Service" satırı `onPress={() => {}}`.
- **İçermesi gerekenler:** Kullanım koşulları metni (WebView veya statik metin).

#### 14. `CreateRouteScreen`
- **Neden gerekli:** RoutesScreen'de "Create New Route" butonu var ama `onPress` handler yok.
- **İçermesi gerekenler:** Başlangıç/bitiş noktası, durak ekleme, harita üzerinde rota çizimi, süre/mesafe hesaplama.

#### 15. `SeeAllScreen` (Genel Liste Sayfası)
- **Neden gerekli:** HomeScreen'deki "See All" butonları → Nearby Gems, Trending Today; ExploreScreen'deki "See all" butonu; RoutesScreen'deki "SEE ALL" butonu — hepsi `onPress={() => {}}`.
- **İçermesi gerekenler:** Filtreleme, sıralama, tam liste görünümü. Parametre olarak hangi listenin gösterildiği.

---

### 🟡 Önemli — Uygulama Akışı İçin Gerekli Ama Henüz Referans Edilmeyen Sayfalar

#### 16. `OnboardingScreen`
- **Neden gerekli:** Yeni kullanıcılar için ilk açılış deneyimi. Uygulamanın ne yaptığını anlatan 3-4 slide. Şu an uygulama açıldığında direkt ana ekrana düşüyor.

#### 17. `SplashScreen`
- **Neden gerekli:** Uygulama açılırken storage'dan kullanıcı verisi okunuyor (`App.tsx:15-27`). Bu sürede bir splash screen gösterilmeli — şu an beyaz ekran görünür.

#### 18. `SearchResultsScreen`
- **Neden gerekli:** ExploreScreen'de arama çubuğu var ama arama sonuçları için ayrı sayfa yok. `searchText` state'i var ama hiçbir yerde kullanılmıyor.

#### 19. `MapFullScreen`
- **Neden gerekli:** ExploreScreen'de sahte harita placeholder'ı var, RoutesScreen'de mini harita var. Tam ekran gerçek harita görünümü (OpenStreetMap/WebView) gerekli.

#### 20. `NavigationScreen`
- **Neden gerekli:** BelenScreen'deki "Start Navigation" butonu ve RoutesScreen'deki "Continue" butonu aktif navigasyon (turn-by-turn) sayfasına yönlenmeli.

#### 21. `BookmarksSavedScreen`
- **Neden gerekli:** ExploreScreen'de bookmark (like) butonu var ama kaydedilen mekanları görüntüleyecek bir sayfa yok.

#### 22. `ReviewsScreen`
- **Neden gerekli:** Mekanların rating ve reviewCount bilgileri gösteriliyor ama yorumları görüntüleyecek/yazacak bir sayfa yok.

#### 23. `FilterScreen` (veya BottomSheet)
- **Neden gerekli:** ExploreScreen'de filtre ikonu butonu var ama `onPress` handler yok. Detaylı filtreleme (fiyat aralığı, mesafe, rating, kategori) için bir sayfa/sheet gerekli.

#### 24. `PremiumUpgradeScreen`
- **Neden gerekli:** ProfileScreen'de "Upgrade to Premium" butonu var ama `onPress` handler yok. Ödeme planları, özellik karşılaştırma.

#### 25. `ChatSettingsScreen`
- **Neden gerekli:** BelenScreen header'ında settings ikonu var ama `onPress` handler yok. AI asistan tercihleri, geçmiş konuşmalar.

---

### 🔵 İsteğe Bağlı — Gelecek İçin Düşünülebilir

| # | Ekran | Açıklama |
|---|-------|----------|
| 26 | `ResetPasswordScreen` | ForgotPassword sonrası yeni şifre belirleme (deep link ile) |
| 27 | `EmailVerificationScreen` | Kayıt sonrası email doğrulama |
| 28 | `ChangePasswordScreen` | Profil içinden şifre değiştirme |
| 29 | `OfflineRoutesScreen` | Premium özellik — çevrimdışı rotalar |
| 30 | `TripHistoryScreen` | Geçmiş seyahatler |
| 31 | `ShareRouteScreen` | Rota paylaşma |
| 32 | `WeatherDetailScreen` | Hava durumu detay (HomeScreen'de hardcoded 21°C var) |
| 33 | `CityPickerScreen` | Şehir seçimi (HomeScreen'de lokasyon chip'i var ama tıklama yok) |

---

## 📊 Özet

| Kategori | Sayı |
|----------|------|
| ✅ Mevcut Ekranlar | 8 |
| ❌ Kritik Eksik (butondan referanslı) | 15 |
| 🟡 Önemli Eksik (akış için gerekli) | 10 |
| 🔵 İsteğe Bağlı | 8 |
| **Toplam Gereken (kritik + önemli)** | **25** |
