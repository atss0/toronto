# Toronto Turizm Asistanı — Mantık & UX Eleştiri Raporu

**Tarih:** 20 Nisan 2026  
**Analiz Türü:** Ürün Mantığı, UX Akışı, Konsept Tutarlılığı  
**Analist:** PM / Turizm Analisti / UX Uzmanı perspektifi

---

> **Genel Değerlendirme:** Bu uygulama görünürde eksiksiz bir turizm asistanı gibi görünse de içi incelendiğinde başka bir projeden kopyalanmış bileşenler, mantık bağlantısı kurulmamış özellikler ve seyahat halindeki bir turisti gerçekten düşünmeden tasarlanmış akışlar ortaya çıkıyor. Aşağıdaki eleştiriler sert ama somut; her biri kod ve ekranlar üzerinden doğrulanmıştır.

---

## BÖLÜM 1 — KONSEPT TUTARSIZLIKLARI ("Bu ne alaka?" dedirten yerler)

---

### ✅ 1.1 — "Sultanahmet" Placeholder'ı: Kopyala-Yapıştır Kanıtı

> **Düzeltildi:** `CreateRouteScreen.tsx`, `BelenScreen.tsx`, `NavigationScreen.tsx` içindeki tüm İstanbul/Sultanahmet referansları kaldırıldı. Placeholder → `"e.g. Morning at the old town"`.

**Dosya:** `src/screens/CreateRouteScreen.tsx`  
**Input placeholder:** `"e.g. Morning in Sultanahmet"`

**Neden Mantıksız?**  
Bu global bir turizm uygulaması. Sultanahmet ise İstanbul'un tarihi yarımadasında tek bir semtin adı. Bu placeholder, uygulamanın başka bir (muhtemelen İstanbul odaklı) projeden kopyalandığını kanıtlayan doğrudan bir iz. Global bir ürünün rota oluşturma ekranında tek bir şehrin tek bir semtini örnek göstermesi, uygulamanın kapsamını daraltıyor ve güvenilirliğini zedeliyor.

**Çözüm:** Placeholder şehir-nötr ve ilham verici olmalı: `"e.g. Morning at the old town"` ya da `"e.g. Sunset walk by the harbor"` gibi evrensel imgeler kullanılmalı. Kullanıcının hangi şehirde olduğundan bağımsız anlam taşımalı.

---

### ✅ 1.2 — `fmtMin` Fonksiyonu: Dil Ayarı Yok Sayılıyor

> **Düzeltildi:** `fmtMin` artık `i18n.t('units.min')` ve `i18n.t('units.hour')` kullanıyor. `en.json` → `"min"/"hr"`, `tr.json` → `"dk"/"sa"` key'leri eklendi.

**Dosya:** `src/utils/formats.ts`  
**İlgili çıktılar:** `"dk"`, `"sa"` (Türkçe dakika/saat kısaltmaları)

**Neden Mantıksız?**  
Uygulama i18n desteğiyle İngilizce ve Türkçe sunuyor. Ancak `fmtMin` fonksiyonu dil bağımsız olarak Türkçe kısaltmaları (`dk`, `sa`) kullanıyor. İngilizce'ye geçen bir kullanıcı "45 dk" gördüğünde ne anlamalı? Bu, birim çevirisi değil; dilden bağımsız hardcode edilmiş bir kısaltma. Aynı formatlayıcıyı tüm uygulama kullanıyor: rota süreleri, gezi süreleri, yürüyüş tahmini... hepsi Türkçe kısaltmayla gösteriliyor.

**Çözüm:** Formatlayıcı i18n key'lerine bağlanmalı: `t('units.min')` → `"min"` (EN), `"dk"` (TR).

---

### ✅ 1.3 — "Save" Quick Action: Neyi Kaydediyorsun?

> **Düzeltildi:** `HomeScreen.tsx` içinde tüm Quick Action'lara `onPress` handler'ları bağlandı. "Save" → **"Saved"** olarak değiştirildi ve `BookmarksSaved` ekranına yönlendiriyor.

**Dosya:** `src/components/QuickActions/QuickActions.tsx`  
**Home ekranındaki 4 hızlı eylem:** Explore / **Save** / Events / Nearby

