# Backend Requirements & API Documentation

**Proje:** Toronto Turizm Asistanı — React Native CLI  
**Analiz Tarihi:** 20 Nisan 2026  
**Analiz Kaynağı:** Frontend kaynak kodu (tüm ekranlar, Redux slice'ları, servis katmanı, TypeScript tipleri ve mock veriler)

---

## İçindekiler

1. [Genel Mimari ve Teknik Gereksinimler](#1-genel-mimari-ve-teknik-gereksinimler)
2. [Veritabanı Modelleri](#2-veritabanı-modelleri)
3. [Authentication ve Güvenlik](#3-authentication-ve-güvenlik)
4. [API Endpoint Dokümantasyonu](#4-api-endpoint-dokümantasyonu)
5. [AI Asistan (Belen) Entegrasyonu](#5-ai-asistan-belen-entegrasyonu)
6. [Üçüncü Parti Entegrasyonlar ve Business Logic](#6-üçüncü-parti-entegrasyonlar-ve-business-logic)
7. [Push Notification Sistemi](#7-push-notification-sistemi)
8. [Premium / Subscription Sistemi](#8-premium--subscription-sistemi)

---

## 1. Genel Mimari ve Teknik Gereksinimler

### Base URL

```
https://api.yourbackend.com
```

Tüm endpoint'ler `/api/v1/` prefix'i ile başlamalı.

### Ortak Response Yapısı

Tüm endpoint'ler aşağıdaki zarfı kullanmalı:

```json
// Başarılı
{
  "success": true,
  "data": { ... },
  "message": "OK"
}

// Hatalı
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already in use.",
    "details": { ... }   // opsiyonel
  }
}
```

### Ortak HTTP Hata Kodları

| Kod | Anlam |
|-----|-------|
| `400` | Geçersiz istek / validasyon hatası |
| `401` | Token yok veya geçersiz |
| `403` | Yetki yok (kaynak başka kullanıcıya ait) |
| `404` | Kaynak bulunamadı |
| `409` | Çakışma (ör: email zaten kayıtlı) |
| `422` | İş mantığı hatası |
| `429` | Rate limit aşıldı |
| `500` | Sunucu hatası |

### Sayfalama (Pagination)

Liste döndüren tüm endpoint'lerde:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 143,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 2. Veritabanı Modelleri

Frontend TypeScript tipleri, mock JSON verileri ve ekran analizinden çıkarılmıştır.

---

### 2.1 User

```
users
├── id                UUID / Auto-increment PK
├── name              VARCHAR(100) NOT NULL
├── surname           VARCHAR(100) NOT NULL
├── username          VARCHAR(50) UNIQUE NOT NULL
├── email             VARCHAR(255) UNIQUE NOT NULL
├── password_hash     VARCHAR(255)          -- null → sosyal giriş
├── photo             TEXT                  -- CDN URL (opsiyonel)
├── is_email_verified BOOLEAN DEFAULT false
├── is_premium        BOOLEAN DEFAULT false
├── premium_expires_at TIMESTAMP NULL
├── travel_style      ENUM('solo','couple','family','group') NULL
├── budget_level      ENUM('budget','mid','luxury') NULL
├── interests         TEXT[]                -- ['gastronomy','history','art',...]
├── preferred_currency VARCHAR(3) DEFAULT 'USD'
├── language          VARCHAR(5) DEFAULT 'en'
├── push_token        TEXT NULL             -- FCM / APNs token
├── created_at        TIMESTAMP DEFAULT NOW()
└── updated_at        TIMESTAMP DEFAULT NOW()
```

---

### 2.2 Place (Mekan)

```
places
├── id              UUID PK
├── name            VARCHAR(255) NOT NULL
├── slug            VARCHAR(255) UNIQUE
├── category        ENUM('museum','historic','restaurant','shopping','nature','landmark','nightlife','cruise','other')
├── description     TEXT
├── address         TEXT
├── city            VARCHAR(100)
├── country         VARCHAR(100)
├── latitude        DECIMAL(10,7)
├── longitude       DECIMAL(10,7)
├── rating          DECIMAL(3,2) DEFAULT 0        -- hesaplanan ortalama
├── review_count    INT DEFAULT 0
├── price_level     ENUM('free','$','$$','$$$','$$$$') NULL
├── tags            TEXT[]                          -- ['Museum','Historic','Art',...]
├── image_url       TEXT
├── is_family_friendly BOOLEAN DEFAULT false
├── hours           JSONB                           -- {"mon_fri":"09:00-22:00","sat":"10:00-23:00","sun":"10:00-21:00"}
├── phone           VARCHAR(50) NULL
├── website         TEXT NULL
├── is_active       BOOLEAN DEFAULT true
├── created_at      TIMESTAMP DEFAULT NOW()
└── updated_at      TIMESTAMP DEFAULT NOW()
```

---

### 2.3 Review

```
reviews
├── id          UUID PK
├── place_id    UUID FK → places.id
├── user_id     UUID FK → users.id
├── rating      SMALLINT CHECK(1..5) NOT NULL
├── text        TEXT NOT NULL
├── helpful_count INT DEFAULT 0
├── created_at  TIMESTAMP DEFAULT NOW()
└── updated_at  TIMESTAMP DEFAULT NOW()

review_helpfuls                          -- hangi kullanıcı helpful dedi
├── review_id   UUID FK → reviews.id
├── user_id     UUID FK → users.id
└── PRIMARY KEY (review_id, user_id)
```

---

### 2.4 Bookmark (Kaydedilen Yer)

```
bookmarks
├── id          UUID PK
├── user_id     UUID FK → users.id
├── place_id    UUID FK → places.id
├── saved_at    TIMESTAMP DEFAULT NOW()
└── UNIQUE (user_id, place_id)
```

---

### 2.5 Route (Rota)

```
routes
├── id              UUID PK
├── user_id         UUID FK → users.id
├── name            VARCHAR(255) NOT NULL
├── notes           TEXT NULL
├── status          ENUM('draft','active','completed','archived') DEFAULT 'draft'
├── total_duration  INT NULL           -- dakika cinsinden
├── total_distance  DECIMAL(8,2) NULL  -- km cinsinden
├── share_token     VARCHAR(64) UNIQUE NULL
├── is_ai_generated BOOLEAN DEFAULT false
├── created_at      TIMESTAMP DEFAULT NOW()
└── updated_at      TIMESTAMP DEFAULT NOW()

route_stops
├── id          UUID PK
├── route_id    UUID FK → routes.id
├── place_id    UUID FK → places.id NULL   -- bilinen mekan ise
├── name        VARCHAR(255) NOT NULL       -- custom stop veya mekan adı
├── description TEXT NULL
├── duration    INT NULL                    -- bu durakta geçirilecek süre (dk)
├── order_index INT NOT NULL
├── status      ENUM('upcoming','active','completed') DEFAULT 'upcoming'
└── created_at  TIMESTAMP DEFAULT NOW()
```

---

### 2.6 TripHistory (Tamamlanan Rotalar)

```
trip_history
├── id          UUID PK
├── user_id     UUID FK → users.id
├── route_id    UUID FK → routes.id NULL
├── name        VARCHAR(255) NOT NULL
├── date        DATE NOT NULL
├── duration    VARCHAR(20)         -- "2h 15m"
├── distance    DECIMAL(8,2)        -- km
├── stop_count  INT
├── rating      SMALLINT NULL       -- kullanıcının gezi sonrası verdiği puan (1-5)
└── created_at  TIMESTAMP DEFAULT NOW()
```

---

### 2.7 Notification

```
notifications
├── id          UUID PK
├── user_id     UUID FK → users.id
├── type        ENUM('route','suggestion','reminder','system')
├── title       VARCHAR(255) NOT NULL
├── body        TEXT NOT NULL
├── is_read     BOOLEAN DEFAULT false
├── action_type VARCHAR(50) NULL     -- 'navigate_route', 'navigate_place', vb.
├── action_payload JSONB NULL        -- { routeId: "..." } veya { placeId: "..." }
├── created_at  TIMESTAMP DEFAULT NOW()
└── expires_at  TIMESTAMP NULL
```

---

### 2.8 OfflineRoute

```
offline_routes
├── id              UUID PK
├── user_id         UUID FK → users.id
├── route_id        UUID FK → routes.id
├── downloaded_at   TIMESTAMP DEFAULT NOW()
├── file_size_mb    DECIMAL(6,2)
└── expires_at      TIMESTAMP NULL        -- premium kullanıcılar için sınırsız
```

---

### 2.9 PremiumSubscription

```
premium_subscriptions
├── id              UUID PK
├── user_id         UUID FK → users.id
├── plan            ENUM('monthly','annual')
├── status          ENUM('active','cancelled','expired')
├── price_paid      DECIMAL(10,2)
├── currency        VARCHAR(3) DEFAULT 'USD'
├── started_at      TIMESTAMP
├── expires_at      TIMESTAMP
├── provider        ENUM('apple','google','stripe') NULL
├── provider_sub_id TEXT NULL              -- App Store / Play Store sub ID
└── created_at      TIMESTAMP DEFAULT NOW()
```

---

## 3. Authentication ve Güvenlik

### 3.1 Auth Akışı

```
Kayıt Akışı:
  POST /auth/register → { user, accessToken, refreshToken }
    └─ Email doğrulama kodu gönderilir
  POST /auth/verify-email → { verified: true }
    └─ Main App'e geçiş

Giriş Akışı:
  POST /auth/login → { user, accessToken, refreshToken }
    └─ Main App'e geçiş

Sosyal Giriş Akışı:
  POST /auth/social → { user, accessToken, refreshToken }
    └─ Email doğrulama bypass (provider zaten doğrulamış)

Şifre Sıfırlama:
  POST /auth/forgot-password → { message: "Code sent" }
  POST /auth/reset-password → { message: "Password updated" }

Token Yenileme (frontend'deki interceptor'a göre):
  POST /auth/refresh → { accessToken }
    └─ 401 alındığında otomatik tetiklenir
    └─ Başarısız → clearUser() + Login'e yönlendir
```

### 3.2 Token Stratejisi

- **Access Token:** JWT, 15 dakika TTL, `Authorization: Bearer <token>` header'ında
- **Refresh Token:** Opaque token, 30 gün TTL, MMKV storage'de `refreshToken` key'i ile saklanır
- Refresh token rotation uygulanmalı (yenilenince eski geçersiz olur)
- Tüm korumalı endpoint'ler `Authorization` header'ını zorunlu kılar

### 3.3 JWT Payload

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "is_premium": false,
  "iat": 1713600000,
  "exp": 1713600900
}
```

### 3.4 Sosyal Giriş (SocialLogins bileşeninden)

Frontend'de Google ve Apple giriş butonları mevcut. Backend'de:
- Google OAuth2 ID token doğrulaması (`google-auth-library`)
- Apple Sign In token doğrulaması (`apple-signin-auth`)
- Her iki durumda da hesap yoksa otomatik kayıt, varsa giriş yapılır

---

## 4. API Endpoint Dokümantasyonu

---

### 4.1 Authentication

---

#### `POST /api/v1/auth/register`

**Açıklama:** Yeni kullanıcı kaydı. `RegisterScreen.tsx` içindeki "Create Account" butonuna bağlı.

**Request:**
```json
// Body
{
  "name": "Jane",
  "surname": "Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "min8chars"
}
```

**Response — 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane",
      "surname": "Doe",
      "username": "janedoe",
      "email": "jane@example.com",
      "photo": "",
      "is_email_verified": false
    },
    "accessToken": "eyJ...",
    "refreshToken": "rt_..."
  }
}
```

**Hata Yanıtları:**
- `409` — Email veya username zaten kayıtlı
- `400` — Validasyon hatası (şifre çok kısa, email formatı yanlış vb.)

---

#### `POST /api/v1/auth/login`

**Açıklama:** Email/şifre ile giriş. `LoginScreen.tsx` "Login" butonuna bağlı.

**Request:**
```json
{
  "email": "jane@example.com",
  "password": "min8chars"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane",
      "surname": "Doe",
      "username": "janedoe",
      "email": "jane@example.com",
      "photo": "",
      "is_premium": false
    },
    "accessToken": "eyJ...",
    "refreshToken": "rt_..."
  }
}
```

**Hata Yanıtları:**
- `401` — Geçersiz email veya şifre
- `403` — Email doğrulanmamış

---

#### `POST /api/v1/auth/social`

**Açıklama:** Google / Apple ile giriş. `SocialLogins.tsx` bileşeninden tetiklenir.

**Request:**
```json
{
  "provider": "google",         // "google" | "apple"
  "id_token": "google-id-token-string"
}
```

**Response — 200 / 201:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "rt_...",
    "is_new_user": true         // true → yeni kayıt, false → giriş
  }
}
```

---

#### `POST /api/v1/auth/refresh`

**Açıklama:** Access token yenileme. `src/services/api.ts` interceptor'ı 401 hatası aldığında otomatik çağırır.

**Request:**
```json
{
  "refreshToken": "rt_..."
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "rt_new..."   // rotation: yeni refresh token
  }
}
```

**Hata Yanıtları:**
- `401` — Geçersiz veya süresi dolmuş refresh token → frontend clearUser() çağırır

---

#### `POST /api/v1/auth/forgot-password`

**Açıklama:** Şifre sıfırlama kodu gönderir. `ForgotPasswordScreen.tsx` "Send Reset Link" butonuna bağlı.

**Request:**
```json
{
  "email": "jane@example.com"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "message": "Reset code sent to your email."
  }
}
```

**Not:** Email yoksa da aynı mesaj döndür (kullanıcı numaralandırmayı önlemek için).

---

#### `POST /api/v1/auth/reset-password`

**Açıklama:** Yeni şifre belirler. `ResetPasswordScreen.tsx` "Reset Password" butonuna bağlı.

**Request:**
```json
{
  "email": "jane@example.com",
  "code": "482910",
  "new_password": "newPass123"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "message": "Password updated successfully."
  }
}
```

**Hata Yanıtları:**
- `400` — Kod geçersiz veya süresi dolmuş
- `400` — Şifre minimum uzunluğu sağlamıyor

---

#### `POST /api/v1/auth/verify-email`

**Açıklama:** 6 haneli doğrulama kodunu onaylar. `EmailVerificationScreen.tsx` "Verify" butonuna bağlı.

**Request:**
```json
{
  "email": "jane@example.com",
  "code": "482910"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "user": { ... },
    "accessToken": "eyJ..."
  }
}
```

**Hata Yanıtları:**
- `400` — Hatalı kod veya süresi dolmuş

---

#### `POST /api/v1/auth/resend-code`

**Açıklama:** Email doğrulama kodunu yeniden gönderir. `EmailVerificationScreen.tsx` "Resend" bağlantısına bağlı.

**Request:**
```json
{
  "email": "jane@example.com"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": { "message": "Code resent." }
}
```

**Rate Limit:** Aynı email için 60 saniyede 1 istek

---

#### `POST /api/v1/auth/change-password`

**Açıklama:** Giriş yapmış kullanıcı şifresi değiştirme. `ChangePasswordScreen.tsx` "Update Password" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "current_password": "oldPass",
  "new_password": "newPass123"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": { "message": "Password changed successfully." }
}
```

**Hata Yanıtları:**
- `401` — Mevcut şifre yanlış
- `400` — Yeni şifre minimum 8 karakter değil

---

### 4.2 User (Kullanıcı Profili)

---

#### `GET /api/v1/users/me`

**Açıklama:** Giriş yapmış kullanıcının profil bilgileri. `ProfileScreen.tsx` ve `EditProfileScreen.tsx` sayfa yüklenişinde çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Jane",
    "surname": "Doe",
    "username": "janedoe",
    "email": "jane@example.com",
    "photo": "https://cdn.example.com/photos/uuid.jpg",
    "is_premium": false,
    "premium_expires_at": null,
    "travel_style": "solo",
    "budget_level": "mid",
    "interests": ["history", "gastronomy"],
    "preferred_currency": "USD",
    "language": "en",
    "stats": {
      "total_routes": 12,
      "places_visited": 45,
      "cities_explored": 3
    }
  }
}
```

---

#### `PUT /api/v1/users/me`

**Açıklama:** Profil güncelleme. `EditProfileScreen.tsx` "Save Changes" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Jane",
  "surname": "Smith",
  "email": "janesmith@example.com"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Jane",
      "surname": "Smith",
      "email": "janesmith@example.com",
      "photo": "..."
    }
  }
}
```

