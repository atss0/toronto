# Mantık ve UX Analiz Raporu
### Turizm Asistanı Uygulaması — Eleştirel PM / UX Değerlendirmesi
> **Tarih:** 2026-04-18 | **Analist:** PM + Turizm + UX Uzmanı Perspektifi

---

## Yönetici Özeti

Uygulama, teknik altyapısı iyi kurgulanmış olmakla birlikte **ürün tutarlılığı ve kullanıcı yolculuğu** açısından ciddi sorunlar barındırmaktadır. Kullanıcı bir yere gitmeye ya da keşfetmeye karar verdiğinde uygulamanın ona sunduğu akış ya yarım kalıyor, ya yanlış yönlendiriyor ya da hiç sonuç vermiyor. Bu rapor, dört ana başlık altında bu sorunları somut örneklerle ortaya koyuyor ve her biri için öneriler sunuyor.

---

## 1. Konsept Tutarsızlıkları

### 1.1 "Toronto" Adı ↔ Türkiye İçeriği Çelişkisi

**Sorun:** Uygulama `toronto` paket adıyla (`com.toronto`) geliştirilmiş, ancak içerik tamamen Türkiye'ye (İstanbul, Kapadokya, Antalya) ait. `discover.json` dosyasındaki `trending` verilerinde ise "The Modern Wing", "Glass Pavilion", "Harbor View Terrace" gibi Batılı görünen, hiçbir lokasyona atfedilmemiş isimler yer alıyor.

**Etki:** Kullanıcı ilk açılışta hangi şehre / ülkeye hizmet ettiğini anlayamıyor. Tutarsız içerik marka güvenilirliğini zedeliyor.

**Öneri:**
- Uygulama adı ve paket kimliği netleştirilmeli (Türkiye odaklıysa `torontotravel` yerine lokalize bir isim düşünülmeli).
- `discover.json` + `mock.json` verileri gerçek Türkiye lokasyonlarıyla değiştirilmeli.
- MVP kapsamı "İstanbul odaklı" olarak sabitlenmeli, ilerleyen sürümlerde genişletilmeli.

---

### 1.2 "Belen" Sekme Adı

**Sorun:** `ExploreScreen` sekme navigasyonunda "Belen" adlı bir sekme bulunuyor. Ne anlama geldiği, hangi içerik kategorisini temsil ettiği belli değil. Diğer sekmeler ("Trending", "Museums", "Dining" vb.) açık kategoriler iken "Belen" izole bir anlam taşıyor.

**Etki:** Kullanıcı sekmeye tıkladığında ne göreceğini tahmin edemiyor → tıklama motivasyonu düşüyor.

**Öneri:** Sekme adı ya anlamlı bir kategori ismiyle değiştirilmeli (örn. "Türk Mutfağı", "Plajlar") ya da bu sekme kaldırılmalıdır.

---

### 1.3 FilterScreen Boş Query ile SearchResults'a Yönlendiriyor

**Sorun:** `FilterScreen.tsx` navigasyon çağrısı:
```ts
navigation.navigate('SearchResults', { query: '', filters: { ... } });
```
`query` her zaman boş string gönderiliyor. `SearchResultsScreen` bu değeri başlık olarak gösteriyor: "Sonuçlar: " şeklinde anlamsız bir başlık çıkıyor.

**Etki:** Kullanıcı filtreleme yaptıktan sonra "Neden sonuç ekranı açıldı, ne aradım ki?" sorusunu soruyor. Filtre ile arama kavramsal olarak birbirine karışıyor.

**Öneri:** Filter ekranı ya mevcut arama bağlamından açılmalı (query parametre olarak geçilmeli), ya da "Filtreli Keşif" gibi ayrı bir başlıkla bağımsız bir ekran olarak kurgulanmalıdır.

---

### 1.4 ShareRoute Sabit URL

**Sorun:** `ShareRouteScreen` (veya ilgili akış) paylaşım URL'sini hardcode ediyor:
```ts
const shareUrl = 'https://toronto-app.com/routes/abc123';
```
Her rota paylaşımı aynı URL'yi gönderiyor.