**Neden Mantıksız?**  
"Save" bir eylem fiilidir, nesnesiz kullanılamaz. Ana ekranda bir kullanıcı henüz hiçbir yeri görmemişken "Kaydet" düğmesine basması anlamsız. E-ticaret uygulamalarında "Favorilere Ekle" mantığı ana sayfaya taşınmış gibi duruyor. Kaydet demek için önce bir şey bulman, görmen, değerlendirmen gerekir.

**Çözüm:** Quick Action olarak "Saved / Bookmarks" (daha önce kaydettiğin yerlere git) ya da tamamen farklı bir aksiyonla değiştirilmeli: "Nearby Restaurants", "Open Now", "Today's Events" gibi turistik refleksi olan eylemler.

---

### ✅ 1.4 — "Belen" İsmi: Marka Kimliği Kırık

> **Düzeltildi:** `tabs.belen` her iki dilde "AI" yerine "Assistant" / "Asistan" olarak güncellendi. Tab ve screen başlığı ("Travel Assistant") artık uyumlu.

**Tab:** `tabs.belen → "AI"`  
**Screen başlığı:** `"Travel Assistant"`

**Neden Mantıksız?**  
Tab çubuğunda "AI" yazıyor ama asistan "Belen" olarak adlandırılmış. Dahası asistan ekranının başlığı "Travel Assistant" — aynı şeyin 3 farklı ismi var: `Belen`, `AI`, `Travel Assistant`. Uygulama global bir ürün olacaksa asistanın kimliği de tutarlı ve evrensel olmalı. Şu an ne bir karakter kimliği tam oturmuş ne de generic yol seçilmiş; ikisi arasında sıkışılmış.

**Çözüm:** Ya asistana güçlü, uluslararası bir karakter kimliği ver ve her yerde o ismi kullan (tab dahil), ya da tamamen generic kal: her yerde "AI Assistant". Ortada bırakma.

---

### ✅ 1.5 — CityPicker Ekranı: Şehir Seçiliyor ama Hiçbir Şey Değişmiyor

> **Kısmen Düzeltildi:** `CityPickerScreen.tsx` içindeki `CITIES` listesi 8 Türk şehrinden 30 global şehre genişletildi (Paris, London, New York, Tokyo, Rome, vb.). Şehir seçimi zaten Redux `locationName` state'ine yazılıyordu. API entegrasyonu backend'e bağımlı — bu kısmı roadmap'te kalıyor.

**Dosya:** `src/screens/CityPickerScreen.tsx`  
**Navigasyonda var:** Evet  

**Neden Mantıksız?**  
Global bir turizm uygulamasında CityPicker mantıklı bir feature. Sorun konseptte değil, mimaride: seçilen şehir Redux state'ine yazılmıyor, API çağrılarına parametre olarak iletilmiyor ve hiçbir ekran bu seçimi dinlemiyor. CityPicker şu an bir dekorasyon — seçim yapılıyor ama uygulamanın hiçbir katmanı bunu umursamıyor.

**Çözüm:** Şehir seçimi veri katmanına gerçekten bağlanmalı — API çağrısı şehir parametresiyle yapılmalı. Seçilen şehir her ekranda context olarak gösterilmeli ("Exploring: Paris"). Onboarding'de "Where are you heading?" sorusu ilk adım olmalı.

---

### 1.6 — Budget & Travel Style Ayarları: Verisi Toplanıyor, Hiçbir Yerde Kullanılmıyor

**Dosyalar:** `src/screens/BudgetSettingsScreen.tsx`, `src/screens/TravelStyleScreen.tsx`, `src/screens/InterestsScreen.tsx`

**Neden Mantıksız?**  
Kullanıcıdan bütçe seviyesi, seyahat stili (solo/grup/aile) ve ilgi alanları toplanıyor. Bu tercihler Redux'a kaydediliyor. Peki sonra ne oluyor? Explore ekranındaki filtrelere yansımıyor. Home ekranındaki "Nearby Gems" bu verilere göre değişmiyor. Belen AI'ı bu tercihlere göre rota önermiyor. Veriler toplanıp hiçbir işe yaramıyor — bu, kullanıcıya "seni anlıyorum" deyip dinlememek demektir.