**Hata Yanıtları:**
- `409` — Email zaten başka kullanıcı tarafından kullanılıyor

---

#### `PUT /api/v1/users/me/photo`

**Açıklama:** Profil fotoğrafı yükleme. `EditProfileScreen.tsx` ve `ProfileScreen.tsx` kamera butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Request:**
```
FormData:
  photo: <file>       -- image/jpeg, image/png, max 5MB
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "photo_url": "https://cdn.example.com/photos/uuid.jpg"
  }
}
```

---

#### `PUT /api/v1/users/me/preferences`

**Açıklama:** Seyahat tercihleri güncelleme. `InterestsScreen.tsx`, `BudgetSettingsScreen.tsx`, `TravelStyleScreen.tsx` ekranlarının "Save" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "travel_style": "family",
  "budget_level": "mid",
  "interests": ["history", "gastronomy", "art"],
  "preferred_currency": "EUR",
  "language": "tr"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": { "message": "Preferences updated." }
}
```

---

#### `PUT /api/v1/users/me/push-token`

**Açıklama:** Push notification token kaydı. Uygulama açılışında veya giriş sonrasında çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "push_token": "ExponentPushToken[...]",
  "platform": "ios"      // "ios" | "android"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": { "message": "Push token registered." }
}
```

---

### 4.3 Places (Mekanlar)