**Etki:** Paylaşılan link hiçbir zaman gerçek rotaya gitmiyor → kullanıcı güveni sıfırlanıyor.

**Öneri:** Route ID dinamik olarak URL'ye eklenmeli: `https://toronto-app.com/routes/${routeId}`. Deep linking de buna göre yapılandırılmalı.

---

## 2. Akış Hataları ve Çıkmaz Sokaklar

### 2.1 PlaceDetail → "Rotaya Ekle" → Çıkmaz

**Sorun:** `PlaceDetailScreen`'de "Rotaya Ekle" butonu yalnızca bir `Alert.alert('Başarılı', 'Yer rotanıza eklendi')` gösteriyor. Rotaya gitmek için hiçbir yönlendirme yok.

**Kullanıcı Yolculuğu:**
```
Yeri bul → Detayına gir → "Rotaya Ekle" → ✅ Alert → [Geri?] → [Rotalar?] → ???
```

**Etki:** Kullanıcı yeri eklediğini düşünüyor ama rotasını görmek için nereye gideceğini bilmiyor. Redux/backend'e hiçbir şey kaydedilmiyor.

**Öneri:**
1. Alert'e "Rotayı Görüntüle" aksiyonu eklenmeli.
2. Kullanıcıyı `Routes` → ilgili rota detayına yönlendirmeli.
3. Redux'a `addPlaceToRoute(placeId, routeId)` aksiyonu eklenmeli.

---

### 2.2 CreateRoute → Sadece goBack()

**Sorun:** Rota oluşturma ekranında form doldurulup "Oluştur" butonuna basıldığında `navigation.goBack()` çağrılıyor. Ne başarı mesajı var, ne de oluşturulan rotanın detayına yönlendirme.

**Etki:** Kullanıcı rotasının oluşup oluşmadığından emin olamıyor. Hiçbir feedback yok.

**Öneri:**
```ts
// Rota kaydedildikten sonra:
navigation.replace('RouteDetail', { routeId: newRoute.id });
// veya
navigation.navigate('Routes'); // + toast mesajı
```

---

### 2.3 ReviewsScreen → Yorum Formu Gönderilemez

**Sorun:** `ReviewsScreen`'deki "Yorum Yaz" modalı form alanlarını gösteriyor ancak "Gönder" butonu herhangi bir aksiyon tetiklemiyor (ya `console.log` ya da boş handler). Yorum Redux'a veya servise gönderilmiyor.

**Etki:** Kullanıcı yorum yazıp gönderiyor, hiçbir şey olmuyor. Geri dönüp baktığında yorumu yok.

**Öneri:**
1. `submitReview` service metodu (`src/services/places.ts`'te mevcut) ReviewsScreen'e bağlanmalı.
2. Yorum gönderildikten sonra liste yenilenmeli ya da optimistic update yapılmalı.

---

### 2.4 FilterScreen Bağlamdan Kopuk Açılış

**Sorun:** FilterScreen hem HomeScreen'den hem de ExploreScreen'den açılabiliyor, ancak her iki bağlamda da hangi içerik filtreleneceği belirsiz. Filtreler uygulandığında ortak bir `SearchResultsScreen`'e gidiliyor.

**Etki:** "Explore'daki içeriği filtrele" ile "Genel arama yap" kavramları aynı akışa sıkıştırılmış.

**Öneri:** FilterScreen'e `context: 'explore' | 'search'` parametresi eklenmeli ve navigasyon buna göre ayrıştırılmalı.

---

## 3. Gereksiz Sürtünme Noktaları

### 3.1 Bookmark → Yalnızca Local State

**Sorun:** `BookmarksSavedScreen` bookmark'ları local `useState` ile tutuyor. Uygulama kapatılıp açıldığında tüm bookmarklar kayboluyor (mock.json'dan yeniden yükleniyor).