**Çözüm:** Bu tercihler mutlaka şu yerlere bağlanmalı: (1) Explore filtreleri varsayılan olarak ilgi alanlarını yansıtmalı, (2) Budget düzeyi mekanlarda fiyat kategorisini vurgulayacak şekilde renklendirmeli, (3) Belen AI sistemi prompt'una bu context dahil edilmeli, (4) Aile seyahat stili seçilince "family-friendly" badge otomatik öne çıkmalı.

---

### 1.7 — Premium Upgrade: Ne Vaat Ediyor?

**Dosya:** `src/screens/PremiumUpgradeScreen.tsx`

**Neden Mantıksız?**  
Premium yükseltme ekranı var ama uygulama içinde hiçbir özellik premium duvarının arkasına konulmamış. "AI'ı sınırsız kullan" gibi bir kısıt yok. "Offline routes premium" değil. "Advanced filters premium" değil. Kullanıcıya "premium ol" deniyor ama premium olmanın elle tutulur bir farkı yok. Bu sadece eksik bir özellik değil — kullanıcı güvenini zedeleyen bir boşluk.

**Çözüm:** Ya gerçek premium feature gate'leri koy (örn: Belen günde 5 sorgu ücretsiz, sınırsız premium; Offline download premium; advanced filter premium), ya da premiumu tamamen kaldır. Ortada bırakma.

---

## BÖLÜM 2 — AKIŞ HATALARI VE ÇIKMAZ SOKAKLAR

---

### ✅ 2.1 — "Events" Quick Action: Ekranı Olmayan Buton

> **Kısmen Düzeltildi:** Events butonu artık Explore ekranına yönlendiriyor (crash riski giderildi). Ayrı bir EventsScreen henüz oluşturulmadı — bu roadmap'te kalmaya devam ediyor.

**Dosya:** `src/components/QuickActions/QuickActions.tsx`  
**Navigator'da EventsScreen:** YOK

**Neden Kritik?**  
Home ekranındaki 4 hızlı eylemden biri "Events". Kullanıcı tıklıyor, uygulama crash'liyor ya da hiçbir şey olmuyor — navigasyon hedefi tanımlanmamış. Herhangi bir şehirde turist için yerel etkinlikler son derece değerli — konser, festival, açık hava pazarı. "Events" butonu kulağa çok mantıklı geliyor, yani kullanıcı kesinlikle tıklayacak. Var olmayan bir ekrana yönlendiren bir buton, en ciddi UX hatalarından biridir.

**Çözüm:** Ya EventsScreen oluştur ve bir gerçek veri kaynağına bağla (Eventbrite API, Meetup veya şehir bazlı events feed), ya da bu Quick Action'ı kaldır veya var olan bir ekranla değiştir.

---

### ✅ 2.2 — TripHistory: Navigasyonda Var, Giriş Noktası Yok

> **Düzeltildi:** `ProfileScreen.tsx` → Account Settings bölümüne "Trip History" satırı eklendi. `profile.tripHistory` key'i `en.json` ve `tr.json`'a eklendi.

**Dosya:** `src/screens/TripHistoryScreen.tsx`  
**Navigator'da:** Var  
**Ana tab'lardan veya profile'dan erişim:** Yok

**Neden Mantıksız?**  
Geçmiş gezilerin listesi büyük bir feature — hem nostaljik (nereye gitmiştim?) hem de pratik (o rotayı tekrar kullanayım). Ekran yapılmış, navigator'a eklenmiş ama hiçbir yerden bu ekrana giden bir yol yok. Kullanıcının göremeyeceği bir özellik, kullanıcı için mevcut değil demektir.

**Çözüm:** Profile > Account Settings altına "Trip History" eklenmeli ya da Routes tab'ında "Past Trips" section'ı olmalı.

---

### ✅ 2.3 — EmailVerification Akışı: Sonrası Belirsiz

> **Zaten Doğruydu:** `handleVerify()` fonksiyonu incelendiğinde `navigation.navigate('Main')` çağrısının zaten mevcut olduğu görüldü. Ekran sadece explicit `navigate('EmailVerification')` ile açılıyor; OAuth akışı bu ekranı bypass edebilir. Mevcut yapı doğru — ek değişiklik gerekmedi.

**Dosya:** `src/screens/EmailVerificationScreen.tsx`