---

#### `GET /api/v1/places/nearby`

**Açıklama:** Yakındaki mekanlar. `HomeScreen.tsx` "Nearby Gems" bölümü, `ExploreScreen.tsx` ve `QuickActions.tsx` "Nearby" butonundan tetiklenir.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
latitude    float   zorunlu    37.9838
longitude   float   zorunlu    23.7275
radius      int     opsiyonel  5000      (metre, default 3000)
category    string  opsiyonel  "museum"
limit       int     opsiyonel  10
```

**Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Hagia Sophia",
      "category": "museum",
      "distance": "0.8 km",
      "rating": 4.9,
      "review_count": 2104,
      "price_level": "$$",
      "image_url": "https://...",
      "is_open": true,
      "tags": ["Museum", "Historic", "Art"]
    }
  ]
}
```

---

#### `GET /api/v1/places/trending`

**Açıklama:** Trend mekanlar. `HomeScreen.tsx` "Trending Today" bölümü ve `ExploreScreen.tsx` "Trending Near You" carousel'ı tarafından çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
city        string  opsiyonel  "istanbul"
limit       int     opsiyonel  10
```

**Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Bosphorus Sunset Cruise",
      "category": "cruise",
      "rating": 4.9,
      "review_count": 1240,
      "price_level": "$45",
      "price_display": "$45",
      "image_url": "https://...",
      "badge": "HOT",
      "placeholder_color": "#0F3460"
    }
  ]
}
```

