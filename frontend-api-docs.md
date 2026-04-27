# Rio — Frontend API Documentation

> Oluşturulma: 2026-04-23 · Kaynak: `routes/api.php`, Controllers, FormRequests (kod değiştirilmedi)

---

## İmplementasyon Durumu

| Durum | Açıklama |
|---|---|
| ✅ | Servis metodu var + ekran bağlı |
| ⚠️ | Servis metodu var ama ekran mock data kullanıyor / bağlı değil |
| ❌ | Henüz implemente edilmedi |

**Özet:**
- **Bölüm 2 (Auth):** ✅ Tümü tamam (2.1–2.10)
- **Bölüm 3 (User):** ✅ Tümü tamam (3.1–3.5)
- **Bölüm 4 (Places):** ✅ Tümü tamam (4.1–4.6)
- **Bölüm 5 (Reviews):** ✅ Tümü tamam (5.1–5.3)
- **Bölüm 6 (Routes):** ✅ Tümü tamam (6.1–6.10 servis + ekranlar bağlı)
- **Bölüm 7 (Trip History):** ✅ Tümü tamam (7.1–7.2 servis + ekran bağlı)
- **Bölüm 8 (Notifications):** ✅ Tümü tamam (8.1–8.3 servis + ekran bağlı)
- **Bölüm 9 (Weather):** ✅ Tümü tamam (9.1 servis + ekran bağlı)
- **Bölüm 10 (Cities):** ✅ Tümü tamam (10.1 servis + ekran bağlı)
- **Bölüm 11 (Premium):** ✅ Tümü tamam (11.1–11.2 servis + ekran bağlı)
- **Bölüm 12 (AI Asistan):** ✅ Tümü tamam (12.1–12.3 servis + ekranlar bağlı)

---

## 1. Temel Bilgiler

### Base URL

```
http://localhost:8000/api/v1
```

> Production'da `APP_URL` ortam değişkeniyle belirlenir.

---

### Standart Headers (Her İstekte Gönderilmeli)

| Header | Değer | Açıklama |
|---|---|---|
| `Accept` | `application/json` | Zorunlu — Laravel'in JSON yanıt döndürmesi için |
| `Content-Type` | `application/json` | Body gönderilen isteklerde (POST/PUT) |
| `Authorization` | `Bearer <accessToken>` | Korumalı endpoint'lerde zorunlu |

> Fotoğraf yükleme (`PUT /users/me/photo`) için `Content-Type: multipart/form-data` kullanılır.

---

### Kimlik Doğrulama (Authentication)

Sistem **özel JWT (HS256)** kullanır. Standart Laravel Sanctum/Passport yoktur.

| Token | TTL | Açıklama |
|---|---|---|
| **Access Token** | 15 dakika (900 sn) | Her korumalı istekte `Authorization` header'ına eklenir |
| **Refresh Token** | 30 gün (2592000 sn) | Yalnızca `POST /auth/refresh` endpoint'ine gönderilir |

**Token nasıl eklenir?**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token yenileme akışı:**
1. Access token süresi dolduğunda `401 UNAUTHORIZED` döner.
2. `POST /auth/refresh` ile `refreshToken` gönderilir.
3. Yeni bir çift `accessToken` + `refreshToken` alınır (eski refresh token geçersiz olur — **rotation** uygulanır).

---

### Standart Yanıt Yapısı

**Başarılı (2xx):**
```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```

**Sayfalandırılmış Başarılı:**
```json
{
  "success": true,
  "data": [ ... ],
  "message": "OK",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Hata (4xx / 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "HATA_KODU",
    "message": "Açıklama metni."
  }
}
```

**422 Doğrulama Hatası (tüm endpoint'lerde aynı format):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The email field must be a valid email address.",
    "details": {
      "email": ["The email field must be a valid email address."],
      "password": ["The password field must be at least 8 characters."]
    }
  }
}
```

---

## 2. Auth Modülü

### 2.1 Kayıt Ol ✅

**POST** `/auth/register`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `name` | string | Yes | max:100 |
| `surname` | string | Yes | max:100 |
| `username` | string | Yes | max:50, sadece harf/rakam/alt çizgi/tire (`alpha_dash`) |
| `email` | string | Yes | Geçerli e-posta, max:255 |
| `password` | string | Yes | min:8, max:128 |

```json
{
  "name": "Ahmet",
  "surname": "Yılmaz",
  "username": "ahmet_ylmz",
  "email": "ahmet@example.com",
  "password": "Passw0rd!"
}
```

**Başarılı Yanıt — 201:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmet",
      "surname": "Yılmaz",
      "username": "ahmet_ylmz",
      "email": "ahmet@example.com",
      "photo": "",
      "is_email_verified": false,
      "is_premium": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "a3f8c2e1d4b7..."
  }
}
```

> Kayıt sonrası e-posta doğrulama kodu gönderilir. Token alınsa da login için e-posta doğrulanmalıdır.

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 409 | `CONFLICT` | E-posta veya kullanıcı adı zaten kullanılıyor |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 2.2 Giriş Yap ✅

**POST** `/auth/login`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `email` | string | Yes | Geçerli e-posta |
| `password` | string | Yes | - |