**Neden Problemli?**  
Kayıt sonrası email doğrulama var. Kullanıcı kodu giriyor — sonra ne oluyor? Main app'e mi geçiyor, Login ekranına mı geri dönüyor? Bu geçiş kodu içinde netleştirilmemiş. Ayrıca Google/Apple ile giriş yapan kullanıcılar bu ekrana hiç uğramamalı ama akışın bunu atlayıp atlamadığı belirsiz. Sosyal login'den gelen kullanıcı email doğrulama ekranında mahsur kalabilir.

**Çözüm:** EmailVerification → doğrulama başarılı → direkt MainApp'e geçiş olmalı. OAuth flow'unda bu ekran tamamen bypass edilmeli.

---

### ✅ 2.4 — Belen AI Rotası → Routes Tab'ına Kayıt: Köprü Yok

> **Kısmen Düzeltildi:** `BelenScreen.tsx` → `RouteCardView` bileşenine "Save Route" (yer imi ikonu + metin) butonu eklendi. Tıklandığında Alert confirmation gösteriyor. Gerçek Routes state'ine yazma API entegrasyonuna bağlı — o kısım roadmap'te kalıyor.

**Dosyalar:** `BelenScreen.tsx`, `RoutesScreen.tsx`

**Neden Kötü UX?**  
Belen AI bir rota öneriyor, kullanıcı "harika!" diyor. Peki bu rotayı Routes tab'ına kaydedebiliyor mu? Mevcut akışta Belen'de görünen "route cards"ın Routes ekranına nasıl geçeceği tanımlanmamış. Kullanıcı AI'dan aldığı öneriyi elle tekrar mı oluşturmak zorunda?

**Çözüm:** Belen'deki route card'ların "Save to My Routes" butonu olmalı. Tıklandığında o rota direkt Routes tab'ına eklenmeli ve kullanıcıya bir confirmation toast gösterilmeli.

---

### ✅ 2.5 — WeatherDetail: Giriş Noktası Yok

> **Zaten Vardı:** `HomeScreen.tsx` incelendiğinde header'daki hava durumu chip'inin zaten `navigation.navigate('WeatherDetail', { city })` ile bağlı olduğu görüldü. Ekstra bir değişiklik gerekmedi.

**Dosya:** `src/screens/WeatherDetailScreen.tsx`  
**Home ekranında hava durumu widget'ı:** Veri modeline yansımamış

**Neden Problemli?**  
WeatherDetail ekranı var ama Home ekranında tıklanabilir bir hava durumu widget'ı yok — ne bir bileşen var ne de bu ekrana giden bir navigasyon bağlantısı kurulmuş. Kullanıcı hava durumu detaylarına ulaşamıyor.

**Çözüm:** Home header'ına veya hero section'a mini weather widget eklenmeli; tıklandığında WeatherDetailScreen açılmalı. 5 günlük tahmin + seyahat tavsiyeleri gösterilmeli ("Heavy rain Thursday — consider indoor alternatives").

---

### ✅ 2.6 — OngoingJourneyCard: Rota Yokken Ne Gösteriyor?

> **Düzeltildi:** `HomeScreen.tsx`'e `isActive` koşullu render eklendi. Aktif rota yoksa kart yerine "Start a Journey" CTA bileşeni gösteriliyor ve `CreateRoute` ekranına yönlendiriyor. İlgili i18n key'leri eklendi.

**Dosya:** `src/components/OngoingJourneyCard/OngoingJourneyCard.tsx`  
**Home ekranında:** Her zaman gösteriliyor

**Neden Problemli?**  
OngoingJourneyCard bileşeninin empty state'i tanımlanmamış. Kullanıcının aktif bir rotası yoksa ne gösterilecek? Bileşen her koşulda render ediliyor ama "aktif rota yok" durumu için ne bir UI tasarımı ne de bir koşullu mantık var. Yeni kayıt olan kullanıcı ilk ana ekranı açtığında bu section'ı görmesi kafa karıştırıcı.

**Çözüm:** Aktif rota yoksa bu section ya tamamen gizlenmeli ya da "Start a new journey" CTA'sına dönüşmeli. Kullanıcıyı rota oluşturmaya yönlendiren bir onboarding nudge olmalı.

---

## BÖLÜM 3 — GEREKSİZ SÜRTÜNME (Seyahat Halindeki Turistin Düşmanı)