---

#### `GET /api/v1/places/search`

**Açıklama:** Mekan arama. `ExploreScreen.tsx` search bar'ı ve `SearchResultsScreen.tsx` tarafından çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
query       string  zorunlu    "museum"
category    string  opsiyonel  "historic"
distance    string  opsiyonel  "2km"        ("1km" | "2km" | "5km" | "10km")
min_rating  float   opsiyonel  4.0
prices      string  opsiyonel  "free,$,$$"  (virgülle ayrılmış)
page        int     opsiyonel  1
limit       int     opsiyonel  20
city        string  opsiyonel  "istanbul"
```

**Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Grand Bazaar",
      "category": "shopping",
      "location": "Fatih",
      "rating": 4.5,
      "review_count": 3400,
      "price_level": "free",
      "price_display": "Free",
      "is_liked": false,
      "image_url": "https://...",
      "placeholder_color": "#312E81",
      "distance": "1.2 km"
    }
  ],
  "pagination": { ... }
}
```

---

#### `GET /api/v1/places/:placeId`

**Açıklama:** Mekan detayı. `PlaceDetailScreen.tsx` ekranı açılırken çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Hagia Sophia",
    "category": "museum",
    "description": "A remarkable destination...",
    "address": "Sultan Ahmet, Ayasofya Meydanı No:1",
    "city": "Istanbul",
    "country": "Turkey",
    "latitude": 41.0086,
    "longitude": 28.9802,
    "rating": 4.9,
    "review_count": 2104,
    "price_level": "$$",
    "price_display": "$15",
    "tags": ["Museum", "Historic", "Art", "Culture"],
    "image_url": "https://...",
    "is_family_friendly": true,
    "hours": {
      "mon_fri": "09:00-22:00",
      "saturday": "10:00-23:00",
      "sunday": "10:00-21:00"
    },
    "is_open": true,
    "closes_at": "22:00",
    "phone": "+90 212 522 1750",
    "website": "https://ayasofyacamii.gov.tr",
    "is_bookmarked": false
  }
}
```

**Hata Yanıtları:**
- `404` — Mekan bulunamadı

---

#### `POST /api/v1/places/:placeId/bookmark`

**Açıklama:** Bookmark toggle (ekle/çıkar). `PlaceDetailScreen.tsx` bookmark ikonu ve `ExploreScreen.tsx` kalp ikonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "bookmarked": true,      // true → eklendi, false → çıkarıldı
    "message": "Place saved to bookmarks."
  }
}
```

---

#### `GET /api/v1/places/bookmarks`

**Açıklama:** Kullanıcının kaydettiği mekanlar. `BookmarksSavedScreen.tsx` sayfa yüklenişinde çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
category    string  opsiyonel  "museum"
page        int     opsiyonel  1
limit       int     opsiyonel  20
```

**Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Hagia Sophia",
      "category": "museum",
      "rating": 4.9,
      "location": "Sultanahmet",
      "image_url": "https://...",
      "saved_at": "2025-04-18T10:30:00Z",
      "saved_at_display": "2 days ago"
    }
  ],
  "pagination": { ... }
}
```

---

### 4.4 Reviews

---

#### `GET /api/v1/places/:placeId/reviews`

**Açıklama:** Mekan yorumları. `PlaceDetailScreen.tsx` ve `ReviewsScreen.tsx` ekranlarında çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
page    int  opsiyonel  1
limit   int  opsiyonel  15
sort    string opsiyonel  "recent"   ("recent" | "highest" | "lowest" | "helpful")
```

**Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "author": "Jane D.",
      "initials": "JD",
      "rating": 5,
      "date": "April 10, 2025",
      "text": "Absolutely breathtaking...",
      "helpful_count": 42,
      "is_helpful": false,     // giriş yapmış kullanıcı helpful dedi mi
      "is_mine": false
    }
  ],
  "pagination": { ... },
  "summary": {
    "average_rating": 4.9,
    "total_count": 2104,
    "distribution": { "5": 1850, "4": 180, "3": 50, "2": 15, "1": 9 }
  }
}
```