**Etki:** Kullanıcı yer kaydetti, uygulamayı kapattı, geri döndü → kayıt yok. **En temel turizm uygulaması özelliği çalışmıyor.**

**Öneri:**
1. Redux `BookmarkSlice` oluşturulmalı.
2. MMKV ile persist edilmeli.
3. `toggleBookmark` service metodu (`src/services/places.ts`'te mevcut) bağlanmalı.

---

### 3.2 PlaceDetail → Etiketler ve Çalışma Saatleri Hardcode

**Sorun:**
```ts
const tags = ['Historical', 'Museum', 'Cultural', 'Family'];
const hours = 'Mon-Sun: 09:00 - 18:00';
```
Her mekan için aynı etiketler ve saatler gösteriliyor.

**Etki:** Kullanıcı Topkapı Sarayı ile bir alışveriş merkezinin aynı saatlerde açık olduğunu görüyor → içeriğe güven sıfırlanıyor.

**Öneri:** Bu veriler `PlaceDetail` route params veya API response'una taşınmalı. En azından mock veriye mekan bazlı farklı değerler girilmeli.

---

### 3.3 Profil İstatistikleri Hardcode

**Sorun:** `ProfileScreen` şunları gösteriyor:
```ts
const stats = [
  { label: 'Places', value: '47' },
  { label: 'Routes', value: '12' },
  { label: 'Reviews', value: '8' },
];
```
Bu sayılar hiçbir zaman değişmiyor.

**Etki:** Kullanıcı 20 yer kaydetse bile profilde "47 Places" görüyor. Kişiselleştirme hissi yok.

**Öneri:** Redux store'daki bookmark, rota ve yorum sayıları kullanılarak bu değerler dinamik hesaplanmalı.

---

### 3.4 Arama Geçmişi Yok

**Sorun:** `SearchResultsScreen` ve `HomeScreen` arama input'unda önceki aramalar gösterilmiyor. Her açılışta kullanıcı sıfırdan yazıyor.

**Etki:** Tekrar eden aramalar (örn. her sabah "kahvaltı İstanbul") için fazla efor gerekiyor.

**Öneri:** MMKV'de son 5-10 aramayı sakla, input focus'ta öner.

---

## 4. Eksik Turizm Refleksleri

### 4.1 Gerçek Harita Entegrasyonu Yok

**Sorun:** `ExploreScreen`'deki harita görünümü (`ExploreMapView` bileşeni) gerçek bir harita değil — muhtemelen static bir placeholder veya çok basit bir render. `react-native-maps` paketi kurulu değil.

**Etki:** Bir turizm uygulamasının en kritik özelliği — "nerede olduğumu ve çevremde ne var" — çalışmıyor.

**Öneri:**
```bash
npm install react-native-maps
```
`ExploreMapView` → `MapView` + `Marker` bileşenleriyle gerçek harita kurulmalı. Kullanıcı konumu `react-native-permissions` + geolocation ile alınmalı.

---

### 4.2 Hava Durumu Entegrasyonu Yok

**Sorun:** Turizm kararları büyük ölçüde hava durumuna bağlı. Uygulama hiçbir yerde hava durumu göstermiyor.

**Etki:** "Bugün Boğaz turu yapalım mı?" sorusuna uygulama cevap veremiyor.

**Öneri:** OpenWeatherMap (ücretsiz tier) veya WeatherAPI entegrasyonu. `HomeScreen` hero alanında mevcut şehrin hava durumu widget'ı.

---

### 4.3 Fotoğraf Galerisi Yok

**Sorun:** `PlaceDetailScreen` tek bir görsel gösteriyor. Gerçek turizm uygulamalarında çoklu fotoğraf galerisi standart bir özellik.

**Etki:** Kullanıcı yere gitmeden önce nasıl göründüğünü yeterince değerlendiremiyor.

**Öneri:** `react-native-fast-image` kurulumu + yatay scroll galeri. En az 3-5 fotoğraf desteklenmeli.

---

### 4.4 Rezervasyon / Bilet Akışı Yok

**Sorun:** Topkapı Sarayı, Ayasofya gibi mekanlar için giriş ücreti ve rezervasyon bilgisi gösterilmiyor. "Bilet Al" butonu yok.

**Etki:** Kullanıcı uygulamadan ayrılıp başka kaynaklara (biletix, müze websitesi) gitmek zorunda kalıyor.

**Öneri (MVP):** Dış link olarak bile olsa "Bilet Al" butonu eklenebilir (`Linking.openURL`). Entegrasyon sonraki faza bırakılabilir.

---

### 4.5 Offline İçerik Kullanılabilirliği Sınırlı

**Sorun:** `OfflineRoutesScreen` rotaları offline saklıyor gibi görünse de gerçek cache mekanizması yok. Uygulama internet olmadığında çalışmıyor.

**Etki:** Turistler yabancı bir şehirde roaming açmadan uygulamayı kullanmak istiyor — bu senaryo desteklenmiyor.

**Öneri:**
1. `@tanstack/react-query` + `cacheTime` ile sorgu sonuçları önbelleklenmeli.
2. İndirilen rotalar MMKV'de tam detayıyla saklanmalı.
3. Offline modu belirgin şekilde işaretlenmeli (banner/ikon).

---

### 4.6 Push Bildirim Altyapısı Eksik

**Sorun:** `NotificationsScreen` bildirim listesini mock JSON'dan okuyor. `@react-native-firebase/messaging` kurulu değil.

**Etki:** "Ziyaret ettiğiniz mekana yakınsınız", "Rotanız başlıyor" gibi bağlam farkındalıklı bildirimler gönderilemiyor.

**Öneri:**
```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```
Geofencing tabanlı bildirimler (mekan yakınlığı) turizm UX'inin temel parçası.

---

## Öncelikli Eylem Listesi

| # | Sorun | Etki | Efor | Öncelik |
|---|-------|------|------|---------|
| 1 | Bookmark local state → Redux + MMKV | Kritik veri kaybı | Orta | 🔴 P0 |
| 2 | PlaceDetail "Rotaya Ekle" çıkmaz sokak | Core flow broken | Orta | 🔴 P0 |
| 3 | Gerçek harita entegrasyonu | Ana değer önerisi yok | Yüksek | 🔴 P0 |
| 4 | CreateRoute → başarı akışı | Kullanıcı belirsizliği | Düşük | 🟡 P1 |
| 5 | ReviewsScreen gönderim | Core flow broken | Orta | 🟡 P1 |
| 6 | Profil istatistikleri dinamik | Kişiselleştirme | Düşük | 🟡 P1 |
| 7 | Hava durumu widget | Turizm bağlamı | Orta | 🟡 P1 |
| 8 | Fotoğraf galerisi | İçerik kalitesi | Orta | 🟠 P2 |
| 9 | ShareRoute dinamik URL | Broken feature | Düşük | 🟠 P2 |
| 10 | Arama geçmişi | Kullanım kolaylığı | Düşük | 🟠 P2 |
| 11 | Push bildirim altyapısı | Engagement | Yüksek | 🟠 P2 |
| 12 | Offline cache gerçek implementasyon | Turizm kullanım senaryosu | Yüksek | 🔵 P3 |

---

## Genel Değerlendirme

```
Teknik Altyapı Kalitesi    ████████░░  8/10
UI Tasarım Tutarlılığı     ███████░░░  7/10
Kullanıcı Akışı Bütünlüğü  ████░░░░░░  4/10
Turizm Ürün Olgunluğu      ███░░░░░░░  3/10
İçerik Gerçekçiliği        ███░░░░░░░  3/10

GENEL ÜRÜN PUANI           █████░░░░░  5/10
```

**Özet:** Uygulama iyi bir teknik iskelet üzerine inşa edilmiş ancak bir **turistin gerçek karar verme sürecine** destek olacak akışlar tamamlanmamış. P0 ve P1 maddeleri çözüldükten sonra uygulama gerçek anlamda kullanılabilir bir turizm asistanına dönüşecektir.