---

### ✅ 3.1 — Kayıt Formu: "Full Name" vs Edit Profile: "Name" + "Surname"

> **Düzeltildi:** `RegisterScreen.tsx` içindeki tek `fullName` alanı, yan yana iki input'a (`firstName` + `lastName`) bölündü. `auth.nameLabel/namePlaceholder/surnameLabel/surnamePlaceholder` key'leri `en.json` ve `tr.json`'a eklendi.

**Register:** `fullNameLabel → "Full Name"` (tek alan)  
**EditProfile:** Ayrı `Name` ve `Surname` alanları

**Neden Sürtünme?**  
Kullanıcı kaydolurken "Full Name" giriyor. Profil düzenlemeye gittiğinde "Name" ve "Surname" ayrı ayrı gösteriliyor. Hangi değer name'e, hangisi surname'e bölünecek? Eğer backend "John Doe" → `name: "John"`, `surname: "Doe"` diye parse ediyorsa, çift isimli kişiler ("Mary Jane") hatalı ayrıştırılıyor. Bu bir veri tutarsızlığı.

**Çözüm:** Kayıt formundan itibaren Name ve Surname ayrı alanlara bölünmeli. Tek alan tek modal; tek form tutarsızlığı tek uyumsuzluk.

---

### 3.2 — Konum İzni: Yanlış Zamanda İsteniyor

**Dosya:** `src/screens/LocationSettingsScreen.tsx`  
**Explore ve Home:** Konum gerektiriyor ama izin akışı settings'e gömülü

**Neden Sürtünme?**  
Kullanıcı "Nearby Gems"e bakmak istediğinde veya Explore'da haritayı açtığında konum izni gerekiyor. Ama izin sistemi ayrı bir `LocationSettingsScreen`'e gömülmüş. Kullanıcının konum izni vermesi için Profile > Location Settings'e gitmesi gerekiyor. Bu yolculuk çok uzun. Seyahat halindeki biri "yakınımdaki yerleri göster" derken 4 adım yapmamalı.

**Çözüm:** İlk konum gerektiren eylemde (Explore açıldığında, "Nearby" tıklandığında) native permission dialog'u inline tetiklenmeli. Settings ekranı sadece izni değiştirmek isteyenler için secondary bir yer olmalı.

---

### ✅ 3.3 — SearchResults Ekranı: Explore'un Üstüne Ekstra Ekran

> **Düzeltildi:** `ExploreScreen.tsx`'te `onSubmitEditing → SearchResultsScreen` navigasyonu kaldırıldı. Arama artık tamamen inline çalışıyor: search bar'a focus olununca veya metin girilince `isSearchMode` aktif olur → Trending bölümü gizlenir → sonuçlar canlı filtrelenir → başlık "Results for 'query'" olarak güncellenir → "Cancel" butonu ile arama modu kapatılır. Ayrı SearchResultsScreen'e gerek kalmadı.

---

### ✅ 3.4 — Rota Oluşturma: Minimum Veri Bile Fazla Adım

> **Kısmen Düzeltildi:** `CreateRouteScreen.tsx`'e formun üstüne "Plan with AI" banner'ı eklendi. Tıklandığında `BelenScreen`'e yönlendiriyor. Mevcut form da geçerliliğini koruyor — AI yolunu tercih etmeyenler için.

**Dosya:** `src/screens/CreateRouteScreen.tsx`

**Neden Sürtünme?**  
Routes tab'ından "Create New Route" → ayrı ekran açılıyor. Bu ekranda: rota adı, başlangıç noktası, duraklar, süre. Hepsi ayrı input. Sokaktaki bir turist "hızlıca otelden müzeye bir rota çizeyim" istediğinde form doldurma ritüeliyle karşılaşmamalı.

**Çözüm:** Quick route: Sadece başlangıç ve bitiş noktası al, rotayı AI otomatik oluştursun. Detayları sonradan düzenleme imkânı ver. "Belen'e sor" kısayolu CreateRoute ekranında prominent olmalı.

---

## BÖLÜM 4 — EKSİK TURİZM REFLEKSLERİ

---

### ✅ 4.1 — Acil Durum ve Güvenlik: Tamamen Yok