---

#### `POST /api/v1/places/:placeId/reviews`

**Açıklama:** Yorum ekleme. `ReviewsScreen.tsx` "Submit Review" butonuna ve `PlaceDetailScreen.tsx` yorum formuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "rating": 5,
  "text": "Absolutely amazing place!"
}
```

**Response — 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "author": "Jane D.",
    "initials": "JD",
    "rating": 5,
    "date": "April 20, 2026",
    "text": "Absolutely amazing place!",
    "helpful_count": 0
  }
}
```

**Hata Yanıtları:**
- `409` — Kullanıcı bu mekan için zaten yorum yazdı
- `400` — Yorum metni çok kısa (min 10 karakter)

---

#### `POST /api/v1/reviews/:reviewId/helpful`

**Açıklama:** "Helpful" toggle. `ReviewsScreen.tsx` helpful butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "helpful_count": 43,
    "is_helpful": true
  }
}
```

---

### 4.5 Routes (Rotalar)

---

#### `GET /api/v1/routes`

**Açıklama:** Kullanıcının tüm rotaları. `RoutesScreen.tsx` sayfa yüklenişinde çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
status    string  opsiyonel  "active"   ("draft" | "active" | "completed" | "archived")
page      int     opsiyonel  1
limit     int     opsiyonel  20
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "today_plan": {
      "id": "uuid",
      "name": "Old City Explorer",
      "stops_left": 3,
      "total_stops": 7,
      "duration": "2h 30m",
      "is_active": true,
      "map_image_url": "https://..."
    },
    "saved_routes": [
      {
        "id": "uuid",
        "name": "Bosphorus Highlights",
        "date": "15 OCT",
        "stop_count": 8,
        "duration": "3H 45M",
        "is_completed": false,
        "image_url": "https://...",
        "placeholder_color": "#0F3460"
      }
    ]
  },
  "pagination": { ... }
}
```

---

#### `GET /api/v1/routes/:routeId`

**Açıklama:** Rota detayı. `RouteDetailScreen.tsx` ekranı açılırken çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Historic Peninsula Walk",
    "status": "active",
    "total_stops": 4,
    "completed_stops": 1,
    "progress": 0.25,
    "total_duration": "3.5 h",
    "total_distance": "2.4 km",
    "is_ai_generated": false,
    "stops": [
      {
        "id": "uuid",
        "name": "Hagia Sophia",
        "description": "Iconic Byzantine monument",
        "duration": "45 min",
        "status": "completed",
        "order_index": 0
      },
      {
        "id": "uuid",
        "name": "Blue Mosque",
        "description": "Majestic 17th-century landmark",
        "duration": "40 min",
        "status": "active",
        "order_index": 1
      }
    ]
  }
}
```

---

#### `POST /api/v1/routes`

**Açıklama:** Yeni rota oluşturma. `CreateRouteScreen.tsx` "Create Route" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "My Morning Walk",
  "stops": [
    { "name": "Grand Bazaar", "duration": 45 },
    { "name": "Topkapi Palace", "duration": 60 }
  ],
  "notes": "Optional notes",
  "is_ai_generated": false
}
```

**Response — 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Morning Walk",
    "status": "draft",
    "stops": [ ... ],
    "total_stops": 2,
    "total_duration": null,
    "total_distance": null
  }
}
```

---

#### `PUT /api/v1/routes/:routeId`

**Açıklama:** Rota güncelleme. Durak durumu değişikliği ve rota düzenleme işlemleri için kullanılır.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Updated Route Name",
  "status": "active",
  "stops": [ ... ]
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

---

#### `PUT /api/v1/routes/:routeId/stops/:stopId`

**Açıklama:** Durak durumu güncelleme. `NavigationScreen.tsx` "Next" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "status": "completed"    // "upcoming" | "active" | "completed"
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "stop": { "id": "uuid", "status": "completed" },
    "route_progress": 0.5
  }
}
```

---

#### `DELETE /api/v1/routes/:routeId`

**Açıklama:** Rota silme. `RoutesScreen.tsx` veya `RouteDetailScreen.tsx` içindeki silme aksiyonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": { "message": "Route deleted." }
}
```

---

#### `POST /api/v1/routes/:routeId/share`

**Açıklama:** Rota paylaşım linki oluşturma. `RouteDetailScreen.tsx` share ikonu ve `ShareRouteScreen.tsx` aksiyonlarına bağlı.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "share_url": "toronto-app.com/routes/share/abc123",
    "share_token": "abc123",
    "expires_at": null
  }
}
```

---

#### `GET /api/v1/routes/share/:shareToken`

**Açıklama:** Paylaşılan rotayı görmek için public endpoint. Deep link ile gelinen kullanıcılar için.

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Historic Peninsula Walk",
    "total_stops": 4,
    "total_duration": "3.5 h",
    "total_distance": "2.4 km",
    "stops": [ ... ],
    "shared_by": "Jane D."
  }
}
```

---

#### `POST /api/v1/routes/:routeId/save`

**Açıklama:** AI tarafından önerilen rotayı kullanıcının rota listesine kaydetme. `BelenScreen.tsx` "Save Route" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Response — 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Route saved to your collection."
  }
}
```

---

#### `POST /api/v1/routes/:routeId/download`

**Açıklama:** Rotayı offline kullanım için indirme. `OfflineRoutesScreen.tsx` aksiyonuna bağlı. Premium özellik.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "offline_route_id": "uuid",
    "file_size_mb": 14.3,
    "downloaded_at": "2026-04-20T10:00:00Z",
    "expires_at": null
  }
}
```

**Hata Yanıtları:**
- `403` — Premium gerekli (premium kısıtı kaldırılana kadar)

---

### 4.6 Trip History

---

#### `GET /api/v1/trips`

**Açıklama:** Tamamlanan gezilerin geçmişi. `TripHistoryScreen.tsx` sayfa yüklenişinde çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
page    int  opsiyonel  1
limit   int  opsiyonel  20
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_trips": 4,
      "total_distance_km": 22.0,
      "average_rating": 4.25
    },
    "trips": [
      {
        "id": "uuid",
        "name": "Historic Peninsula Walk",
        "date": "April 10, 2025",
        "duration": "2h 15m",
        "distance_km": 6.2,
        "stop_count": 8,
        "rating": 5
      }
    ]
  },
  "pagination": { ... }
}
```