```json
{
  "email": "ahmet@example.com",
  "password": "Passw0rd!"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmet",
      "surname": "Yılmaz",
      "username": "ahmet_ylmz",
      "email": "ahmet@example.com",
      "photo": "http://localhost:8000/storage/photos/550e8400.../550e8400....jpg",
      "is_email_verified": true,
      "is_premium": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "a3f8c2e1d4b7..."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 401 | `INVALID_CREDENTIALS` | Hatalı e-posta veya şifre |
| 403 | `EMAIL_NOT_VERIFIED` | E-posta henüz doğrulanmamış |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 2.3 Sosyal Giriş (Google / Apple) ✅

**POST** `/auth/social`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `provider` | string | Yes | `google` veya `apple` |
| `id_token` | string | Yes | Sağlayıcıdan alınan kimlik token'ı |

```json
{
  "provider": "google",
  "id_token": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmet",
      "surname": "Yılmaz",
      "username": "ahmet_ylmz",
      "email": "ahmet@gmail.com",
      "photo": "",
      "is_email_verified": true,
      "is_premium": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "a3f8c2e1d4b7...",
    "is_new_user": true
  }
}
```

> `is_new_user: true` ise ilk kayıt — onboarding ekranına yönlendirilebilir.

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 401 | `INVALID_TOKEN` | Sosyal token doğrulaması başarısız |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 2.4 Access Token Yenile ✅

**POST** `/auth/refresh`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `refreshToken` | string | Yes | Mevcut geçerli refresh token |

```json
{
  "refreshToken": "a3f8c2e1d4b7..."
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...(yeni)",
    "refreshToken": "d9e1f3a2b5c8...(yeni)"
  }
}
```

> Eski refresh token geçersiz olur. Yeni token'ları hemen saklayın.

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `refreshToken` alanı eksik |
| 401 | `INVALID_REFRESH_TOKEN` | Token geçersiz veya süresi dolmuş |

---

### 2.5 Şifremi Unuttum ✅

**POST** `/auth/forgot-password`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `email` | string | Yes | Geçerli e-posta |

```json
{
  "email": "ahmet@example.com"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Reset code sent to your email."
  }
}
```

> Kullanıcı bulunamasa bile `200` döner (kullanıcı numaralandırma saldırısını önlemek için). 6 haneli kod e-postaya gönderilir, 15 dakika geçerlidir.

---

### 2.6 Şifre Sıfırla ✅

**POST** `/auth/reset-password`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `email` | string | Yes | Geçerli e-posta |
| `code` | string | Yes | Tam olarak 6 karakter |
| `new_password` | string | Yes | min:8, max:128 |

```json
{
  "email": "ahmet@example.com",
  "code": "482917",
  "new_password": "YeniSifre123!"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Password updated successfully."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 400 | `INVALID_CODE` | Kod yanlış veya süresi dolmuş |
| 404 | `NOT_FOUND` | Kullanıcı bulunamadı |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 2.7 E-posta Doğrula ✅

**POST** `/auth/verify-email`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `email` | string | Yes | Geçerli e-posta |
| `code` | string | Yes | Tam olarak 6 karakter |

```json
{
  "email": "ahmet@example.com",
  "code": "739201"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "verified": true,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmet",
      "surname": "Yılmaz",
      "username": "ahmet_ylmz",
      "email": "ahmet@example.com",
      "photo": "",
      "is_email_verified": true,
      "is_premium": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 400 | `INVALID_CODE` | Kod yanlış veya süresi dolmuş (30 dk) |
| 404 | `NOT_FOUND` | Kullanıcı bulunamadı |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 2.8 Doğrulama Kodunu Tekrar Gönder ✅

**POST** `/auth/resend-code`  
**Yetki:** Gerekmez

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `email` | string | Yes | Geçerli e-posta |

```json
{
  "email": "ahmet@example.com"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Code resent."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 429 | `RATE_LIMIT` | Son gönderimden 60 saniye geçmemiş |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 2.9 Çıkış Yap ✅

**POST** `/auth/logout`  
**Yetki:** Bearer Token — Zorunlu

**Request Body (opsiyonel):**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `refreshToken` | string | No | Varsa sunucu tarafında iptal edilir |

```json
{
  "refreshToken": "a3f8c2e1d4b7..."
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Logged out successfully."
  }
}
```

> Çıkış sırasında kullanıcının `push_token` alanı da sıfırlanır.

---

### 2.10 Şifre Değiştir ✅

**POST** `/auth/change-password`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `current_password` | string | Yes | Mevcut şifre |
| `new_password` | string | Yes | min:8, max:128 |

```json
{
  "current_password": "EskiSifre123!",
  "new_password": "YeniSifre456!"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Password changed successfully."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 401 | `INVALID_PASSWORD` | Mevcut şifre yanlış |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

## 3. Kullanıcı (User) Modülü

### 3.1 Profilimi Getir ✅

**GET** `/users/me`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:** Yok

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ahmet",
    "surname": "Yılmaz",
    "username": "ahmet_ylmz",
    "email": "ahmet@example.com",
    "photo": "http://localhost:8000/storage/photos/550e8400.../550e8400....jpg",
    "is_premium": false,
    "premium_expires_at": null,
    "travel_style": "solo",
    "budget_level": "mid",
    "interests": ["history", "food"],
    "preferred_currency": "USD",
    "language": "tr",
    "stats": {
      "total_routes": 12,
      "places_visited": 47,
      "cities_explored": 5
    }
  }
}
```

---

### 3.2 Profili Güncelle ✅

**PUT** `/users/me`  
**Yetki:** Bearer Token — Zorunlu

**Request Body (tüm alanlar opsiyonel, en az biri gönderilmeli):**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `name` | string | No | max:100 |
| `surname` | string | No | max:100 |
| `email` | string | No | Geçerli e-posta, max:255 |

```json
{
  "name": "Ahmet Mehmet",
  "email": "yeni@example.com"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmet Mehmet",
      "surname": "Yılmaz",
      "email": "yeni@example.com",
      "photo": "http://localhost:8000/storage/photos/..."
    }
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 409 | `CONFLICT` | Yeni e-posta başka kullanıcıya ait |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 3.3 Profil Fotoğrafı Yükle ✅

**PUT** `/users/me/photo`  
**Yetki:** Bearer Token — Zorunlu  
**Content-Type:** `multipart/form-data`

**Form Data:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `photo` | file | Yes | jpeg, jpg, png veya webp — max: 5 MB (5120 KB) |

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "photo_url": "http://localhost:8000/storage/photos/550e8400.../550e8400....jpg"
  }
}
```

> Fotoğraf sunucu tarafında 400×400 px kare olarak kırpılır ve JPEG'e dönüştürülür.

---

### 3.4 Tercihlerimi Güncelle ✅

**PUT** `/users/me/preferences`  
**Yetki:** Bearer Token — Zorunlu

**Request Body (tüm alanlar opsiyonel):**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `travel_style` | string | No | `solo`, `couple`, `family`, `group` |
| `budget_level` | string | No | `budget`, `mid`, `luxury` |
| `interests` | array | No | max:50 öğe, her biri string max:50 |
| `preferred_currency` | string | No | Tam olarak 3 karakter (ör: `USD`, `EUR`) |
| `language` | string | No | max:5 (ör: `tr`, `en`) |

```json
{
  "travel_style": "couple",
  "budget_level": "luxury",
  "interests": ["art", "food", "history"],
  "preferred_currency": "EUR",
  "language": "tr"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Preferences updated."
  }
}
```

---

### 3.5 Push Token Kaydet ⚠️

**PUT** `/users/me/push-token`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `push_token` | string | Yes | max:500 — FCM veya APNs token |
| `platform` | string | Yes | `ios` veya `android` |

```json
{
  "push_token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxx]",
  "platform": "android"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Push token registered."
  }
}
```

---

## 4. Mekanlar (Places) Modülü

### 4.1 Yakındaki Mekanlar ✅

**GET** `/places/nearby`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `latitude` | numeric | Yes | -90 ile 90 arası |
| `longitude` | numeric | Yes | -180 ile 180 arası |
| `radius` | integer | No | min:100, max:50000 — metre (varsayılan: 3000) |
| `category` | string | No | max:50 |
| `limit` | integer | No | min:1, max:50 (varsayılan: 10) |

```
GET /places/nearby?latitude=41.0082&longitude=28.9784&radius=2000&category=museum
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "place-uuid-1",
      "name": "Topkapı Sarayı",
      "category": "museum",
      "distance": "1.2 km",
      "rating": 4.7,
      "review_count": 2341,
      "price_level": "free",
      "image_url": "https://example.com/topkapi.jpg",
      "is_open": true,
      "tags": ["historical", "ottoman", "palace"]
    }
  ]
}
```

---

### 4.2 Trend Mekanlar ✅

**GET** `/places/trending`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `city` | string | No | max:100 |
| `limit` | integer | No | min:1, max:50 (varsayılan: 10) |

```
GET /places/trending?city=Istanbul&limit=5
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "place-uuid-1",
      "name": "Kapalıçarşı",
      "category": "shopping",
      "rating": 4.9,
      "review_count": 5890,
      "price_level": "$$",
      "price_display": "$$",
      "image_url": "https://example.com/kapalicarsi.jpg",
      "badge": "HOT"
    }
  ]
}
```

> `badge` alanı: `"HOT"` (rating >= 4.8) veya `null`.

---

### 4.3 Mekan Ara ✅

**GET** `/places/search`  
**Yetki:** Bearer Token — Zorunlu

> `min_rating`, `prices` ve `distance` filtreleri **Premium** gerektirir. Ücretsiz kullanıcılar için 403 döner.

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `query` | string | Yes | min:1, max:100 — arama metni |
| `category` | string | No | max:50 |
| `city` | string | No | max:100 |
| `min_rating` | numeric | No | 0-5 arası — **Premium** |
| `prices` | string | No | Virgülle ayrılmış (ör: `free,$`) — **Premium** |
| `distance` | string | No | `1km`, `2km`, `5km`, `10km` — **Premium** |
| `latitude` | numeric | No | -90 ile 90 (distance ile birlikte) |
| `longitude` | numeric | No | -180 ile 180 (distance ile birlikte) |
| `page` | integer | No | min:1 (varsayılan: 1) |
| `limit` | integer | No | min:1, max:50 (varsayılan: 20) |

```
GET /places/search?query=müze&city=Istanbul&page=1&limit=20
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "place-uuid-1",
      "name": "İstanbul Arkeoloji Müzesi",
      "category": "museum",
      "location": "Istanbul",
      "rating": 4.6,
      "review_count": 1204,
      "price_level": "$",
      "price_display": "$",
      "is_liked": false,
      "image_url": "https://example.com/arkeoloji.jpg",
      "placeholder_color": "#0F3460",
      "distance": "450 m"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 38,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

> `distance` alanı yalnızca `latitude`+`longitude` gönderildiğinde döner.  
> `is_liked` alanı kullanıcının bu mekanı bookmarklamış olup olmadığını gösterir.

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 403 | `PREMIUM_REQUIRED` | Premium filtreler ücretsiz kullanıcıda kullanıldı |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 4.4 Bookmarklarım ✅

**GET** `/places/bookmarks`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `category` | string | No | Filtrele |
| `page` | integer | No | min:1 (varsayılan: 1) |
| `limit` | integer | No | min:1, max:50 (varsayılan: 20) |

```
GET /places/bookmarks?page=1&limit=20
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "place-uuid-1",
      "name": "Topkapı Sarayı",
      "category": "museum",
      "rating": 4.7,
      "location": "Istanbul",
      "image_url": "https://example.com/topkapi.jpg",
      "placeholder_color": "#1A1A2E",
      "saved_at": "2026-04-20T14:30:00.000000Z",
      "saved_at_display": "3 days ago"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### 4.5 Mekan Detayı ✅

**GET** `/places/{placeId}`  
**Yetki:** Bearer Token — Zorunlu

**URL Parametresi:** `placeId` — Mekanın UUID'si

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "place-uuid-1",
    "name": "Topkapı Sarayı",
    "category": "museum",
    "description": "Osmanlı İmparatorluğu'nun saray kompleksi...",
    "address": "Cankurtaran Mah., 34122 Fatih/İstanbul",
    "city": "Istanbul",
    "country": "Turkey",
    "latitude": 41.0136,
    "longitude": 28.9838,
    "rating": 4.7,
    "review_count": 2341,
    "price_level": "free",
    "price_display": "Free",
    "tags": ["historical", "ottoman", "palace"],
    "image_url": "https://example.com/topkapi.jpg",
    "is_family_friendly": true,
    "hours": {
      "mon_fri": "09:00-17:00",
      "saturday": "09:00-19:00",
      "sunday": "09:00-19:00"
    },
    "is_open": true,
    "closes_at": "17:00",
    "phone": "+90 212 512 0480",
    "website": "https://topkapisarayi.gov.tr",
    "is_bookmarked": false
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Mekan bulunamadı veya aktif değil |

---

### 4.6 Bookmark Ekle / Kaldır (Toggle) ✅

**POST** `/places/{placeId}/bookmark`  
**Yetki:** Bearer Token — Zorunlu

**URL Parametresi:** `placeId` — Mekanın UUID'si  
**Request Body:** Yok

**Başarılı Yanıt — Eklendi (200):**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "bookmarked": true,
    "message": "Place saved to bookmarks."
  }
}
```

**Başarılı Yanıt — Kaldırıldı (200):**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "bookmarked": false,
    "message": "Place removed from bookmarks."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Mekan bulunamadı |

---

## 5. Yorumlar (Reviews) Modülü

### 5.1 Mekan Yorumlarını Listele ✅

**GET** `/places/{placeId}/reviews`  
**Yetki:** Bearer Token — Zorunlu

**URL Parametresi:** `placeId` — Mekanın UUID'si

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `sort` | string | No | `recent` (varsayılan), `highest`, `lowest`, `helpful` |
| `page` | integer | No | min:1 (varsayılan: 1) |
| `limit` | integer | No | min:1, max:50 (varsayılan: 15) |

```
GET /places/place-uuid-1/reviews?sort=helpful&page=1
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "review-uuid-1",
      "author": "Ahmet Y.",
      "initials": "AY",
      "rating": 5,
      "date": "April 20, 2026",
      "text": "Muhteşem bir deneyimdi, kesinlikle tavsiye ederim.",
      "helpful_count": 14,
      "is_helpful": false,
      "is_mine": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 2341,
    "totalPages": 157,
    "hasNext": true,
    "hasPrev": false
  },
  "summary": {
    "average_rating": 4.7,
    "total_count": 2341,
    "distribution": {
      "1": 23,
      "2": 45,
      "3": 120,
      "4": 580,
      "5": 1573
    }
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Mekan bulunamadı |

---

### 5.2 Yorum Yaz ✅

**POST** `/places/{placeId}/reviews`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `rating` | integer | Yes | 1 ile 5 arasında |
| `text` | string | Yes | min:10, max:2000 |

```json
{
  "rating": 5,
  "text": "Tarihi atmosferi ve harikaları ile gerçekten etkileyici bir mekan."
}
```

**Başarılı Yanıt — 201:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "review-uuid-new",
    "author": "Ahmet Y.",
    "initials": "AY",
    "rating": 5,
    "date": "April 23, 2026",
    "text": "Tarihi atmosferi ve harikaları ile gerçekten etkileyici bir mekan.",
    "helpful_count": 0
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Mekan bulunamadı |
| 409 | `CONFLICT` | Bu mekanı zaten yorumladınız |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 5.3 Yorumu Faydalı İşaretle (Toggle) ✅

**POST** `/reviews/{reviewId}/helpful`  
**Yetki:** Bearer Token — Zorunlu

**URL Parametresi:** `reviewId` — Yorumun UUID'si  
**Request Body:** Yok

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "helpful_count": 15,
    "is_helpful": true
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Yorum bulunamadı |

---

## 6. Rotalar (Routes) Modülü

### 6.1 Rotaları Listele ✅

**GET** `/routes`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `status` | string | No | `draft`, `active`, `completed`, `archived` |
| `page` | integer | No | min:1 (varsayılan: 1) |
| `limit` | integer | No | min:1, max:50 (varsayılan: 20) |

```
GET /routes?status=completed&page=1
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "data": {
    "today_plan": {
      "id": "route-uuid-active",
      "name": "Tarihi Yarımada Turu",
      "stops_left": 3,
      "total_stops": 5,
      "duration": "3h 30m",
      "is_active": true,
      "map_image_url": null
    },
    "saved_routes": [
      {
        "id": "route-uuid-1",
        "name": "Boğaz Yürüyüşü",
        "date": "20 APR",
        "stop_count": 4,
        "duration": "2h",
        "is_completed": true,
        "image_url": null,
        "placeholder_color": "#0F3460"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

> `today_plan`: Aktif durumdaki en son rota. Aktif rota yoksa `null` döner.  
> `saved_routes`: Aktif olmayan rotalar (filtrelenmiş ve sayfalandırılmış).

---

### 6.2 Rota Oluştur ✅

**POST** `/routes`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `name` | string | Yes | max:255 |
| `notes` | string | No | max:2000 |
| `is_ai_generated` | boolean | No | Varsayılan: false |
| `scheduled_at` | string (date) | No | Geçerli tarih (ör: `2026-05-10`) |
| `stops` | array | No | max:50 öğe |
| `stops[].name` | string | Yes (stops varsa) | max:255 |
| `stops[].description` | string | No | max:500 |
| `stops[].duration` | integer | No | min:1, max:1440 — dakika cinsinden |

```json
{
  "name": "Tarihi Yarımada Turu",
  "notes": "Sabah erken başlayalım.",
  "scheduled_at": "2026-04-28",
  "stops": [
    {
      "name": "Ayasofya",
      "description": "Sabah ziyareti",
      "duration": 60
    },
    {
      "name": "Topkapı Sarayı",
      "description": "Müze gezmesi",
      "duration": 90
    }
  ]
}
```

**Başarılı Yanıt — 201:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "route-uuid-new",
    "name": "Tarihi Yarımada Turu",
    "status": "draft",
    "stops": [
      {
        "id": "stop-uuid-1",
        "name": "Ayasofya",
        "description": "Sabah ziyareti",
        "duration": "60 min",
        "status": "upcoming",
        "order_index": 0
      },
      {
        "id": "stop-uuid-2",
        "name": "Topkapı Sarayı",
        "description": "Müze gezmesi",
        "duration": "90 min",
        "status": "upcoming",
        "order_index": 1
      }
    ],
    "total_stops": 2,
    "total_duration": null,
    "total_distance": null
  }
}
```

---

### 6.3 Rota Detayı ✅

**GET** `/routes/{routeId}`  
**Yetki:** Bearer Token — Zorunlu

**URL Parametresi:** `routeId` — Rotanın UUID'si

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "route-uuid-1",
    "name": "Tarihi Yarımada Turu",
    "status": "active",
    "total_stops": 5,
    "completed_stops": 2,
    "progress": 0.4,
    "total_duration": "3h 30m",
    "total_distance": "4.5 km",
    "is_ai_generated": false,
    "stops": [
      {
        "id": "stop-uuid-1",
        "name": "Ayasofya",
        "description": "Sabah ziyareti",
        "duration": "60 min",
        "status": "completed",
        "order_index": 0
      },
      {
        "id": "stop-uuid-2",
        "name": "Topkapı Sarayı",
        "description": "Müze gezmesi",
        "duration": "90 min",
        "status": "active",
        "order_index": 1
      }
    ]
  }
}
```

> `progress`: 0.0 ile 1.0 arasında (0.4 = %40 tamamlanmış).  
> Stop `status` değerleri: `upcoming`, `active`, `completed`.

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Rota bulunamadı veya size ait değil |

---

### 6.4 Rotayı Güncelle ✅

**PUT** `/routes/{routeId}`  
**Yetki:** Bearer Token — Zorunlu

**Request Body (tüm alanlar opsiyonel):**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `name` | string | No | max:255 |
| `status` | string | No | `draft`, `active`, `completed`, `archived` |
| `notes` | string | No | max:2000 |
| `scheduled_at` | string (date) | No | Geçerli tarih |
| `total_duration` | integer | No | min:0 — dakika |
| `total_distance` | numeric | No | min:0 — km |
| `stops` | array | No | Gönderilirse mevcut stop'lar silinip yenileri eklenir |
| `stops[].id` | string (uuid) | No | Mevcut stop'u eşleştirmek için |
| `stops[].name` | string | Yes (stops varsa) | max:255 |
| `stops[].duration` | integer | No | min:1, max:1440 |
| `stops[].status` | string | No | `upcoming`, `active`, `completed` |

```json
{
  "status": "active",
  "total_duration": 210,
  "total_distance": 4.5
}
```

**Başarılı Yanıt — 200:** Rota detay nesnesi (bkz. 6.3)

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Rota bulunamadı |

---

### 6.5 Stop Durumunu Güncelle ✅

**PUT** `/routes/{routeId}/stops/{stopId}`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `status` | string | Yes | `upcoming`, `active`, `completed` |

```json
{
  "status": "completed"
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "stop": {
      "id": "stop-uuid-1",
      "status": "completed"
    },
    "route_progress": 0.6
  }
}
```

> Tüm stop'lar `completed` olursa rota otomatik olarak `completed` durumuna geçer.

---

### 6.6 Rotayı Sil ✅

**DELETE** `/routes/{routeId}`  
**Yetki:** Bearer Token — Zorunlu

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Route deleted."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Rota bulunamadı |

---

### 6.7 Rotayı Paylaş ✅

**POST** `/routes/{routeId}/share`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:** Yok

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "share_url": "http://localhost:8000/routes/share/aB3xK9mPqR7s...",
    "share_token": "aB3xK9mPqR7s...",
    "expires_at": null
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Rota bulunamadı |

---

### 6.8 Paylaşılan Rotayı Görüntüle (Public) ✅

**GET** `/routes/share/{shareToken}`  
**Yetki:** Gerekmez (herkese açık)

**URL Parametresi:** `shareToken` — Share token (32 karakter)

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "route-uuid-1",
    "name": "Tarihi Yarımada Turu",
    "total_stops": 5,
    "total_duration": "3h 30m",
    "total_distance": "4.5 km",
    "stops": [
      {
        "id": "stop-uuid-1",
        "name": "Ayasofya",
        "description": "Sabah ziyareti",
        "duration": "60 min",
        "status": "upcoming",
        "order_index": 0
      }
    ],
    "shared_by": "Ahmet Y."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Paylaşım linki geçersiz |

---

### 6.9 AI Rotasını Kaydet ✅

**POST** `/routes/{routeId}/save`  
**Yetki:** Bearer Token — Zorunlu

AI tarafından oluşturulan (`is_ai_generated: true`) bir rotayı kullanıcının koleksiyonuna kopyalar.

**Request Body:** Yok

**Başarılı Yanıt — 201:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "route-uuid-new-copy",
    "message": "Route saved to your collection."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | AI rotası bulunamadı |

---

### 6.10 Rotayı Offline İndir ✅

**POST** `/routes/{routeId}/download`  
**Yetki:** Bearer Token — Zorunlu  
**Premium:** Gerekli

**Request Body:** Yok

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "offline_route_id": "offline-uuid-1",
    "file_size_mb": 2.4,
    "downloaded_at": "2026-04-23T09:00:00.000000Z",
    "expires_at": null
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 403 | `PREMIUM_REQUIRED` | Kullanıcı premium değil |
| 404 | `NOT_FOUND` | Rota bulunamadı |

---

## 7. Gezi Geçmişi (Trip History) Modülü

### 7.1 Gezi Geçmişini Listele ✅

**GET** `/trips`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `page` | integer | No | min:1 (varsayılan: 1) |
| `limit` | integer | No | min:1, max:50 (varsayılan: 20) |

```
GET /trips?page=1&limit=10
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_trips": 23,
      "total_distance_km": 147.3,
      "average_rating": 4.35
    },
    "trips": [
      {
        "id": "trip-uuid-1",
        "name": "Tarihi Yarımada Turu",
        "date": "April 20, 2026",
        "duration": "3h 30m",
        "distance_km": 4.5,
        "stop_count": 5,
        "rating": 5
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 23,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 7.2 Geziyi Puanla ✅

**POST** `/trips/{tripId}/rating`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `rating` | integer | Yes | 1 ile 5 arasında |

```json
{
  "rating": 4
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Trip rated."
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Gezi bulunamadı |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

## 8. Bildirimler (Notifications) Modülü

### 8.1 Bildirimleri Listele ✅

**GET** `/notifications`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `page` | integer | No | min:1 (varsayılan: 1) |
| `limit` | integer | No | min:1, max:50 (varsayılan: 20) |

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "data": {
    "unread_count": 3,
    "notifications": [
      {
        "id": "notif-uuid-1",
        "type": "trip_reminder",
        "title": "Rotanız Başlıyor!",
        "body": "Tarihi Yarımada Turu için hazır mısınız?",
        "is_read": false,
        "time": "2 hours ago",
        "created_at": "2026-04-23T07:00:00.000000Z",
        "action_type": "open_route",
        "action_payload": {
          "route_id": "route-uuid-1"
        }
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### 8.2 Bildirimi Okundu İşaretle ✅

**PUT** `/notifications/{notificationId}/read`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:** Yok

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "is_read": true
  }
}
```

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 404 | `NOT_FOUND` | Bildirim bulunamadı |

---

### 8.3 Tümünü Okundu İşaretle ✅

**PUT** `/notifications/read-all`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:** Yok

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "updated_count": 3
  }
}
```

---

## 9. Hava Durumu (Weather) Modülü

### 9.1 Hava Durumu Getir ✅

**GET** `/weather`  
**Yetki:** Bearer Token — Zorunlu

> `city` **veya** `latitude`+`longitude` gönderilmelidir; ikisi de yoksa 422 döner.

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `city` | string | Koşullu | max:100 — şehir adıyla sorgula |
| `latitude` | numeric | Koşullu | -90 ile 90 |
| `longitude` | numeric | Koşullu | -180 ile 180 |

```
GET /weather?city=Istanbul
GET /weather?latitude=41.0082&longitude=28.9784
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "city": "Istanbul",
    "current": {
      "temp_c": 18,
      "condition": "Partly cloudy",
      "icon": "partly_cloudy",
      "wind_kmh": 22,
      "humidity_percent": 65,
      "visibility_km": 10,
      "uv_index": null
    },
    "hourly": [
      { "time": "10:00", "temp_c": 17, "icon": "sunny" },
      { "time": "13:00", "temp_c": 19, "icon": "partly_cloudy" },
      { "time": "16:00", "temp_c": 18, "icon": "partly_cloudy" },
      { "time": "19:00", "temp_c": 15, "icon": "rain" },
      { "time": "22:00", "temp_c": 13, "icon": "rain" }
    ],
    "weekly": [
      { "day": "Today", "high": 19, "low": 12, "icon": "partly_cloudy" },
      { "day": "Thu",   "high": 21, "low": 13, "icon": "sunny" },
      { "day": "Fri",   "high": 16, "low": 11, "icon": "rain" },
      { "day": "Sat",   "high": 14, "low": 10, "icon": "thunderstorm" }
    ]
  }
}
```

**Icon değerleri:** `sunny`, `partly_cloudy`, `rain`, `thunderstorm`, `snow`, `fog`

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Ne şehir ne de koordinat gönderildi |
| 503 | `SERVICE_UNAVAILABLE` | OpenWeather API yapılandırılmamış veya ulaşılamıyor |

---

## 10. Şehirler (Cities) Modülü

### 10.1 Şehirleri Listele / Ara ✅

**GET** `/cities`  
**Yetki:** Bearer Token — Zorunlu

**Query Params:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `query` | string | No | max:100 — şehir/ülke adıyla ara |

```
GET /cities
GET /cities?query=istanbul
```

**Başarılı Yanıt — Sorgu Yok (200):**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "popular": [
      {
        "id": "city-uuid-1",
        "name": "Istanbul",
        "country": "Turkey",
        "image_url": "https://example.com/istanbul.jpg",
        "place_count": 342
      }
    ],
    "all": [
      {
        "id": "city-uuid-2",
        "name": "Ankara",
        "country": "Turkey",
        "image_url": "https://example.com/ankara.jpg"
      }
    ]
  }
}
```