> **Kısmen Düzeltildi:** `HelpCenterScreen.tsx`'e "Emergency & Safety" accordion bölümü eklendi. 5 bölgeye ait acil numara (112/EU, 911/USA, 999/UK, 000/AU, 110/JP) listelenmiş; her satır `Linking.openURL` ile direkt arama yapabiliyor. Güvenlik ipuçları (pasaport kopyası, büyükelçilik, acil nakit) static içerik olarak eklendi. Şehre göre dinamik içerik API'ye bağlı — roadmap'te kalıyor.

**Neden Kritik Eksik?**  
Hiçbir gerçek turizm uygulaması acil durum bilgileri olmadan tamamlanmış sayılmaz. Kaybolma, hırsızlık, hastalık — bunlar turistin hayatında olur. Global bir uygulamada kullanıcının bulunduğu şehrin acil hattı, en yakın hastane, kendi ülkesinin büyükelçiliği kritik bilgilerdir. Uygulama bu anlarda suskunsa kullanıcı o an rakip uygulamaya ya da Google'a geçiyor.

**Çözüm:** HelpCenter'a ya da Profile'a "Emergency" bölümü eklenmeli. İçerik seçilen şehre/ülkeye göre dinamik olmalı: yerel acil hatlar (112, 911, vb.), en yakın hastane (konum bazlı), kullanıcının vatandaşlığına göre büyükelçilik bilgisi, kayıp eşya prosedürü.

---

### 4.2 — Toplu Taşıma Entegrasyonu: Sıfır

**Neden Kritik Eksik?**  
Dünyanın her şehrinde turist için toplu taşıma bilgisi hayat kurtarır. Otobüs, metro, tramvay — bunlar olmadan turist ya pahalı taksi kullanır ya da kaybolur. Mevcut Navigation ekranı var ama sadece adım adım yürüme/sürüş tarifi gibi görünüyor. "Bunu toplu taşımayla nasıl yapabilirim?" sorusu tamamen cevaplanmıyor.

**Çözüm:** PlaceDetail ekranına "How to Get Here" section'ı eklenmeli: yürüme süresi, toplu taşıma seçeneği (Google Maps Directions API veya Transit API ile şehre göre dinamik), taksi tahmini, bisiklet paylaşımı. Seçilen şehre göre otomatik adapte olmalı.

---

### 4.3 — İlgi Alanı Verileri: Toplanıyor, Hiç Kullanılmıyor

*(Bkz. Bölüm 1.6 — budget/style için de aynı sorun)*

Ayrıca şu spesifik turizm refleksi eksik: **Dinamik kişiselleştirme**. Kullanıcı "Gastronomi" ilgisini seçti → Home ekranındaki hero card restoran olmalı, Explore'un ilk filter chip'i "Food" seçili gelmeli, Belen "Looking for the best local food spots?" diye başlamalı.

---

### 4.4 — Çok Günlü Gezi Planlama: Yok

**Neden Eksik?**  
Routes tab'ında haftalık bir takvim şeridi var (7 gün). Bu çok günlü planlama vaadi veriyor ama ekran sadece "Today's Plan" gösteriyor. Perşembeye tıklasan Perşembe için plan görmek yerine muhtemelen aynı ekran kalıyor. 

Herhangi bir şehri ziyaret eden ortalama turist 3-5 gün kalıyor. Gün 1: Tarihi merkez. Gün 2: Müze turu. Gün 3: Yerel mahalle keşfi. Bu günlük planlama altyapısı tamamen yok.

**Çözüm:** Takvim şeridindeki her güne rota atanabilmeli. "Day 1", "Day 2" modeli. Belen AI "buraya 4 gün geliyor musun? Sana 4 günlük plan yapayım" sunmalı.

---

### ✅ 4.5 — Offline Maps: Rotalar İndirilebiliyor ama Harita İndirilemiyor

> **Kısmen Düzeltildi:** `OfflineRoutesScreen.tsx`'e ekranın üstüne sarı uyarı banner'ı eklendi: "Offline map tiles are coming soon. Currently only route data is saved." Kullanıcıya dürüstçe bilgi veriliyor; harita tile indirme özelliği roadmap'te kalıyor.

**Dosya:** `src/screens/OfflineRoutesScreen.tsx`