---

#### `POST /api/v1/trips/:tripId/rating`

**Açıklama:** Tamamlanan gezi için puan verme. `TripHistoryScreen.tsx` yıldız değerlendirmesine bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "rating": 5
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": { "message": "Trip rated." }
}
```

---

### 4.7 Notifications

---

#### `GET /api/v1/notifications`

**Açıklama:** Kullanıcı bildirimleri. `NotificationsScreen.tsx` sayfa yüklenişinde çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
page    int  opsiyonel  1
limit   int  opsiyonel  20
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "unread_count": 2,
    "notifications": [
      {
        "id": "uuid",
        "type": "route",
        "title": "Route Reminder",
        "body": "You have an active route — Historical Sultanahmet Walk.",
        "is_read": false,
        "time": "5m ago",
        "created_at": "2026-04-20T09:55:00Z",
        "action_type": "navigate_route",
        "action_payload": { "routeId": "uuid" }
      }
    ]
  },
  "pagination": { ... }
}
```

---

#### `PUT /api/v1/notifications/:notificationId/read`

**Açıklama:** Bildirimi okundu olarak işaretler. `NotificationsScreen.tsx` bildirime tıklandığında tetiklenir.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": { "is_read": true }
}
```

---

#### `PUT /api/v1/notifications/read-all`

**Açıklama:** Tüm bildirimleri okundu işaretler. `NotificationsScreen.tsx` "Mark All Read" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": { "updated_count": 2 }
}
```

---

### 4.8 Weather

---

#### `GET /api/v1/weather`

**Açıklama:** Şehir hava durumu. `HomeScreen.tsx` hava durumu chip'i ve `WeatherDetailScreen.tsx` tarafından çağrılır. Şu an frontend'de sabit veri (21°C) kullanılıyor.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
city        string  opsiyonel  "Istanbul"
latitude    float   opsiyonel  41.0082
longitude   float   opsiyonel  28.9784
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "city": "Istanbul",
    "current": {
      "temp_c": 21,
      "condition": "Mostly Sunny",
      "icon": "sunny",
      "wind_kmh": 15,
      "humidity_percent": 62,
      "visibility_km": 10,
      "uv_index": 5
    },
    "hourly": [
      { "time": "14:00", "temp_c": 23, "icon": "sunny" },
      { "time": "15:00", "temp_c": 22, "icon": "partly_cloudy" },
      { "time": "16:00", "temp_c": 20, "icon": "partly_cloudy" },
      { "time": "17:00", "temp_c": 18, "icon": "rain" },
      { "time": "18:00", "temp_c": 17, "icon": "rain" }
    ],
    "weekly": [
      { "day": "Today", "high": 23, "low": 14, "icon": "sunny" },
      { "day": "Fri",   "high": 25, "low": 15, "icon": "sunny" },
      { "day": "Sat",   "high": 20, "low": 12, "icon": "partly_cloudy" },
      { "day": "Sun",   "high": 16, "low": 11, "icon": "rain" }
    ]
  }
}
```

**Üçüncü parti:** OpenWeatherMap veya WeatherAPI.com aracılığıyla alınır, backend cache ile 30 dakikada 1 güncellenir.

---

### 4.9 Cities

---

#### `GET /api/v1/cities`

**Açıklama:** Desteklenen şehirler listesi. `CityPickerScreen.tsx` tarafından çağrılır. Şu an frontend'de hardcode 30 şehir var.

**Headers:** `Authorization: Bearer <token>`

**Query Parametreleri:**
```
query   string  opsiyonel  "par"   (arama için)
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "popular": [
      { "id": "uuid", "name": "Paris", "country": "France", "image_url": "https://...", "place_count": 234 }
    ],
    "all": [
      { "id": "uuid", "name": "London", "country": "United Kingdom", "image_url": "https://..." }
    ]
  }
}
```

---

### 4.10 Premium / Subscription

---

#### `POST /api/v1/premium/subscribe`

**Açıklama:** Premium abonelik başlatma. `PremiumUpgradeScreen.tsx` "Upgrade to Premium" / "Start Free Trial" butonlarına bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "plan": "annual",           // "monthly" | "annual"
  "provider": "apple",        // "apple" | "google" | "stripe"
  "receipt": "base64...",     // App Store / Play Store makbuzu
  "provider_sub_id": "..."
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "is_premium": true,
    "premium_expires_at": "2027-04-20T00:00:00Z",
    "plan": "annual"
  }
}
```

---

#### `GET /api/v1/premium/status`

**Açıklama:** Premium durumu kontrolü. Uygulama açılışında çağrılır.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "is_premium": false,
    "premium_expires_at": null,
    "features": {
      "ai_daily_limit": 5,
      "offline_download": false,
      "advanced_filters": false
    }
  }
}
```

---

## 5. AI Asistan (Belen) Entegrasyonu

`BelenScreen.tsx` incelendiğinde tam bir chat arayüzü bulunuyor: mesaj baloncukları, yükleme göstergesi, rota kartı yanıtları. Şu an mock yanıtlar kullanıyor.

---

#### `POST /api/v1/assistant/chat`

**Açıklama:** AI asistana mesaj gönderme. `BelenScreen.tsx` "Send" butonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "message": "Plan a morning walk for me. I have 3 hours.",
  "conversation_id": "uuid-or-null",    // null → yeni konuşma
  "context": {
    "city": "Istanbul",
    "travel_style": "solo",
    "budget_level": "mid",
    "interests": ["history", "gastronomy"],
    "location": { "latitude": 41.008, "longitude": 28.978 }
  }
}
```