**Başarılı Yanıt — Sorgu Var (200):**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "popular": [],
    "all": [
      {
        "id": "city-uuid-1",
        "name": "Istanbul",
        "country": "Turkey",
        "image_url": "https://example.com/istanbul.jpg"
      }
    ]
  }
}
```

---

## 11. Premium Modülü

### 11.1 Premium'a Abone Ol ✅

**POST** `/premium/subscribe`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `plan` | string | Yes | `monthly` veya `annual` |
| `provider` | string | Yes | `apple`, `google`, `stripe` |
| `receipt` | string | Koşullu | `stripe` hariç zorunlu — mağaza makbuzu |
| `provider_sub_id` | string | No | Google/Stripe abonelik kimliği |

**Apple örneği:**
```json
{
  "plan": "monthly",
  "provider": "apple",
  "receipt": "MIIUKgYJKoZIhvcNAQcCoII..."
}
```

**Google örneği:**
```json
{
  "plan": "annual",
  "provider": "google",
  "receipt": "purchase-token-from-play-store",
  "provider_sub_id": "rio.premium.annual"
}
```

**Stripe örneği:**
```json
{
  "plan": "monthly",
  "provider": "stripe",
  "provider_sub_id": "sub_1OxAbc2eZvKYlo2C..."
}
```

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "is_premium": true,
    "premium_expires_at": "2026-05-23T09:00:00.000000Z",
    "plan": "monthly"
  }
}
```