**Neden Mantıksız?**  
Rotayı offline kaydedebiliyorsun ama harita karesini indiremiyorsun. İnternetsiz ortamda rota listesini görmek ne işe yarar? Durakları gösteren harita yoksa navigasyon körleşiyor. Bu özellik yarım bırakılmış.

**Çözüm:** Offline rota indirmesi harita tile'larını da kapsamalı. Ya da açıkça "Bu özellik yakında" diye belirtilmeli. Var olmayan bir özellik var gibi sunmak güven kırıcı.

---

### 4.6 — Para Birimi Ayarı: Tamamen Boşta

**Dosya:** `src/screens/CurrencySettingsScreen.tsx`

**Neden Mantıksız?**  
Kullanıcı para birimi seçiyor (EUR, TRY, USD vb.) ama uygulama içinde hiçbir yerde gerçek fiyat gösterilmiyor. Explore ekranındaki mekanlarda `price` field'ı "$$$" gibi sembollerle gösteriliyor — bu dolar göstergesi değil fiyat seviyesi. Gerçek para birimi dönüşümü yok. Kullanıcı TRY seçse bile herhangi bir mekanın girişinin kaç lira olduğunu göremez.

**Çözüm:** Ya bu ayarı kaldır (işe yaramayan bir ayar UX'i kirletiyor), ya da gerçek fiyat verisi + döviz kuru entegrasyonu ekle.

---

### 4.7 — Sosyal/Grup Seyahat: Tek Kişilik Deneyim

**Neden Eksik?**  
"Travel Style: Group/Family" ayarı var ama grup içi bir özellik yok. Gerçek turizm senaryosunda: arkadaşınla geliyorsun, rotayı paylaşıyorsun, kim nerede buluşacak? Konum paylaşımı? "Meet here at 3pm" pin'i? Bunların hiçbiri yok. ShareRoute ekranı var ama static link paylaşımı.

**Çözüm:** Minimum viable social: RouteDetail'de "Share with Companion" → Whatsapp/iMessage deep link ile rota paylaş. Belen'de "Plan a trip for 2" prompt'u. Grup modunda family-friendly filtresi otomatik devreye girsin.

---

### ✅ 4.8 — "Open Now" Göstergesi: UI Bileşeni Hiç Yok

> **Düzeltildi:** `PlaceDetailScreen.tsx`'e `checkIsOpen()` fonksiyonu ve dinamik renk kodlu (yeşil/kırmızı) "Open Now / Closed" badge bileşeni eklendi. Gerçek API verisi geldiğinde saatleri parametre olarak alacak şekilde yapılandırıldı.

**Neden Kritik?**  
PlaceDetail ekranında çalışma saatleri gösteriliyor ama "şu an açık mı?" sorusunu anlık yanıtlayan bir UI bileşeni yok. "Open Now" badge'i, "Closes in 45 min" uyarısı, ya da "Closed today" durumu için tasarlanmış hiçbir element yok. Turist bir yere gitmeden önce açık olup olmadığını tek bakışta anlamalı — bu PlaceDetail'in en kritik bilgisidir.

**Çözüm:** PlaceDetail'e açık/kapalı durumunu gösteren belirgin bir badge bileşeni eklenmeli. Renk kodu: yeşil = açık, kırmızı = kapalı, sarı = yakında kapanıyor. "Closes in 45 min" gibi uyarılar aksiyona yönlendirmeli.

---

## BÖLÜM 5 — KÜÇÜK AMA KÜMÜLATİF UX SORUNLARI

| # | Sorun | Yer | Önerilen Düzeltme |
|---|-------|-----|-------------------|
| 5.1 | ~~Kod adının versiyon etiketi olarak gösterilmesi~~ **✅ Düzeltildi** | Profile altı | `profile.version` → "Version 1.0.0" / "Sürüm 1.0.0" olarak güncellendi |
| 5.2 | ~~`"Traveler"` profil alt başlığı~~ **✅ Düzeltildi** | ProfileScreen | `profile.placesVisited` key'i eklendi; "45 places visited" / "45 yer ziyaret edildi" gösteriliyor |
| 5.3 | ~~SeeAll ekranı her data tipi için kullanılıyor~~ **✅ Düzeltildi** | SeeAllScreen | `type === 'trending'` → büyük hero image card; diğer tipler → compact horizontal card |
| 5.4 | MapFull vs NavigationScreen: ikisi ne zaman açılıyor? | Navigator | MapFull = statik harita görünümü, NavigationScreen = aktif navigasyon olarak netleştirilmeli; geçiş kriterleri belirsiz |
| 5.5 | ~~Onboarding'de şehir seçimi yok~~ **✅ Düzeltildi** | OnboardingScreen | 4. slayt sonrasına şehir seçim adımı eklendi; seçilen şehir `setLocationName` ile Redux'a kaydediliyor |
| 5.6 | ~~Reviews ayrı ekran ama PlaceDetail'den erişim nasıl?~~ **✅ Zaten Vardı** | PlaceDetailScreen | `PlaceDetailScreen.tsx` footer'ında "Reviews" butonu zaten mevcut — `navigation.navigate('Reviews')` bağlı |
| 5.7 | ~~`"Ask me anything..."` Belen placeholder'ı~~ **✅ Düzeltildi** | BelenScreen | Placeholder → "What would you like to explore?" / "Ne keşfetmek istersiniz?" |
| 5.8 | ~~Onboarding'i atlayınca tercihlere ne oluyor?~~ **✅ Düzeltildi** | OnboardingScreen | Skip → `setLocationName('Paris')` dispatch edilip Login'e geçiliyor; başlangıç şehri atanıyor |

---

## ÖZET: ÖNCELİKLİ DÜZELTME LİSTESİ

### Kırmızı (Kritik — Hemen Düzelt)
1. ✅ ~~**"Sultanahmet" placeholder'ını kaldır**~~ — `CreateRouteScreen`, `BelenScreen`, `NavigationScreen` düzeltildi
2. ✅ ~~**Events Quick Action için ekran yap veya butonu kaldır**~~ — Explore'a yönlendiriyor (crash giderildi)
3. ✅ ~~**`fmtMin` fonksiyonunu i18n'e bağla**~~ — `units.min/hour` key'leriyle bağlandı

### Sarı (Önemli — Bir Sonraki Sprint)
4. **Budget/Interest/TravelStyle tercihlerini Explore ve Belen'e bağla** — toplanan veriyi kullan
5. ✅ ~~**Belen rotasından "Save to Routes" akışı kur**~~ — Save Route butonu eklendi; gerçek Routes state entegrasyonu API'ye bağlı
6. ✅ ~~**TripHistory ve WeatherDetail için giriş noktası ekle**~~ — TripHistory Profile'a eklendi; WeatherDetail zaten bağlıydı
7. **CurrencySettings'i kaldır ya da gerçek fiyat verisiyle besle**

### Yeşil (Stratejik — Roadmap'e Al)
8. ✅ ~~**Acil durum bilgileri bölümü ekle**~~ — HelpCenter'a Emergency accordion + 5 bölge acil numarası + güvenlik ipuçları eklendi
9. **Çok günlü gezi planlama altyapısı kur** — API gerektirir
10. **Toplu taşıma entegrasyonu (şehre göre dinamik transit API)** — API gerektirir
11. ✅ ~~**PlaceDetail'e "Open Now" badge bileşeni ekle**~~ — `checkIsOpen()` + yeşil/kırmızı badge eklendi

### API/Backend Bağımlı (Şimdilik Roadmap'te)
- **1.6 / 4.3** — Budget, TravelStyle, Interests tercihlerini Explore filtrelerine ve Belen prompt'una bağla
- **1.7** — Premium feature gate'leri (Belen sorgu limiti, offline download, advanced filter)
- **3.2** — Konum iznini ilk kullanımda inline tetikle (native PermissionsAPI)
- ~~**3.3**~~ ✅ — Explore inline arama tamamlandı
- **4.2** — Toplu taşıma / Transit API entegrasyonu
- **4.4** — Çok günlü gezi planlama (gün bazlı rota atama)
- **4.6** — CurrencySettings gerçek fiyat verisi + döviz kuru
- **4.7** — Sosyal/grup özellikler (companion sharing, WhatsApp deep link)

---

*Bu rapor, uygulamanın mevcut kodunun doğrudan incelenmesiyle hazırlanmıştır. Her eleştiri, belirli dosya ve ekranlardan alınan somut örneklere dayanmaktadır.*
