# 📋 Manuel Test Dokümanı — Toronto Mobil Uygulaması

> **Son güncelleme:** 2026-04-27  
> **Toplam Test Senaryosu:** 200+  
> **Kapsanan Ekran Sayısı:** 41 ekran  

---

## 📊 İşaretleme Rehberi

Her test senaryosu için aşağıdaki işaretleri kullanın:

| İşaret | Anlam |
|--------|-------|
| `[ ]` | Henüz test edilmedi |
| `[✅]` | Çalışıyor — Başarılı |
| `[❌]` | Çalışmıyor — Hata var |
| `[⚠️]` | Kısmen çalışıyor — Sorun/iyileştirme var |
| `[⏭️]` | Atlandı — Test edilemedi |

**Hata notu ekleme:** `[❌]` veya `[⚠️]` işaretledikten sonra satırın altına `> 📝 Not: ...` olarak açıklama ekleyebilirsiniz.

---

## 📑 İçindekiler

1. [Uygulama Başlatma & Splash](#1-uygulama-başlatma--splash)
2. [Onboarding](#2-onboarding)
3. [Kimlik Doğrulama (Auth)](#3-kimlik-doğrulama-auth)
4. [Ana Sayfa (Home)](#4-ana-sayfa-home)
5. [Keşfet (Explore)](#5-keşfet-explore)
6. [Belen AI Asistan](#6-belen-ai-asistan)
7. [Rotalar (Routes)](#7-rotalar-routes)
8. [Profil](#8-profil)
9. [Mekan Detay (Place Detail)](#9-mekan-detay-place-detail)
10. [Rota Detay (Route Detail)](#10-rota-detay-route-detail)
11. [Arama & Filtreleme](#11-arama--filtreleme)
12. [Harita](#12-harita)
13. [Bildirimler](#13-bildirimler)
14. [Yer İmleri / Kaydedilenler](#14-yer-i̇mleri--kaydedilenler)
15. [Değerlendirmeler (Reviews)](#15-değerlendirmeler-reviews)
16. [Rota Yönetimi](#16-rota-yönetimi)
17. [Profil Düzenleme & Güvenlik](#17-profil-düzenleme--güvenlik)
18. [Ayarlar](#18-ayarlar)
19. [Premium](#19-premium)
20. [Tema & Dil](#20-tema--dil)
21. [Deep Linking](#21-deep-linking)
22. [Performans & UX](#22-performans--ux)
23. [Erişilebilirlik (Accessibility)](#23-erişilebilirlik-accessibility)
24. [Edge Cases & Hata Durumları](#24-edge-cases--hata-durumları)

---

## 1. Uygulama Başlatma & Splash

### 1.1 Splash Screen
- [ ] **TC-001:** Uygulama ilk açıldığında SplashScreen gösteriliyor
- [ ] **TC-002:** Token ve kullanıcı bilgileri yüklenirken SplashScreen görünmeye devam ediyor
- [ ] **TC-003:** Yükleme tamamlandıktan sonra SplashScreen kaybolup ilgili ekrana geçiyor
- [ ] **TC-004:** SplashScreen'de herhangi bir kilitlenme (crash) olmuyor

### 1.2 İlk Açılış (Fresh Install)
- [ ] **TC-005:** Uygulamayı temiz kurulum sonrası ilk kez açtığımda Onboarding ekranı gösteriliyor
- [ ] **TC-006:** `onboardingComplete` kaydı yokken doğru olarak Onboarding'e yönlendiriliyor
- [ ] **TC-007:** Token yokken AuthStackNavigator gösteriliyor (Login/Onboarding)

### 1.3 Daha Önce Giriş Yapılmış (Returning User)
- [ ] **TC-008:** Daha önce giriş yapılmışsa ve token geçerliyse doğrudan ana sayfaya yönlendiriliyor
- [ ] **TC-009:** Token varsa `userService.getMe()` ile profil bilgileri arka planda güncelleniyor
- [ ] **TC-010:** Kayıtlı dil tercihi (`lang`) uygulama açılışında yükleniyor
- [ ] **TC-011:** Kayıtlı tema tercihi (`theme`) uygulama açılışında yükleniyor

---

## 2. Onboarding

### 2.1 Slide Navigasyonu
- [ ] **TC-012:** Onboarding ekranı 4 slide ile açılıyor
- [ ] **TC-013:** Sola kaydırarak sonraki slide'a geçilebiliyor
- [ ] **TC-014:** Sağa kaydırarak önceki slide'a dönülebiliyor
- [ ] **TC-015:** Alt kısımdaki nokta göstergeleri (dots) aktif slide'ı doğru gösteriyor
- [ ] **TC-016:** "Next" butonuna basarak sonraki slide'a geçilebiliyor
- [ ] **TC-017:** Her slide'da başlık, alt başlık ve ikon doğru gösteriliyor
- [ ] **TC-018:** Slide ikonları ve renkler doğru uygulanıyor

### 2.2 Skip İşlevi
- [ ] **TC-019:** "Skip" butonuna basıldığında doğrudan Login ekranına yönlendiriliyor
- [ ] **TC-020:** Skip sonrası `onboardingComplete` storage'a kaydediliyor
- [ ] **TC-021:** Skip yapıldığında varsayılan şehir olarak "Paris" atanıyor

### 2.3 Şehir Seçim Adımı
- [ ] **TC-022:** Son slide'dan sonra şehir seçim ekranı gösteriliyor
- [ ] **TC-023:** Popüler şehirler (Paris, London, Tokyo, vb.) chip olarak listeleniyor
- [ ] **TC-024:** Bir şehre tıklandığında seçili olarak işaretleniyor (mavi arka plan)
- [ ] **TC-025:** Seçili şehir değiştirildiğinde önceki seçim kalkıyor
- [ ] **TC-026:** Hiçbir şehir seçilmeden "Get Started" basılırsa Paris varsayılıyor
- [ ] **TC-027:** "Get Started" butonuna basıldığında Login ekranına yönlendiriliyor

---

## 3. Kimlik Doğrulama (Auth)

### 3.1 Giriş Yapma (Login)
- [ ] **TC-028:** Login ekranı açılıyor — başlık ve alt başlık doğru
- [ ] **TC-029:** E-posta alanına metin girilebiliyor
- [ ] **TC-030:** E-posta keyboard tipi otomatik olarak `email-address` 
- [ ] **TC-031:** E-posta alanı `autoCapitalize="none"` — büyük harf zorlaması yok
- [ ] **TC-032:** Şifre alanına metin girilebiliyor
- [ ] **TC-033:** Şifre alanı maskelenmiş görünüyor (yıldızlar/noktalar)
- [ ] **TC-034:** E-posta veya şifre boşken "Login" butonu devre dışı (disabled)
- [ ] **TC-035:** Her iki alan doldurulduğunda "Login" butonu aktif oluyor
- [ ] **TC-036:** Geçerli bilgilerle giriş yapıldığında ana sayfaya yönlendiriliyor
- [ ] **TC-037:** Giriş sırasında loading spinner gösteriliyor
- [ ] **TC-038:** Yanlış şifre girildiğinde hata mesajı gösteriliyor
- [ ] **TC-039:** Kayıtlı olmayan e-posta girildiğinde hata mesajı gösteriliyor
- [ ] **TC-040:** `EMAIL_NOT_VERIFIED` hatası alındığında EmailVerification ekranına yönlendiriliyor
- [ ] **TC-041:** Token ve refresh token başarılı giriş sonrası storage'a kaydediliyor
- [ ] **TC-042:** "Forgot Password?" linkine tıklandığında ForgotPassword ekranına gidiliyor
- [ ] **TC-043:** "Sign Up" linkine tıklandığında Register ekranına gidiliyor

### 3.2 Sosyal Giriş
- [ ] **TC-044:** SocialLogins bileşeni gösteriliyor (Google, Apple)
- [ ] **TC-045:** Google ile giriş butonuna tıklandığında Google Sign-In akışı başlıyor
- [ ] **TC-046:** Google ile başarılı giriş sonrası ana sayfaya yönlendiriliyor
- [ ] **TC-047:** Apple ile giriş butonu (iOS'ta) gösteriliyor
- [ ] **TC-048:** AuthDivider ("or continue with") doğru gösteriliyor

### 3.3 Kayıt Olma (Register)
- [ ] **TC-049:** Register ekranı açılıyor — başlık ve alt başlık doğru
- [ ] **TC-050:** Ad (First Name) alanına metin girilebiliyor
- [ ] **TC-051:** Soyad (Last Name) alanına metin girilebiliyor
- [ ] **TC-052:** Ad ve Soyad alanları yan yana düzgün görünüyor
- [ ] **TC-053:** Kullanıcı adı (Username) alanına metin girilebiliyor — autoCapitalize yok
- [ ] **TC-054:** E-posta alanına metin girilebiliyor — email keyboard tipi
- [ ] **TC-055:** Şifre alanı maskelenmiş, metin girilebiliyor
- [ ] **TC-056:** Şifre onay alanı maskelenmiş, metin girilebiliyor
- [ ] **TC-057:** Tüm alanlar doldurulmadan "Register" butonu devre dışı
- [ ] **TC-058:** Şifre ve onay şifresi uyuşmadığında hata mesajı gösteriliyor
- [ ] **TC-059:** Geçerli bilgilerle kayıt sonrası EmailVerification ekranına yönlendiriliyor
- [ ] **TC-060:** Kayıt sırasında loading spinner gösteriliyor
- [ ] **TC-061:** Aynı e-posta ile kayıt olunmaya çalışıldığında hata mesajı gösteriliyor
- [ ] **TC-062:** "Log In" linkine tıklandığında Login ekranına dönülüyor
- [ ] **TC-063:** Sosyal giriş butonları Register ekranında da gösteriliyor

### 3.4 Şifremi Unuttum (Forgot Password)
- [ ] **TC-064:** ForgotPassword ekranı açılıyor — ikon, başlık, alt başlık doğru
- [ ] **TC-065:** Geri butonu çalışıyor — önceki ekrana dönüyor
- [ ] **TC-066:** E-posta alanı sol ikon ile birlikte gösteriliyor
- [ ] **TC-067:** E-posta boşken "Send Reset Link" butonu devre dışı
- [ ] **TC-068:** Geçerli e-posta girip gönderildiğinde ResetPassword ekranına yönlendiriliyor
- [ ] **TC-069:** API hatası durumunda Alert ile hata mesajı gösteriliyor
- [ ] **TC-070:** Loading spinner gönderim sırasında gösteriliyor

### 3.5 Şifre Sıfırlama (Reset Password)
- [ ] **TC-071:** ResetPassword ekranı açılıyor
- [ ] **TC-072:** Kod (OTP/PIN) giriş alanı gösteriliyor
- [ ] **TC-073:** Yeni şifre ve onay şifresi alanları gösteriliyor
- [ ] **TC-074:** Doğru kod ve şifre ile sıfırlama başarılı oluyor
- [ ] **TC-075:** Yanlış kod girildiğinde hata mesajı gösteriliyor
- [ ] **TC-076:** Başarılı sıfırlama sonrası Login ekranına yönlendiriliyor

### 3.6 E-posta Doğrulama (Email Verification)
- [ ] **TC-077:** EmailVerification ekranı açılıyor — e-posta adresi parametre olarak gösteriliyor
- [ ] **TC-078:** Doğrulama kodu giriş alanı gösteriliyor
- [ ] **TC-079:** "Resend Code" butonu çalışıyor — yeni kod gönderiyor
- [ ] **TC-080:** Doğru kod girildiğinde başarılı doğrulama olup giriş yapılıyor
- [ ] **TC-081:** Yanlış kod girildiğinde hata mesajı gösteriliyor

### 3.7 Çıkış (Logout)
- [ ] **TC-082:** Profil ekranından "Logout" butonuna basıldığında çıkış yapılıyor
- [ ] **TC-083:** Çıkış sonrası token storage'dan temizleniyor
- [ ] **TC-084:** Çıkış sonrası Redux state sıfırlanıyor
- [ ] **TC-085:** Çıkış sonrası Login ekranına yönlendiriliyor
- [ ] **TC-086:** Backend'e logout isteği gönderiliyor (refresh token ile)

---

## 4. Ana Sayfa (Home)

### 4.1 Header & Selamlama
- [ ] **TC-087:** Header'da şehir adı gösteriliyor (location chip)
- [ ] **TC-088:** Şehir chip'ine tıklandığında CityPicker ekranına yönlendiriliyor
- [ ] **TC-089:** Sabah/öğleden sonra/akşam selamlama mesajı saate göre doğru gösteriliyor
- [ ] **TC-090:** Kullanıcı adı selamlama metninde doğru gösteriliyor
- [ ] **TC-091:** Alt başlık (subtitle) metni doğru gösteriliyor
- [ ] **TC-092:** Hava durumu chip'inde sıcaklık gösteriliyor
- [ ] **TC-093:** Hava durumu chip'ine tıklandığında WeatherDetail ekranına yönlendiriliyor
- [ ] **TC-094:** Bildirim zili ikonuna tıklandığında Notifications ekranına gidiliyor

### 4.2 Sticky Header (Scroll)
- [ ] **TC-095:** Aşağı kaydırıldığında compact sticky header beliriyor
- [ ] **TC-096:** Compact header'da şehir adı, selamlama ve kullanıcı adı gösteriliyor
- [ ] **TC-097:** Compact header'da hava durumu ve bildirim ikonu gösteriliyor
- [ ] **TC-098:** Yukarı kaydırıldığında compact header gizleniyor — animasyon düzgün
- [ ] **TC-099:** Header geçiş animasyonları (opacity, translateY, slideX) akıcı

### 4.3 Hero Card
- [ ] **TC-100:** Hero kartı görsel ve başlık ile gösteriliyor
- [ ] **TC-101:** Hero kartının alt başlığı doğru gösteriliyor
- [ ] **TC-102:** Hero kartı responsive olarak tam genişlikte gösteriliyor

### 4.4 Quick Actions
- [ ] **TC-103:** 4 adet quick action butonu gösteriliyor (Explore, Saved, Events, Nearby)
- [ ] **TC-104:** "Explore" butonuna tıklandığında Explore sekmesine gidiliyor
- [ ] **TC-105:** "Saved" butonuna tıklandığında BookmarksSaved ekranına gidiliyor
- [ ] **TC-106:** "Events" butonuna tıklandığında Explore ekranına gidiliyor
- [ ] **TC-107:** "Nearby" butonuna tıklandığında Explore ekranına gidiliyor
- [ ] **TC-108:** Her butonun ikon, renk ve etiketi doğru

### 4.5 Nearby Gems Bölümü
- [ ] **TC-109:** "Nearby Gems" bölüm başlığı gösteriliyor
- [ ] **TC-110:** "See All" linkine tıklandığında SeeAll ekranına gidiliyor
- [ ] **TC-111:** Yatay kaydırılabilir liste ile yakın mekanlar gösteriliyor
- [ ] **TC-112:** API'den veri yüklenirken skeleton kartlar gösteriliyor
- [ ] **TC-113:** Bir mekan kartına tıklandığında PlaceDetail ekranına gidiliyor
- [ ] **TC-114:** Mekan kartında isim, kategori, mesafe ve puan gösteriliyor
- [ ] **TC-115:** Konum bilgisi yokken fallback (JSON) verisi gösteriliyor

### 4.6 Ongoing Journey Bölümü
- [ ] **TC-116:** Aktif bir gezi varsa OngoingJourneyCard gösteriliyor
- [ ] **TC-117:** Kartta başlık, açıklama, kalan durak ve ilerleme gösteriliyor
- [ ] **TC-118:** Karta tıklandığında RouteDetail ekranına gidiliyor
- [ ] **TC-119:** Aktif gezi yoksa "Start Journey" kartı gösteriliyor
- [ ] **TC-120:** "Start Journey" kartına tıklandığında CreateRoute ekranına gidiliyor

### 4.7 Trending Today Bölümü
- [ ] **TC-121:** "Trending Today" bölüm başlığı gösteriliyor
- [ ] **TC-122:** "See All" linkine tıklandığında SeeAll ekranına gidiliyor
- [ ] **TC-123:** Yatay kaydırılabilir trending kartlar gösteriliyor
- [ ] **TC-124:** API'den veri yüklenirken skeleton kartlar gösteriliyor
- [ ] **TC-125:** Trending kart tıklandığında PlaceDetail ekranına gidiliyor
- [ ] **TC-126:** Trending kartta isim, kategori, puan, fiyat ve badge gösteriliyor

---

## 5. Keşfet (Explore)

### 5.1 Header & Arama
- [ ] **TC-127:** Explore ekranı başlığı ve eyebrow metni gösteriliyor
- [ ] **TC-128:** Bookmark ikonu gösteriliyor — tıklandığında BookmarksSaved'e gidiliyor
- [ ] **TC-129:** Bildirim zili gösteriliyor — tıklandığında Notifications'a gidiliyor
- [ ] **TC-130:** Arama çubuğu gösteriliyor — placeholder metni doğru
- [ ] **TC-131:** Arama çubuğuna tıklandığında odak (focus) alıyor — ikon rengi değişiyor
- [ ] **TC-132:** Arama metnine yazıldığında temizleme (X) butonu gösteriliyor
- [ ] **TC-133:** X butonuna basıldığında arama metni temizleniyor
- [ ] **TC-134:** Arama modunda "Cancel" butonu gösteriliyor
- [ ] **TC-135:** "Cancel" tıklandığında arama sıfırlanıyor ve odak kaldırılıyor
- [ ] **TC-136:** Filtre butonuna tıklandığında Filter ekranına gidiliyor

### 5.2 Debounce Arama
- [ ] **TC-137:** 2 karakterden az yazılınca arama yapılmıyor
- [ ] **TC-138:** 2+ karakter yazılınca 500ms sonra API araması tetikleniyor (debounce)
- [ ] **TC-139:** Arama sonuçları liste olarak gösteriliyor
- [ ] **TC-140:** Arama sırasında skeleton yükleme gösteriliyor
- [ ] **TC-141:** Boş sonuç durumunda "No Results" empty state gösteriliyor
- [ ] **TC-142:** Sonuç sayısı gösteriliyor

### 5.3 Filtre Chipleri
- [ ] **TC-143:** Yatay kaydırılabilir filtre chipleri gösteriliyor
- [ ] **TC-144:** "All" chip'i varsayılan olarak aktif
- [ ] **TC-145:** Bir chip'e tıklandığında aktif oluyor — önceki deaktif
- [ ] **TC-146:** Filtre değiştirildiğinde sonuçlar güncelleniyor
- [ ] **TC-147:** Her chip'te ikon ve etiket doğru gösteriliyor

### 5.4 Görünüm Değiştirme (List / Map)
- [ ] **TC-148:** List/Map toggle butonları gösteriliyor
- [ ] **TC-149:** "List" görünümünde mekan kartları liste olarak gösteriliyor
- [ ] **TC-150:** "Map" görünümüne geçildiğinde harita gösteriliyor
- [ ] **TC-151:** Haritada pin'ler gösteriliyor
- [ ] **TC-152:** Bir pin'e tıklandığında mekan bilgisi tooltip olarak açılıyor
- [ ] **TC-153:** "Expand Map" butonuna tıklandığında MapFull ekranına gidiliyor
- [ ] **TC-154:** Haritadaki zoom kontrolleri (+/−) gösteriliyor

### 5.5 Trending Near You
- [ ] **TC-155:** Arama modunda olmadığında "Trending Near You" bölümü gösteriliyor
- [ ] **TC-156:** Arama modundayken bu bölüm gizleniyor
- [ ] **TC-157:** "See All" tıklandığında SeeAll ekranına gidiliyor
- [ ] **TC-158:** Trending kartları yatay kaydırılabilir gösteriliyor

### 5.6 Sonuç Listesi
- [ ] **TC-159:** Her sonuç satırında thumbnail, isim, kategori, puan ve konum gösteriliyor
- [ ] **TC-160:** Bookmark ikonu gösteriliyor — tıklandığında toglanıyor
- [ ] **TC-161:** Bookmark toggle optimistic update yapıyor (anında değişiyor)
- [ ] **TC-162:** API hatası durumunda bookmark durumu geri alınıyor (rollback)
- [ ] **TC-163:** Bir sonuca tıklandığında PlaceDetail ekranına gidiliyor

---

## 6. Belen AI Asistan

### 6.1 Ekran Yapısı
- [ ] **TC-164:** Belen ekranı açıldığında header (geri, başlık, ayarlar) gösteriliyor
- [ ] **TC-165:** Geri butonuna tıklandığında önceki ekrana dönülüyor
- [ ] **TC-166:** Ayarlar ikonuna tıklandığında ChatSettings ekranına gidiliyor
- [ ] **TC-167:** Mesaj yokken empty state gösteriliyor (ikon, başlık, alt başlık)
- [ ] **TC-168:** Suggestion chip'leri gösteriliyor (Nearby restaurants, Hidden gems, vb.)
- [ ] **TC-169:** Mesaj giriş alanı ve gönder butonu gösteriliyor

### 6.2 Mesaj Gönderme
- [ ] **TC-170:** Mesaj giriş alanına metin yazılabiliyor
- [ ] **TC-171:** Boş mesajda gönder butonu devre dışı (disabled + renk değişimi)
- [ ] **TC-172:** Mesaj yazıldığında gönder butonu aktif oluyor
- [ ] **TC-173:** Mesaj gönderimine basıldığında kullanıcı balonu sağda gösteriliyor
- [ ] **TC-174:** Gönderim sırasında typing indicator (loading bubble) gösteriliyor
- [ ] **TC-175:** AI yanıtı geldikten sonra typing indicator kalkıp asistan balonu gösteriliyor
- [ ] **TC-176:** Gönderim sırasında giriş alanı disabled oluyor
- [ ] **TC-177:** Mesaj gönderildiğinde giriş alanı temizleniyor
- [ ] **TC-178:** Yeni mesaj geldiğinde ScrollView otomatik aşağı kayıyor

### 6.3 Suggestion Chip'leri
- [ ] **TC-179:** Bir chip'e tıklandığında o metin mesaj olarak gönderiliyor
- [ ] **TC-180:** Gönderim sırasında chip'ler devre dışı oluyor

### 6.4 Route Card
- [ ] **TC-181:** AI rota önerdiğinde route card gösteriliyor
- [ ] **TC-182:** Route card'da başlık, süre, mesafe ve durak sayısı gösteriliyor
- [ ] **TC-183:** Route card'da tüm duraklar sıralı gösteriliyor (dot-line timeline)
- [ ] **TC-184:** "Save Route" butonuna tıklandığında rota kaydediliyor
- [ ] **TC-185:** Kayıt sırasında buton loading durumuna geçiyor
- [ ] **TC-186:** Başarılı kayıt sonrası Alert ile onay mesajı gösteriliyor
- [ ] **TC-187:** Kayıt hatası durumunda Alert ile hata mesajı gösteriliyor

### 6.5 Hata Durumları
- [ ] **TC-188:** API hatası durumunda hata mesajı asistan balonu olarak gösteriliyor
- [ ] **TC-189:** `RATE_LIMIT` hatası aldığında özel mesaj gösteriliyor
- [ ] **TC-190:** `AI_SERVICE_ERROR` hatası aldığında özel mesaj gösteriliyor
- [ ] **TC-191:** Keyboard açıldığında layout düzgün kaydırılıyor (KeyboardAvoidingView)

### 6.6 Context Gönderimi
- [ ] **TC-192:** Şehir bilgisi mesaj context'ine ekleniyor
- [ ] **TC-193:** Kullanıcının travel_style bilgisi context'e ekleniyor
- [ ] **TC-194:** Kullanıcının budget_level bilgisi context'e ekleniyor
- [ ] **TC-195:** Kullanıcının interests listesi context'e ekleniyor
- [ ] **TC-196:** Conversation ID sonraki mesajlarda korunuyor (çoklu tur konuşma)

---

## 7. Rotalar (Routes)

### 7.1 Routes Ekranı
- [ ] **TC-197:** Routes ekranı başlığı ve alt başlığı gösteriliyor
- [ ] **TC-198:** Trip History ikonuna tıklandığında TripHistory ekranına gidiliyor
- [ ] **TC-199:** Offline Routes ikonuna tıklandığında OfflineRoutes ekranına gidiliyor
- [ ] **TC-200:** Loading sırasında ActivityIndicator gösteriliyor

### 7.2 Tarih Şeridi (Date Strip)
- [ ] **TC-201:** Haftanın 7 günü yatay kaydırılabilir olarak gösteriliyor
- [ ] **TC-202:** Bugünün tarihi varsayılan olarak seçili (highlighted)
- [ ] **TC-203:** Bir güne tıklandığında seçili gün değişiyor
- [ ] **TC-204:** Seçili gün renkli (primary) arka plan ile gösteriliyor
- [ ] **TC-205:** Gün etiketi (MON, TUE...) ve gün numarası doğru

### 7.3 Günün Planı (Today's Plan)
- [ ] **TC-206:** Aktif plan varsa harita, rota bilgisi ve butonlar gösteriliyor
- [ ] **TC-207:** "ACTIVE" badge'i harita üzerinde gösteriliyor
- [ ] **TC-208:** Rota adı, kalan durak sayısı ve süre gösteriliyor
- [ ] **TC-209:** "Continue" butonuna tıklandığında RouteDetail ekranına gidiliyor
- [ ] **TC-210:** "Details" butonuna tıklandığında RouteDetail ekranına gidiliyor
- [ ] **TC-211:** Aktif plan yoksa empty state gösteriliyor (dashed border kartı)

### 7.4 Kaydedilmiş Rotalar
- [ ] **TC-212:** Kaydedilmiş rotalar listesi gösteriliyor
- [ ] **TC-213:** "See All" tıklandığında SeeAll ekranına gidiliyor
- [ ] **TC-214:** Her rota satırında thumbnail, isim, tarih, durak sayısı ve süre gösteriliyor
- [ ] **TC-215:** Tamamlanan rotalar tick ikonu ile gösteriliyor
- [ ] **TC-216:** Bir rotaya tıklandığında RouteDetail ekranına gidiliyor

### 7.5 Yeni Rota Oluştur
- [ ] **TC-217:** "Create New Route" butonu dashed border ile gösteriliyor
- [ ] **TC-218:** Butona tıklandığında CreateRoute ekranına gidiliyor

---

## 8. Profil

### 8.1 Profil Görünümü
- [ ] **TC-219:** Profil ekranı "Profile" başlığı ile açılıyor
- [ ] **TC-220:** Avatar (initials) dairesi gösteriliyor
- [ ] **TC-221:** Kullanıcı adı ve soyadı gösteriliyor
- [ ] **TC-222:** Ziyaret edilen yer sayısı gösteriliyor
- [ ] **TC-223:** "Edit Profile" butonuna tıklandığında EditProfile ekranına gidiliyor
- [ ] **TC-224:** Kamera ikonu avatarın sağ altında gösteriliyor

### 8.2 İstatistikler
- [ ] **TC-225:** Stats kartında ROUTES, PLACES, CITIES değerleri gösteriliyor
- [ ] **TC-226:** İstatistik değerleri arasında dikey ayırıcı çizgi gösteriliyor

### 8.3 Premium Kartı
- [ ] **TC-227:** Premium üye değilse "Go Premium" kartı gösteriliyor
- [ ] **TC-228:** Premium özellikler listesi gösteriliyor (lock ikonlu)
- [ ] **TC-229:** "Upgrade to Premium" butonu gösteriliyor
- [ ] **TC-230:** Butona tıklandığında PremiumUpgrade ekranına gidiliyor
- [ ] **TC-231:** Premium üye ise "Premium Member" + "ACTIVE" badge gösteriliyor
- [ ] **TC-232:** Premium üyede "Upgrade" butonu gösterilmiyor

### 8.4 Ayar Grupları
- [ ] **TC-233:** "ACCOUNT SETTINGS" bölümü gösteriliyor
- [ ] **TC-234:** Language satırına tıklandığında dil seçim modalı açılıyor
- [ ] **TC-235:** Currency satırına tıklandığında CurrencySettings ekranına gidiliyor
- [ ] **TC-236:** Notifications satırına tıklandığında NotificationSettings'e gidiliyor
- [ ] **TC-237:** Location Access tıklandığında LocationSettings'e gidiliyor
- [ ] **TC-238:** Trip History tıklandığında TripHistory ekranına gidiliyor

### 8.5 Seyahat Tercihleri
- [ ] **TC-239:** "TRAVEL PREFERENCES" bölümü gösteriliyor
- [ ] **TC-240:** Interests satırı "Nature, Food" gibi değer gösteriyor — Interests'e yönlendiriyor
- [ ] **TC-241:** Budget Level satırı "Mid-range" gösteriyor — BudgetSettings'e yönlendiriyor
- [ ] **TC-242:** Travel Style satırı "Solo" gösteriyor — TravelStyle'a yönlendiriyor

### 8.6 Güvenlik & Görünüm
- [ ] **TC-243:** "SECURITY" bölümünde "Change Password" satırı gösteriliyor
- [ ] **TC-244:** Change Password tıklandığında ChangePassword ekranına gidiliyor
- [ ] **TC-245:** "APPEARANCE" bölümünde "Theme" satırı gösteriliyor
- [ ] **TC-246:** Theme tıklandığında tema seçim modalı açılıyor

### 8.7 Destek
- [ ] **TC-247:** "SUPPORT" bölümünde Help Center, Privacy Policy, Terms of Service satırları gösteriliyor
- [ ] **TC-248:** Her satıra tıklandığında ilgili ekrana yönlendiriliyor
- [ ] **TC-249:** Alt kısımda versiyon bilgisi gösteriliyor

---

## 9. Mekan Detay (Place Detail)

### 9.1 Görünüm
- [ ] **TC-250:** Hero görsel tam genişlikte gösteriliyor
- [ ] **TC-251:** Mekan adı ve kategorisi hero üzerinde gösteriliyor
- [ ] **TC-252:** Geri butonu (sol üst) çalışıyor
- [ ] **TC-253:** Kaydet butonu (sağ üst) gösteriliyor
- [ ] **TC-254:** Puan pill'i (yıldız + değer + review sayısı) gösteriliyor
- [ ] **TC-255:** Mesafe ve fiyat pill'leri (varsa) gösteriliyor
- [ ] **TC-256:** Etiketler (tags) gösteriliyor

### 9.2 İçerik Bölümleri
- [ ] **TC-257:** "About" bölümünde açıklama metni gösteriliyor
- [ ] **TC-258:** "Location" bölümünde harita placeholder ve adres gösteriliyor
- [ ] **TC-259:** "Opening Hours" bölümünde günler ve saatler gösteriliyor
- [ ] **TC-260:** "Open Now" / "Closed" badge'i doğru gösteriliyor (saat bazlı)
- [ ] **TC-261:** Telefon ve website bilgileri (varsa) gösteriliyor
- [ ] **TC-262:** API'den detay yüklenirken loading indicator gösteriliyor

### 9.3 Bookmark Toggle
- [ ] **TC-263:** Bookmark ikonuna tıklandığında toggle oluyor (bold/linear)
- [ ] **TC-264:** Optimistic update — anında ikon değişiyor
- [ ] **TC-265:** Başarılı toggle sonrası Alert ile bilgi gösteriliyor
- [ ] **TC-266:** API hatası durumunda durum geri alınıyor (rollback)

### 9.4 Footer Butonları
- [ ] **TC-267:** "Reviews" butonuna tıklandığında Reviews ekranına gidiliyor
- [ ] **TC-268:** "Add to Route" butonuna tıklandığında Alert ile onay gösteriliyor

---

## 10. Rota Detay (Route Detail)

- [ ] **TC-269:** RouteDetail ekranı açılıyor — rota bilgileri gösteriliyor
- [ ] **TC-270:** Rota adı parametre olarak aktarılıp gösteriliyor
- [ ] **TC-271:** Duraklar timeline formatında gösteriliyor
- [ ] **TC-272:** Rota haritası gösteriliyor
- [ ] **TC-273:** Geri butonu çalışıyor

---

## 11. Arama & Filtreleme

### 11.1 Search Results Ekranı
- [ ] **TC-274:** SearchResults ekranı açılıyor
- [ ] **TC-275:** Arama sonuçları listelenebiliyor
- [ ] **TC-276:** Sonuçlar arasında navigasyon yapılabiliyor (PlaceDetail'e geçiş)

### 11.2 Filter Ekranı
- [ ] **TC-277:** Filter ekranı açılıyor
- [ ] **TC-278:** Filtre seçenekleri gösteriliyor
- [ ] **TC-279:** Filtreler uygulandıktan sonra sonuçlar güncelleniyor
- [ ] **TC-280:** Filtreleri sıfırlama seçeneği çalışıyor

### 11.3 See All Ekranı
- [ ] **TC-281:** SeeAll ekranı `type` parametresine göre açılıyor (nearbyGems, trending, vb.)
- [ ] **TC-282:** Doğru başlık gösteriliyor (parametre olarak aktarılan)
- [ ] **TC-283:** İçerik listesi gösteriliyor
- [ ] **TC-284:** Listeden bir öğeye tıklandığında detay ekranına gidiliyor

---

## 12. Harita

### 12.1 MapFull Ekranı
- [ ] **TC-285:** MapFull ekranı tam ekran açılıyor
- [ ] **TC-286:** Harita üzerinde mekanlar pin olarak gösteriliyor
- [ ] **TC-287:** Geri butonu çalışıyor

### 12.2 Navigation Ekranı
- [ ] **TC-288:** Navigation ekranı açılıyor
- [ ] **TC-289:** Yönlendirme bilgileri gösteriliyor

### 12.3 City Picker
- [ ] **TC-290:** CityPicker ekranı açılıyor
- [ ] **TC-291:** Şehir listesi gösteriliyor
- [ ] **TC-292:** Bir şehir seçildiğinde Redux state ve yerel depolama güncelleniyor
- [ ] **TC-293:** Seçim sonrası önceki ekrana dönülüyor

---

## 13. Bildirimler

- [ ] **TC-294:** Notifications ekranı açılıyor
- [ ] **TC-295:** Bildirim listesi gösteriliyor
- [ ] **TC-296:** Her bildirimde başlık, açıklama ve zaman bilgisi gösteriliyor
- [ ] **TC-297:** Okunmamış/okunmuş bildirim ayrımı gösteriliyor
- [ ] **TC-298:** Boş bildirim durumunda empty state gösteriliyor

---

## 14. Yer İmleri / Kaydedilenler

- [ ] **TC-299:** BookmarksSaved ekranı açılıyor
- [ ] **TC-300:** Kaydedilmiş mekanlar listelenebiliyor
- [ ] **TC-301:** Bir mekana tıklandığında PlaceDetail'e gidiliyor
- [ ] **TC-302:** Bookmark kaldırma işlemi çalışıyor
- [ ] **TC-303:** Boş liste durumunda empty state gösteriliyor

---

## 15. Değerlendirmeler (Reviews)

- [ ] **TC-304:** Reviews ekranı mekan bilgisiyle açılıyor
- [ ] **TC-305:** Mevcut değerlendirmeler listelenebiliyor
- [ ] **TC-306:** Değerlendirme puanı ve metin gösteriliyor
- [ ] **TC-307:** Yeni değerlendirme yazılabiliyor (puan + metin)
- [ ] **TC-308:** Değerlendirme gönderilebiliyor
- [ ] **TC-309:** "Helpful" butonuna basılabiliyor
- [ ] **TC-310:** Sıralama seçeneği çalışıyor
- [ ] **TC-311:** Sayfalama (pagination) çalışıyor

---

## 16. Rota Yönetimi

### 16.1 Create Route
- [ ] **TC-312:** CreateRoute ekranı açılıyor — header doğru
- [ ] **TC-313:** Rota adı giriş alanı çalışıyor
- [ ] **TC-314:** Başlangıç noktası giriş alanı çalışıyor
- [ ] **TC-315:** Süre seçimi (1-2h, Half Day, Full Day) chip'leri çalışıyor
- [ ] **TC-316:** İlk durak (stop) giriş alanı gösteriliyor
- [ ] **TC-317:** "Add Stop" butonuyla yeni durak eklenebiliyor
- [ ] **TC-318:** Durak kaldırma (X butonu) çalışıyor — en az 1 durak kalıyor
- [ ] **TC-319:** Rota adı boşken "Create" basıldığında validasyon uyarısı gösteriliyor
- [ ] **TC-320:** Geçerli bilgilerle "Create" basıldığında rota oluşturuluyor
- [ ] **TC-321:** Oluşturma sırasında ActivityIndicator gösteriliyor
- [ ] **TC-322:** Başarılı oluşturma sonrası RouteDetail ekranına yönlendiriliyor (replace)
- [ ] **TC-323:** "Plan with AI" banner'ına tıklandığında Belen ekranına gidiliyor
- [ ] **TC-324:** Harita preview placeholder gösteriliyor

### 16.2 Share Route
- [ ] **TC-325:** ShareRoute ekranı açılıyor
- [ ] **TC-326:** Paylaşım seçenekleri gösteriliyor
- [ ] **TC-327:** Paylaşım linki oluşturulabiliyor

### 16.3 Trip History
- [ ] **TC-328:** TripHistory ekranı açılıyor
- [ ] **TC-329:** Geçmiş geziler listelenebiliyor
- [ ] **TC-330:** Gezi detayına tıklanıp görüntülenebiliyor

### 16.4 Offline Routes
- [ ] **TC-331:** OfflineRoutes ekranı açılıyor
- [ ] **TC-332:** İndirilen rotalar listelenebiliyor
- [ ] **TC-333:** İndirilmemiş rotalar için indirme seçeneği gösteriliyor

---

## 17. Profil Düzenleme & Güvenlik

### 17.1 Edit Profile
- [ ] **TC-334:** EditProfile ekranı mevcut kullanıcı bilgileriyle açılıyor
- [ ] **TC-335:** First Name alanı düzenlenebiliyor
- [ ] **TC-336:** Last Name alanı düzenlenebiliyor
- [ ] **TC-337:** Email alanı düzenlenebiliyor
- [ ] **TC-338:** Avatar üzerine tıklandığında galeri açılıyor (image picker)
- [ ] **TC-339:** Fotoğraf seçildikten sonra upload ediliyor — loading gösteriliyor
- [ ] **TC-340:** Upload başarılıysa avatar güncelleniyor
- [ ] **TC-341:** Upload başarısızsa hata Alert gösteriliyor ve eski görsel korunuyor
- [ ] **TC-342:** "Save" butonuna basıldığında profil güncelleniyor (API)
- [ ] **TC-343:** İsim boşken "Save" basıldığında validasyon uyarısı gösteriliyor
- [ ] **TC-344:** Başarılı kayıt sonrası önceki ekrana dönülüyor
- [ ] **TC-345:** Redux state güncelleniyor — profil ekranı yeni bilgileri gösteriyor
- [ ] **TC-346:** Header'daki "Save" butonu da çalışıyor (ikinci save butonu)

### 17.2 Change Password
- [ ] **TC-347:** ChangePassword ekranı açılıyor — ikon ve alt başlık doğru
- [ ] **TC-348:** Mevcut şifre alanı gösteriliyor ve düzenlenebiliyor
- [ ] **TC-349:** Yeni şifre alanı gösteriliyor ve düzenlenebiliyor
- [ ] **TC-350:** Şifre onay alanı gösteriliyor ve düzenlenebiliyor
- [ ] **TC-351:** Şifre göster/gizle toggle'ı her alan için çalışıyor
- [ ] **TC-352:** Yeni şifre yazıldığında gereksinimler kartı gösteriliyor
- [ ] **TC-353:** "Minimum 8 characters" gereksinim kontrolü çalışıyor
- [ ] **TC-354:** "Passwords match" gereksinim kontrolü çalışıyor
- [ ] **TC-355:** Tüm gereksinimler karşılanmadan "Update Password" devre dışı
- [ ] **TC-356:** Geçerli bilgilerle güncelleme yapıldığında başarı mesajı gösteriliyor
- [ ] **TC-357:** Başarı sonrası "OK" tıklandığında önceki ekrana dönülüyor
- [ ] **TC-358:** Yanlış mevcut şifre girildiğinde hata mesajı gösteriliyor

---

## 18. Ayarlar

### 18.1 Notification Settings
- [ ] **TC-359:** NotificationSettings ekranı açılıyor
- [ ] **TC-360:** Bildirim tercih toggleları gösteriliyor
- [ ] **TC-361:** Toggle değiştirildiğinde ayar kaydediliyor

### 18.2 Location Settings
- [ ] **TC-362:** LocationSettings ekranı açılıyor
- [ ] **TC-363:** Konum erişim durumu gösteriliyor
- [ ] **TC-364:** Konum izni değiştirilebiliyor

### 18.3 Interests
- [ ] **TC-365:** Interests ekranı açılıyor
- [ ] **TC-366:** İlgi alanları listesi gösteriliyor
- [ ] **TC-367:** İlgi alanları seçilip/kaldırılabiliyor
- [ ] **TC-368:** Değişiklikler kaydedilebiliyor

### 18.4 Budget Settings
- [ ] **TC-369:** BudgetSettings ekranı açılıyor
- [ ] **TC-370:** Bütçe seviyeleri gösteriliyor
- [ ] **TC-371:** Seçim yapılıp kaydedilebiliyor

### 18.5 Travel Style
- [ ] **TC-372:** TravelStyle ekranı açılıyor
- [ ] **TC-373:** Seyahat stilleri gösteriliyor
- [ ] **TC-374:** Seçim yapılıp kaydedilebiliyor

### 18.6 Currency Settings
- [ ] **TC-375:** CurrencySettings ekranı açılıyor
- [ ] **TC-376:** Para birimi listesi gösteriliyor
- [ ] **TC-377:** Seçim yapılıp kaydedilebiliyor

### 18.7 Chat Settings
- [ ] **TC-378:** ChatSettings ekranı açılıyor
- [ ] **TC-379:** AI chat ile ilgili ayarlar gösteriliyor

### 18.8 Bilgi Ekranları
- [ ] **TC-380:** HelpCenter ekranı açılıyor — SSS veya yardım içeriği gösteriliyor
- [ ] **TC-381:** PrivacyPolicy ekranı açılıyor — gizlilik metni gösteriliyor
- [ ] **TC-382:** TermsOfService ekranı açılıyor — kullanım şartları gösteriliyor

---

## 19. Premium

- [ ] **TC-383:** PremiumUpgrade ekranı açılıyor
- [ ] **TC-384:** Premium avantajları listelenebiliyor
- [ ] **TC-385:** Fiyat bilgisi gösteriliyor
- [ ] **TC-386:** "Upgrade" butonuna tıklama çalışıyor (satın alma akışı)
- [ ] **TC-387:** Premium üye ise ekran uygun şekilde gösteriliyor

---

## 20. Tema & Dil

### 20.1 Tema Değiştirme
- [ ] **TC-388:** Profil > Appearance > Theme'e tıklandığında modal açılıyor
- [ ] **TC-389:** "Light" ve "Dark" seçenekleri gösteriliyor
- [ ] **TC-390:** Mevcut tema check ikonuyla işaretli
- [ ] **TC-391:** "Dark" seçildiğinde tema anında değişiyor — tüm renkler güncelleniyor
- [ ] **TC-392:** "Light" seçildiğinde tema anında değişiyor
- [ ] **TC-393:** Tema tercihi storage'a kaydediliyor — uygulama yeniden başlatıldığında korunuyor
- [ ] **TC-394:** StatusBar rengi temaya göre değişiyor (dark-content / light-content)
- [ ] **TC-395:** Tüm ekranlarda tema doğru uygulanıyor
   - [ ] Home
   - [ ] Explore
   - [ ] Belen
   - [ ] Routes
   - [ ] Profile
   - [ ] PlaceDetail
   - [ ] Auth ekranları

### 20.2 Dil Değiştirme
- [ ] **TC-396:** Profil > Language'e tıklandığında modal açılıyor
- [ ] **TC-397:** "English" ve "Turkish" seçenekleri gösteriliyor
- [ ] **TC-398:** Mevcut dil check ikonuyla işaretli
- [ ] **TC-399:** Dil değiştirildiğinde tüm metinler anlık güncelleniyor
- [ ] **TC-400:** Dil tercihi storage'a kaydediliyor
- [ ] **TC-401:** Türkçe seçildiğinde tüm çeviriler doğru gösteriliyor
   - [ ] Auth ekranları
   - [ ] Home header ve bölüm başlıkları
   - [ ] Explore başlık ve placeholder'lar
   - [ ] Profile menü öğeleri
   - [ ] Hata mesajları

---

## 21. Deep Linking

- [ ] **TC-402:** `toronto://home` linki ana sayfaya yönlendiriyor
- [ ] **TC-403:** `toronto://explore` linki Explore sekmesine yönlendiriyor
- [ ] **TC-404:** `toronto://routes` linki Routes sekmesine yönlendiriyor
- [ ] **TC-405:** `toronto://profile` linki Profile sekmesine yönlendiriyor
- [ ] **TC-406:** `toronto://place/{placeId}` linki PlaceDetail ekranına yönlendiriyor
- [ ] **TC-407:** `toronto://route/{routeId}` linki RouteDetail ekranına yönlendiriyor
- [ ] **TC-408:** `toronto://search` linki SearchResults ekranına yönlendiriyor
- [ ] **TC-409:** `toronto://map` linki MapFull ekranına yönlendiriyor
- [ ] **TC-410:** `https://toronto-app.com/home` web linki doğru ekrana yönlendiriyor

---

## 22. Performans & UX

### 22.1 Yükleme Durumları
- [ ] **TC-411:** Tüm API çağrılarında loading indicator gösteriliyor
- [ ] **TC-412:** Home ekranında skeleton kartlar veri yüklenirken gösteriliyor
- [ ] **TC-413:** Explore ekranında skeleton kartlar gösteriliyor
- [ ] **TC-414:** Routes ekranında ActivityIndicator gösteriliyor
- [ ] **TC-415:** PlaceDetail'de loading indicator gösteriliyor

### 22.2 Scroll Performansı
- [ ] **TC-416:** Home ekranındaki yatay listeler akıcı kaydırılıyor
- [ ] **TC-417:** Explore sonuç listesi akıcı kaydırılıyor
- [ ] **TC-418:** Belen mesaj listesi akıcı kaydırılıyor
- [ ] **TC-419:** Profile ekranı akıcı kaydırılıyor

### 22.3 Animasyonlar
- [ ] **TC-420:** Home sticky header animasyonu 60fps'de çalışıyor
- [ ] **TC-421:** Explore arama odak animasyonu düzgün
- [ ] **TC-422:** Onboarding slide geçişleri düzgün

### 22.4 Klavye Yönetimi
- [ ] **TC-423:** Login/Register formlarında klavye açıldığında form kayıyor
- [ ] **TC-424:** Belen input'unda klavye açıldığında layout düzgün
- [ ] **TC-425:** CreateRoute'ta klavye açıldığında input'lar görünür kalıyor
- [ ] **TC-426:** EditProfile'da `keyboardShouldPersistTaps="handled"` çalışıyor

---

## 23. Erişilebilirlik (Accessibility)

- [ ] **TC-427:** PlaceDetail geri butonu `accessibilityLabel` ve `accessibilityRole="button"` var
- [ ] **TC-428:** PlaceDetail kaydet butonu accessible
- [ ] **TC-429:** PlaceDetail "Add to Route" butonu accessible
- [ ] **TC-430:** ChangePassword şifre göster/gizle butonları accessible
- [ ] **TC-431:** ChangePassword update butonu accessible
- [ ] **TC-432:** EditProfile save butonu accessible
- [ ] **TC-433:** Explore "Expand Map" butonu accessible
- [ ] **TC-434:** Tüm TouchableOpacity'lerde yeterli hitSlop değeri var (min 8)
- [ ] **TC-435:** Screen reader ile ana akışlar (Login → Home → Explore) yönlendirilebiliyor

---

## 24. Edge Cases & Hata Durumları

### 24.1 Ağ Hataları
- [ ] **TC-436:** İnternet yokken Login denendiğinde uygun hata mesajı gösteriliyor
- [ ] **TC-437:** İnternet yokken Home açılınca fallback (JSON) verisi gösteriliyor
- [ ] **TC-438:** İnternet yokken Belen mesaj gönderildiğinde hata mesajı gösteriliyor
- [ ] **TC-439:** İnternet yokken CreateRoute'ta hata mesajı gösteriliyor
- [ ] **TC-440:** İnternet yokken PlaceDetail açıldığında en azından temel bilgiler (parametre) gösteriliyor

### 24.2 Boş Veri Durumları
- [ ] **TC-441:** Kullanıcı adı yokken varsayılan "Traveler" gösteriliyor (Home header)
- [ ] **TC-442:** Şehir bilgisi yokken location chip boş string gösteriliyor (crash yok)
- [ ] **TC-443:** Nearby gems API boş dönerse fallback listesi kullanılıyor
- [ ] **TC-444:** Trending items API boş dönerse fallback listesi kullanılıyor
- [ ] **TC-445:** Belen boş mesaj gönderimi engelleniyor
- [ ] **TC-446:** Routes API boş dönerse empty state gösteriliyor

### 24.3 Token & Oturum
- [ ] **TC-447:** Token süresi dolduğunda uygun işlem yapılıyor (refresh veya logout)
- [ ] **TC-448:** Refresh token geçersiz olduğunda Login ekranına yönlendiriliyor
- [ ] **TC-449:** Uygulama arka plandan geldiğinde oturum devam ediyor

### 24.4 Navigasyon
- [ ] **TC-450:** Tab bar'daki tüm sekmeler doğru ekranları açıyor
   - [ ] Home
   - [ ] Explore
   - [ ] Belen
   - [ ] Routes
   - [ ] Profile
- [ ] **TC-451:** Stack ekranlarından geri (goBack) navigasyonu çalışıyor
- [ ] **TC-452:** RootStackNavigator'daki tüm ekranlar sorunsuz açılıyor
- [ ] **TC-453:** Android hardware back button çalışıyor
- [ ] **TC-454:** CreateRoute → RouteDetail `navigation.replace` düzgün çalışıyor

### 24.5 Veri Tutarlılığı
- [ ] **TC-455:** Profil düzenlemesi yapıldığında Home header kullanıcı adını güncelliyor
- [ ] **TC-456:** Dil değiştirildiğinde tüm ekranlar yeni dili kullanıyor
- [ ] **TC-457:** Tema değiştirildiğinde tüm ekranlar yeni temayı kullanıyor
- [ ] **TC-458:** Bookmark toggle sonrası Explore ve BookmarksSaved senkron

### 24.6 Weather Detail
- [ ] **TC-459:** WeatherDetail ekranı şehir bilgisiyle açılıyor
- [ ] **TC-460:** Hava durumu bilgileri gösteriliyor
- [ ] **TC-461:** Geri butonu çalışıyor

---

## 📈 Test Sonuç Özeti

| Kategori | Toplam | ✅ Başarılı | ❌ Başarısız | ⚠️ Kısmi | ⏭️ Atlandı |
|----------|--------|------------|-------------|---------|-----------|
| Başlatma & Splash | 11 | | | | |
| Onboarding | 16 | | | | |
| Auth | 55 | | | | |
| Home | 40 | | | | |
| Explore | 37 | | | | |
| Belen AI | 33 | | | | |
| Routes | 22 | | | | |
| Profil | 31 | | | | |
| Place Detail | 19 | | | | |
| Route Detail | 5 | | | | |
| Arama & Filtre | 11 | | | | |
| Harita | 9 | | | | |
| Bildirimler | 5 | | | | |
| Yer İmleri | 5 | | | | |
| Reviews | 8 | | | | |
| Rota Yönetimi | 22 | | | | |
| Profil Düzenleme | 25 | | | | |
| Ayarlar | 24 | | | | |
| Premium | 5 | | | | |
| Tema & Dil | 14 | | | | |
| Deep Linking | 9 | | | | |
| Performans & UX | 16 | | | | |
| Erişilebilirlik | 9 | | | | |
| Edge Cases | 26 | | | | |
| **TOPLAM** | **461** | | | | |

---

## 🐛 Bulunan Hatalar / Notlar

> Burada teste sırasında karşılaştığınız hataları ve notları kaydedin.

### Hata #1
- **TC No:** 
- **Ekran:** 
- **Açıklama:** 
- **Beklenen Davranış:** 
- **Gerçekleşen Davranış:** 
- **Ekran Görüntüsü:** 
- **Öncelik:** 🔴 Kritik / 🟡 Orta / 🟢 Düşük

### Hata #2
- **TC No:** 
- **Ekran:** 
- **Açıklama:** 
- **Beklenen Davranış:** 
- **Gerçekleşen Davranış:** 
- **Ekran Görüntüsü:** 
- **Öncelik:** 🔴 Kritik / 🟡 Orta / 🟢 Düşük

### Hata #3
- **TC No:** 
- **Ekran:** 
- **Açıklama:** 
- **Beklenen Davranış:** 
- **Gerçekleşen Davranış:** 
- **Ekran Görüntüsü:** 
- **Öncelik:** 🔴 Kritik / 🟡 Orta / 🟢 Düşük

---

> 📌 **Not:** Bu doküman projenin kaynak kodu detaylı incelenerek oluşturulmuştur. Her test senaryosu gerçek kod yapısına göre tanımlanmıştır. Test ederken `[✅]`, `[❌]` veya `[⚠️]` işaretleriyle güncelleyebilirsiniz.