**Fiyatlar:** Monthly — $9.99 | Annual — $59.99

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 422 | `INVALID_RECEIPT` | Makbuz doğrulaması başarısız |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 11.2 Premium Durumu Sorgula ✅

**GET** `/premium/status`  
**Yetki:** Bearer Token — Zorunlu

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "is_premium": true,
    "premium_expires_at": "2026-05-23T09:00:00.000000Z",
    "features": {
      "ai_daily_limit": null,
      "offline_download": true,
      "advanced_filters": true
    }
  }
}
```

> `ai_daily_limit`: Premium kullanıcılar için `null` (limitsiz), ücretsiz kullanıcılar için günlük limit sayısı (varsayılan: 5).

**Ücretsiz kullanıcı yanıtı:**
```json
{
  "success": true,
  "message": "OK",
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

## 12. AI Asistan (Belen) Modülü

### 12.1 Mesaj Gönder ✅

**POST** `/assistant/chat`  
**Yetki:** Bearer Token — Zorunlu

> Ücretsiz kullanıcılar için günlük 5 mesaj limiti uygulanır (varsayılan). Premium kullanıcılar limitsizdir.

**Request Body:**

| Parametre | Tip | Zorunlu | Kurallar |
|---|---|---|---|
| `message` | string | Yes | min:1, max:2000 |
| `conversation_id` | string (uuid) | No | Mevcut konuşmayı sürdürmek için |
| `context` | object | No | Kullanıcı bağlamı (profil tercihlerini geçersiz kılar) |
| `context.city` | string | No | max:100 |
| `context.travel_style` | string | No | max:50 |
| `context.budget_level` | string | No | max:50 |
| `context.interests` | array | No | max:20 öğe, her biri max:50 |
| `context.location` | object | No | Konum bilgisi |
| `context.location.latitude` | numeric | Koşullu | -90 ile 90 (location varsa zorunlu) |
| `context.location.longitude` | numeric | Koşullu | -180 ile 180 (location varsa zorunlu) |

**Yeni konuşma:**
```json
{
  "message": "Istanbul'da tarihi bir rota önerir misin?",
  "context": {
    "city": "Istanbul",
    "travel_style": "solo",
    "budget_level": "mid",
    "interests": ["history", "art"]
  }
}
```

**Mevcut konuşmaya devam:**
```json
{
  "message": "Bu rotaya bir de müze ekleyebilir misin?",
  "conversation_id": "conv-uuid-1"
}
```

**Başarılı Yanıt — 200 (Rota önerisi olmayan):**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "conversation_id": "conv-uuid-1",
    "message": {
      "id": "msg-uuid-1",
      "role": "assistant",
      "text": "Tabii ki! Istanbul'un tarihi yarımadası için harika bir rota önerebilirim...",
      "route_card": null
    }
  }
}
```

**Başarılı Yanıt — 200 (Rota önerisi ile):**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "conversation_id": "conv-uuid-1",
    "message": {
      "id": "msg-uuid-2",
      "role": "assistant",
      "text": "İşte sizin için özel bir rota hazırladım! Tarihi yarımadanın en güzel noktalarını kapsıyor.",
      "route_card": {
        "title": "Tarihi Yarımada Keşfi",
        "distance": "3.2 km",
        "duration": "4 Hours",
        "image_url": null,
        "stops": [
          {
            "name": "Ayasofya",
            "description": "Bizans döneminden kalma muhteşem katedral-cami"
          },
          {
            "name": "Topkapı Sarayı",
            "description": "Osmanlı İmparatorluğu'nun yönetim merkezi"
          },
          {
            "name": "Kapalıçarşı",
            "description": "Dünyanın en büyük kapalı çarşılarından biri"
          }
        ]
      }
    }
  }
}
```