**Response — 200:**
```json
{
  "success": true,
  "data": {
    "conversation_id": "uuid",
    "message": {
      "id": "msg-uuid",
      "role": "assistant",
      "text": "Here's a great route to discover the highlights of your area.",
      "route_card": {
        "title": "Morning Discovery Walk",
        "distance": "2.4 km",
        "duration": "3 Hours",
        "image_url": "https://...",
        "stops": [
          { "name": "Old Town Square", "description": "Historic heart of the city" },
          { "name": "Local Art Museum", "description": "Regional art and cultural heritage" },
          { "name": "Riverside Promenade", "description": "Scenic waterfront walking path" }
        ]
      }
    }
  }
}
```

**Business Logic:**
- Konuşma geçmişi `conversation_id` ile takip edilir
- Kullanıcının `travel_style`, `budget_level` ve `interests` bilgileri sistem prompt'una eklenir
- `route_card` varsa frontend otomatik olarak görsel kart render eder
- Premium olmayan kullanıcılar için günlük 5 mesaj limiti uygulanır (gelecek sprint)

---

#### `GET /api/v1/assistant/conversations`

**Açıklama:** Önceki AI konuşmaları. `ChatSettingsScreen.tsx` ve Belen geçmiş görünümü için.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "preview": "Plan a morning walk...",
      "message_count": 6,
      "created_at": "2026-04-19T10:00:00Z"
    }
  ]
}
```

---

#### `DELETE /api/v1/assistant/conversations`

**Açıklama:** Tüm konuşma geçmişini silme. `ChatSettingsScreen.tsx` "Clear History" aksiyonuna bağlı.

**Headers:** `Authorization: Bearer <token>`

**Response — 200:**
```json
{
  "success": true,
  "data": { "message": "Conversation history cleared." }
}
```

---

## 6. Üçüncü Parti Entegrasyonlar ve Business Logic

### 6.1 AI Asistan Backend'i

**Seçenek:** Anthropic Claude API (claude-sonnet-4-6 veya claude-haiku-4-5)

Sistem prompt örneği:
```
You are Belen, a friendly travel assistant for the Toronto Travel app.
The user's travel preferences:
- City: {city}
- Travel style: {travel_style}
- Budget level: {budget_level}
- Interests: {interests}