> `route_card` null değilse kullanıcıya rota kartı göster ve `POST /routes/{routeId}/save` ile kaydettirme seçeneği sun.

**Hata Yanıtları:**

| HTTP | `error.code` | Neden |
|---|---|---|
| 429 | `RATE_LIMIT` | Günlük ücretsiz mesaj limiti doldu |
| 503 | `AI_SERVICE_ERROR` | AI servisine ulaşılamıyor |
| 422 | `VALIDATION_ERROR` | Alan doğrulama hatası |

---

### 12.2 Konuşma Geçmişi ✅

**GET** `/assistant/conversations`  
**Yetki:** Bearer Token — Zorunlu

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "conv-uuid-1",
      "preview": "Istanbul'da tarihi bir rota önerir misin?",
      "message_count": 6,
      "created_at": "2026-04-22T10:30:00.000000Z"
    },
    {
      "id": "conv-uuid-2",
      "preview": "Bodrum'da ne yapabilirim?",
      "message_count": 4,
      "created_at": "2026-04-20T14:15:00.000000Z"
    }
  ]
}
```

---

### 12.3 Konuşma Geçmişini Temizle ✅

**DELETE** `/assistant/conversations`  
**Yetki:** Bearer Token — Zorunlu

**Request Body:** Yok

**Başarılı Yanıt — 200:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "message": "Conversation history cleared."
  }
}
```

---

## 13. Genel Hata Kodları Referansı

| HTTP | `error.code` | Açıklama |
|---|---|---|
| 400 | `VALIDATION_ERROR` | refreshToken gibi body'den okunan zorunlu alan eksik |
| 401 | `UNAUTHORIZED` | Token eksik, geçersiz veya süresi dolmuş |
| 401 | `INVALID_CREDENTIALS` | Hatalı e-posta/şifre |
| 401 | `INVALID_REFRESH_TOKEN` | Refresh token geçersiz |
| 403 | `EMAIL_NOT_VERIFIED` | E-posta doğrulanmamış |
| 403 | `PREMIUM_REQUIRED` | Özellik premium abonelik gerektirir |
| 404 | `NOT_FOUND` | Kayıt bulunamadı |
| 409 | `CONFLICT` | E-posta/kullanıcı adı zaten kullanımda |
| 422 | `VALIDATION_ERROR` | Form alanı doğrulama hatası (detaylar `error.details`'de) |
| 422 | `INVALID_RECEIPT` | Mağaza makbuzu doğrulaması başarısız |
| 429 | `RATE_LIMIT` | İstek limiti aşıldı |
| 503 | `SERVICE_UNAVAILABLE` | Dış servis (Hava durumu, AI) kullanılamıyor |
| 503 | `AI_SERVICE_ERROR` | AI servisine ulaşılamıyor |

---

## 14. Pagination Yapısı (Özet)

Tüm liste endpoint'lerinde aynı `pagination` bloğu döner:

```json
"pagination": {
  "page": 1,
  "limit": 20,
  "total": 120,
  "totalPages": 6,
  "hasNext": true,
  "hasPrev": false
}
```

Sonraki sayfayı almak için `?page=2` query parametresi ekleyin.

---

## 15. Frontend Entegrasyon Notları

1. **Token saklama:** `accessToken` ve `refreshToken`'ı güvenli depolama alanında (SecureStore / Keychain) saklayın. LocalStorage kullanmayın.

2. **Otomatik token yenileme:** Access token süresi 15 dakika. API'den `401 UNAUTHORIZED` geldiğinde `POST /auth/refresh` çağırarak yeni token alın ve orijinal isteği tekrarlayın. Refresh başarısız olursa kullanıcıyı login ekranına yönlendirin.

3. **Premium gating:** `GET /premium/status` yanıtındaki `features` objesini kullanarak UI'da özellikleri koşullu gösterin. `403 PREMIUM_REQUIRED` hatası geldiğinde uygulama içi satın alma akışını başlatın.

4. **AI route_card:** `POST /assistant/chat` yanıtında `route_card != null` ise kullanıcıya rotayı önizleme kartı olarak gösterin. Kaydet butonuna basıldığında `POST /routes/{routeId}/save` çağırın.

5. **Fotoğraf yükleme:** `PUT /users/me/photo` için mutlaka `Content-Type: multipart/form-data` kullanın. `application/json` olarak gönderilirse dosya algılanmaz.

6. **Hava durumu önbelleği:** Yanıtlar sunucu tarafında 30 dakika (1800 sn) önbelleklenir. Aynı şehir/koordinat için sık istek göndermek gereksizdir.

7. **Bookmark toggle:** `POST /places/{placeId}/bookmark` her çağrıda durumu tersine çevirir. Yanıttaki `bookmarked` alanına göre UI ikonunu güncelleyin.

8. **Stop status akışı:** `upcoming → active → completed` şeklinde ilerler. `completed` durumundaki tüm stop'lar route'u otomatik `completed` yapar.