Respond with personalized travel recommendations. When suggesting routes, structure your response to include a route_card JSON object.
```

**Rate Limiting:**
- Free tier: 5 istek/gün/kullanıcı
- Premium: Sınırsız
- Backend bu limiti sayaç ile takip eder

---

### 6.2 Konum Servisleri

Frontend `react-native-localize` ve native PermissionsAPI kullanıyor. Backend gereksinimleri:

- `/places/nearby` endpoint'i için konum doğrulaması yapılmalı (aşırı uzak koordinatlar reddedilmeli)
- Şehir bazlı içerik filtrelemesi `city` parametresiyle çalışır
- **Google Maps Directions API / Mapbox** → Rota oluşturma ve yürüme mesafesi hesaplama

---

### 6.3 Hava Durumu

- **Üçüncü parti:** OpenWeatherMap API veya WeatherAPI.com
- Backend proxy olarak çalışır (API key'i gizler)
- Redis cache: şehir bazında 30 dakika TTL
- `WeatherDetailScreen.tsx` → 5 günlük tahmin + saatlik tahmin verisi gerektirir

---

### 6.4 Dosya Yükleme (CDN / Storage)

`EditProfileScreen.tsx` ve `ProfileScreen.tsx` kamera butonları profil fotoğrafı yükleme için var.

**Seçenekler:** AWS S3, Google Cloud Storage veya Cloudflare R2

**Akış:**
1. Frontend `PUT /users/me/photo` endpoint'ine `multipart/form-data` gönderir
2. Backend dosyayı CDN'e yükler, URL'yi veritabanına kaydeder
3. CDN URL'sini yanıt olarak döndürür

**Kısıtlar:**
- Max dosya boyutu: 5 MB
- İzin verilen tipler: `image/jpeg`, `image/png`, `image/webp`
- Otomatik resize: 400×400 px thumbnail

---

### 6.5 Sosyal Giriş Entegrasyonları

**Google OAuth 2.0:**
- Paket: `google-auth-library` (Node.js)
- Frontend ID token → Backend doğrular → `sub` alanından Google user ID alınır
- Client ID: Google Cloud Console'dan alınır

**Apple Sign In:**
- Paket: `apple-signin-auth` (Node.js)
- Frontend identity token → Backend doğrular → `sub` alanından Apple user ID alınır
- Service ID ve Team ID: Apple Developer Portal'dan alınır

---

### 6.6 Para Birimi Dönüşümü (Gelecek)

`CurrencySettingsScreen.tsx` mevcut. Gerçek fiyat verisi eklendikten sonra:
- **Üçüncü parti:** ExchangeRate-API veya CurrencyLayer
- Cache: 1 saatte 1 güncelleme
- `places` tablosuna `price_usd` alanı eklenecek, yanıtta seçilen dövize çevrilecek

---

### 6.7 Toplu Taşıma (Gelecek)

`4.2` roadmap maddesi. Gelecekte gerekli:
- **Google Maps Transit API** veya **Transitland API**
- `PlaceDetailScreen.tsx` "How to Get Here" bölümü için
- Şehre göre dinamik toplu taşıma rotası

---

## 7. Push Notification Sistemi

### 7.1 Altyapı

- **iOS:** APNs (Apple Push Notification service)
- **Android:** FCM (Firebase Cloud Messaging)
- **Önerilen servis:** Expo Push Notifications veya OneSignal (React Native uyumlu)
- Push token `PUT /api/v1/users/me/push-token` ile backend'e kaydedilir

### 7.2 Bildirim Türleri

Frontend `notifications` tablosunda şu türler var (`type` alanı):

| Tür | Tetikleyici | İçerik Örneği |
|-----|-------------|---------------|
| `route` | Aktif rota varken hatırlatıcı | "You have an active route — continue your journey!" |
| `suggestion` | Yakın yüksek puanlı mekan | "Basilica Cistern is 0.3 km away and highly rated." |
| `reminder` | Planlanan rota başlamadan önce | "Your saved route starts tomorrow at 10:00." |
| `system` | Sistem / hesap bildirimleri | "Your email has been verified." |

### 7.3 Backend Scheduler Gereksinimleri

- **Aktif rota hatırlatıcısı:** Her 30 dakikada aktif rotası olan kullanıcılara bildirim gönder
- **Yakın mekan önerisi:** Konum güncellenince 500m içinde yüksek puanlı mekan varsa bildirim gönder (location update webhook gerekli)
- **Planlanan rota başlangıcı:** Rota başlangıç saatinden 1 saat önce bildirim

---

## 8. Premium / Subscription Sistemi

### 8.1 Plan Yapısı

`PremiumUpgradeScreen.tsx`'ten çıkarılan plan detayları:

| Plan | Fiyat (i18n key) | Süre |
|------|-----------------|------|
| Monthly | `premium.monthlyPrice` | 1 Ay |
| Annual | `premium.annualPrice` | 12 Ay |

### 8.2 Premium Özellikler (Planlanmış — Roadmap)

`PremiumUpgradeScreen.tsx` feature listesinden:

| # | Özellik | Kısıt (Free) | Premium |
|---|---------|-------------|---------|
| 1 | AI Assistant mesaj | 5/gün | Sınırsız |
| 2 | Offline route download | — | Evet |
| 3 | Advanced filters | — | Evet |
| 4 | Push notifications | Temel | Öncelikli |
| 5 | Offline map tiles | — | Evet |

### 8.3 Receipt Doğrulama

- **iOS:** Apple App Store Server API (receipt doğrulama)
- **Android:** Google Play Developer API (purchase token doğrulama)
- Doğrulama başarılıysa `users.is_premium = true`, `premium_expires_at` set edilir

---

## Endpoint Özet Tablosu

| Metot | Endpoint | Auth | Açıklama |
|-------|----------|------|----------|
| POST | `/auth/register` | — | Kayıt |
| POST | `/auth/login` | — | Giriş |
| POST | `/auth/social` | — | Sosyal giriş |
| POST | `/auth/refresh` | — | Token yenile |
| POST | `/auth/forgot-password` | — | Şifre sıfırlama isteği |
| POST | `/auth/reset-password` | — | Yeni şifre belirleme |
| POST | `/auth/verify-email` | — | Email doğrulama |
| POST | `/auth/resend-code` | — | Kod yeniden gönder |
| POST | `/auth/change-password` | ✓ | Şifre değiştirme |
| GET | `/users/me` | ✓ | Profil bilgisi |
| PUT | `/users/me` | ✓ | Profil güncelle |
| PUT | `/users/me/photo` | ✓ | Fotoğraf yükle |
| PUT | `/users/me/preferences` | ✓ | Seyahat tercihleri |
| PUT | `/users/me/push-token` | ✓ | Push token kaydet |
| GET | `/places/nearby` | ✓ | Yakın mekanlar |
| GET | `/places/trending` | ✓ | Trend mekanlar |
| GET | `/places/search` | ✓ | Mekan ara |
| GET | `/places/:id` | ✓ | Mekan detayı |
| POST | `/places/:id/bookmark` | ✓ | Bookmark toggle |
| GET | `/places/bookmarks` | ✓ | Kaydedilen mekanlar |
| GET | `/places/:id/reviews` | ✓ | Yorumlar |
| POST | `/places/:id/reviews` | ✓ | Yorum ekle |
| POST | `/reviews/:id/helpful` | ✓ | Helpful toggle |
| GET | `/routes` | ✓ | Rotalar |
| GET | `/routes/:id` | ✓ | Rota detayı |
| POST | `/routes` | ✓ | Rota oluştur |
| PUT | `/routes/:id` | ✓ | Rota güncelle |
| DELETE | `/routes/:id` | ✓ | Rota sil |
| POST | `/routes/:id/share` | ✓ | Paylaşım linki oluştur |
| GET | `/routes/share/:token` | — | Paylaşılan rotayı gör |
| POST | `/routes/:id/save` | ✓ | AI rotasını kaydet |
| POST | `/routes/:id/download` | ✓ | Offline indir |
| PUT | `/routes/:id/stops/:stopId` | ✓ | Durak durumu güncelle |
| GET | `/trips` | ✓ | Gezi geçmişi |
| POST | `/trips/:id/rating` | ✓ | Gezi puanla |
| GET | `/notifications` | ✓ | Bildirimler |
| PUT | `/notifications/:id/read` | ✓ | Bildirimi okundu işaretle |
| PUT | `/notifications/read-all` | ✓ | Tümünü okundu işaretle |
| GET | `/weather` | ✓ | Hava durumu |
| GET | `/cities` | ✓ | Şehir listesi |
| POST | `/assistant/chat` | ✓ | AI asistana mesaj gönder |
| GET | `/assistant/conversations` | ✓ | Konuşma geçmişi |
| DELETE | `/assistant/conversations` | ✓ | Geçmişi sil |
| POST | `/premium/subscribe` | ✓ | Premium abone ol |
| GET | `/premium/status` | ✓ | Premium durum sorgula |

---

*Bu doküman, frontend kaynak kodunun eksiksiz analizi sonucu üretilmiştir. Tüm ekranlar, Redux slice'ları, TypeScript tipleri, mock veri dosyaları ve servis katmanı göz önünde bulundurulmuştur.*
