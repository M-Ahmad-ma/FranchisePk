# Franchise Pakistan — API Documentation

REST API for Franchise Pakistan platform. Provides JSON data for mobile apps, third-party integrations, and frontend applications.

---

## 1. Overview

### Base URL

```
https://franchisepk.com
```

All endpoints are prefixed with `/api/`.

### Response Format

Every endpoint returns a JSON object with this standard structure:

```json
{
  "status": true,
  "message": "Success",
  "data": { ... }
}
```

| Field     | Type    | Description                          |
|-----------|---------|--------------------------------------|
| `status`  | boolean | `true` = success, `false` = error    |
| `message` | string  | Human-readable status message        |
| `data`    | object/array/null | Payload of the response   |

### Error Responses

Errors use HTTP status codes:

| Code | Meaning                              |
|------|--------------------------------------|
| 400  | Bad request — missing/invalid params |
| 401  | Unauthorized — invalid/missing token |
| 404  | Not found                            |
| 409  | Conflict — duplicate record          |
| 500  | Server error                         |

Error response example:

```json
{
  "status": false,
  "message": "Company not found",
  "data": null
}
```

### Content-Type

- **Requests** with a body must send `Content-Type: application/json`
- **Responses** are always `application/json; charset=utf-8`

### CORS

CORS is enabled for all origins — browsers can call the API directly:

```
Access-Control-Allow-Origin: *
```

---

## 2. Authentication

The API uses **JWT (JSON Web Token)** authentication.

### How it works

1. Client calls `POST /api/auth/login` with email + password
2. Server validates credentials and returns a **token**
3. Client stores the token and sends it with every protected request
4. Token expires after **24 hours**

### Sending the token

Add the token to the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

### Which endpoints need auth?

| Endpoint | Auth Required |
|----------|---------------|
| `POST /api/auth/login` | No |
| `POST /api/auth/register` | No |
| `POST /api/auth/register-simple` | No |
| `POST /api/auth/logout` | No |
| `GET /api/auth/profile` | **Yes** |
| `POST /api/properties/add` | **Yes** |
| `GET /api/subscribers` | **Yes** |
| `DELETE /api/subscribers/:id` | **Yes** |
| `POST /api/admin/email/subscribers` | **Yes** |
| `POST /api/admin/email/requests` | **Yes** |

All other endpoints are public and require no token.

---

## 3. Authentication Endpoints

### 3.1 Login

Authenticates a user and returns a JWT token.

```
POST /api/auth/login
```

**Request Body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200:**

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJpYXQiOjE3MjEw...",
    "user": {
      "id": 5,
      "name": "John Doe",
      "email": "user@example.com",
      "contact": "03001234567",
      "company": "Example Brand",
      "image": "profile.jpg"
    }
  }
}
```

**Errors:** `400` missing fields, `401` invalid credentials

---

### 3.2 Register

Registers a new user and returns a token.

```
POST /api/auth/register
```

**Request Body (JSON):**

| Field     | Required | Description           |
|-----------|----------|-----------------------|
| `f_name`  | Yes      | First name            |
| `l_name`  | Yes      | Last name             |
| `email`   | Yes      | Email address         |
| `password`| Yes      | Password              |
| `contact` | Yes      | Phone number          |
| `company` | Yes      | Company/brand name    |
| `city`    | No       | City                  |
| `image`   | No       | Profile image filename|

```json
{
  "f_name": "John",
  "l_name": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "contact": "03001234567",
  "company": "Example Brand",
  "city": "Lahore"
}
```

**Response 201:**

```json
{
  "status": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 6,
      "name": "John Doe",
      "email": "user@example.com",
      "contact": "03001234567",
      "company": "Example Brand"
    }
  }
}
```

**Errors:** `400` missing field, `409` email already registered

---

### 3.3 Register Simple

Registers using form-data or POST fields (uses model's `register_pro`).

```
POST /api/auth/register-simple
```

No documented request body — passes POST data directly to the model.

---

### 3.4 Logout

```
POST /api/auth/logout
```

**Response 200:**

```json
{
  "status": true,
  "message": "Logged out successfully",
  "data": true
}
```

---

### 3.5 Profile (Auth Required)

Returns the logged-in user's profile.

```
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": 5,
    "name": "John Doe",
    "email": "user@example.com",
    "contact": "03001234567",
    "company": "Example Brand",
    "image": "profile.jpg",
    "city": "Lahore",
    "date": "06-Aug-2026"
  }
}
```

**Errors:** `401` no/invalid token, `404` user not found

---

## 4. Homepage

### 4.1 Home Data

Returns all data needed for the homepage.

```
GET /api/home
```

**Response 200 (data keys):**

| Key            | Type   | Description                        |
|----------------|--------|------------------------------------|
| `counties`     | array  | Countries for search               |
| `seo`          | object | SEO meta data                      |
| `adverts`      | array  | Advertisement banners              |
| `center`       | array  | Center slider adverts              |
| `featured`     | object | Featured franchise companies       |
| `news`         | array  | Latest news                        |
| `articles`     | array  | Articles                           |
| `testimonials` | array  | Testimonials                       |
| `stories`      | array  | Success stories                    |
| `categories`   | array  | Franchise categories               |
| `ranges`       | array  | Investment ranges                  |
| `cities`       | array  | Cities                             |
| `property`     | array  | Property listings                  |
| `franchisee`   | array  | Franchisee testimonials            |
| `franchiser`   | array  | Franchiser testimonials            |

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "categories": [
      {
        "c_id": "16",
        "c_name": "Food Franchise",
        "c_slug": "food_franchise",
        "c_image": "4853c55171f119489939df5c2b31ad54.jpg",
        "c_place_home": "1"
      }
    ],
    "featured": {
      "1116": {
        "co_id": "1116",
        "co_category_id": "16",
        "co_name": "Strips & Co.",
        "co_slug": "strips_co"
      }
    }
  }
}
```

### 4.2 Admin Home Data

```
GET /api/home/admin
```

Returns admin dashboard data: counties, categories, companies, featured franchises, seo, adverts, testimonials, news.

---

## 5. Companies

### 5.1 Company Directory

Lists all companies with search support.

```
GET /api/companies?q=<search_term>
```

| Query Param | Type   | Description     |
|-------------|--------|-----------------|
| `q`         | string | Optional search |

**Response 200 (data keys):** `categories`, `ranges`, `cities`, `companies`

### 5.2 Single Company

```
GET /api/companies/:slug
```

| Param  | Description                    |
|--------|--------------------------------|
| `slug` | Company slug e.g. `strips_co`  |

**Response 200 (data keys):**

| Key         | Type   | Description                    |
|-------------|--------|--------------------------------|
| `company`   | object | Company details                |
| `related`   | array  | Related companies in category  |
| `companyEmp`| array  | Company employees              |
| `city`      | array  | Cities list                    |
| `categories`| array  | Categories list                |

**Errors:** `400` missing slug, `404` company not found

### 5.3 Companies by Category

```
GET /api/companies/category/:slug
```

| Param  | Description                      |
|--------|----------------------------------|
| `slug` | Category slug e.g. `food_franchise` |

**Response 200 (data keys):** `ranges`, `categories`, `cities`, `company_name`, `companies`, `news`

### 5.4 Company Search

```
GET /api/companies/search
```

**Response 200 (data keys):** `companies`, `categories`, `news`, `company_name` (if present)

### 5.5 Filter Companies

Filters companies by category, investment range, and city.

```
POST /api/companies/filter
```

**Request Body (JSON)** — all fields optional, but at least one required:

```json
{
  "cat": "16",
  "range": 5000000,
  "city": "Lahore"
}
```

| Field | Description                     |
|-------|---------------------------------|
| `cat` | Category ID                     |
| `range` | Maximum investment (filters `co_total_investment <= range`) |
| `city` | City name                       |

**Response 200 (data keys):** `heading`, `categories`, `companies`

### 5.6 Top 10 Companies

```
GET /api/companies/top10
```

**Response 200 (data keys):** `categories`, `companies`

### 5.7 International Companies

```
GET /api/companies/international
```

**Response 200 (data keys):** `ranges`, `categories`, `cities`, `companies`

---

## 6. Franchise

### 6.1 Franchise Resale List

```
GET /api/franchise/resale
```

**Response 200 (data keys):** `categories`, `franchise`, `news`

### 6.2 Single Resale Franchise

```
GET /api/franchise/resale/:id
```

| Param | Description       |
|-------|-------------------|
| `id`  | Franchise ID      |

**Response 200 (data keys):** `ranges`, `categories`, `cities`, `franchise`

### 6.3 New Franchises

```
GET /api/franchise/new
```

**Response 200 (data keys):** `ranges`, `categories`, `cities`, `franchise`

---

## 7. Properties

### 7.1 List Properties

```
GET /api/properties
```

**Response 200 (data keys):** `categories`, `property`

### 7.2 Single Property

```
GET /api/properties/:id
```

| Param | Description     |
|-------|-----------------|
| `id`  | Property ID     |

**Response 200 (data keys):** `ranges`, `categories`, `property`, `city`

### 7.3 Add Property (Auth Required)

```
POST /api/properties/add
```

**Headers:**
```
Authorization: Bearer <token>
```

Passes form data to the `add_property` model method.

**Response 201:**
```json
{
  "status": true,
  "message": "Property added successfully",
  "data": true
}
```

---

## 8. Jobs

### 8.1 List Jobs

```
GET /api/jobs
```

**Response 200 (data keys):** `ranges`, `categories`, `cities`, `jobs`

Job object example:

```json
{
  "j_id": "1",
  "j_brandName": "Franchise Pakistan",
  "j_jobTitle": "Web Developer",
  "j_salary": "20000",
  "j_qualification": "Master",
  "j_keyResponsiblities": "Web Page development",
  "j_status": "1",
  "j_createDate": "17-Mar-2017",
  "j_createTime": "16:03:27",
  "j_image_name": "0e91005c169c25d6215bf0b51993af46.jpeg"
}
```

### 8.2 Single Job

```
GET /api/jobs/:id
```

| Param | Description |
|-------|-------------|
| `id`  | Job ID      |

**Response 200 (data keys):** `ranges`, `categories`, `cities`, `jobs`, `news`

---

## 9. Events

### 9.1 List Events

```
GET /api/events
```

**Response 200 (data keys):** `seo`, `categories`, `events`, `news`

### 9.2 Past Events

```
GET /api/events/past
```

**Response 200 (data keys):** `seo`, `categories`, `events`, `news`

### 9.3 Single Event

```
GET /api/events/:id
```

| Param | Description |
|-------|-------------|
| `id`  | Event ID    |

**Response 200 (data keys):** `ranges`, `categories`, `cities`, `events`, `related_events`

---

## 10. Content — Articles

### 10.1 List Articles

```
GET /api/content/articles
```

**Response 200 (data keys):** `categories`, `articles`

Article object example:

```json
{
  "id": "2",
  "title": "Top franchise Opportunities",
  "description": "How do I find the best Franchises to buy?...",
  "image": "",
  "status": "1",
  "link": "https://www.franchisepk.com/",
  "slug": "top_franchise",
  "date": "2019-05-01 19:00:00"
}
```

### 10.2 Single Article

```
GET /api/content/articles/:slug
```

| Param  | Description       |
|--------|-------------------|
| `slug` | Article slug      |

**Response 200 (data keys):** `categories`, `article`, `articles` (5 latest)

**Errors:** `400` missing slug, `404` article not found

---

## 11. Content — Blogs

### 11.1 List Blogs

```
GET /api/content/blogs
```

**Response 200 (data keys):** `categories`, `blogs`

### 11.2 Single Blog

```
GET /api/content/blogs/:slug
```

| Param  | Description   |
|--------|---------------|
| `slug` | Blog slug     |

**Response 200 (data keys):** `categories`, `blog`, `blogs` (5 latest)

**Errors:** `400` missing slug, `404` blog not found

---

## 12. Content — News

### 12.1 List News

```
GET /api/content/news
```

**Response 200 (data keys):** `categories`, `news`

### 12.2 Single News

```
GET /api/content/news/:slug
```

| Param  | Description   |
|--------|---------------|
| `slug` | News slug     |

**Response 200 (data keys):** `categories`, `news`, `news_all` (5 latest)

**Errors:** `400` missing slug, `404` news not found

---

## 13. Success Stories

### 13.1 List Stories

```
GET /api/stories
```

**Response 200 (data keys):** `stories`, `categories`

Story object example:

```json
{
  "story_id": "209",
  "story_name": "Jahangir Khan",
  "story_brand": "Anta",
  "story_city": "Packages Mall lahore",
  "story_desc": "By Sana Khan and Shahid Khan",
  "story_image": "IMG-20260725-WA0010.jpg",
  "story_date": "2026-07-25 09:03:01",
  "story_status": "1"
}
```

### 13.2 Single Story

```
GET /api/stories/:id
```

| Param | Description |
|-------|-------------|
| `id`  | Story ID    |

**Response 200:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "story": { ... }
  }
}
```

**Errors:** `400` missing id, `404` story not found

---

## 14. Investors

### 14.1 List Investors

```
GET /api/investors
```

**Response 200 (data keys):** `seo`, `categories`, `investor`, `news`

---

## 15. Info Pages

All info endpoints return a standardized response:

```
GET /api/info/faqs
GET /api/info/about
GET /api/info/about-franchises
GET /api/info/disclaimer
GET /api/info/privacy
GET /api/info/consultancy
GET /api/info/investor-consultant
GET /api/info/interior
GET /api/info/marketing
GET /api/info/vacancies
GET /api/info/partners
```

**Response 200:** each returns `categories` (and `partners` for `/api/info/partners`).

**Special case — About Franchises:**

```
GET /api/info/about-franchises
```

**Response 200 (data keys):**

| Key           | Type   | Description             |
|---------------|--------|-------------------------|
| `categories`  | array  | Categories list         |
| `adverts`     | array  | Adverts                 |
| `content`     | object | About us content        |
| `usps`        | array  | About us USP items      |
| `order_service`| object| Order service section   |

---

## 16. Contact & Subscribe

### 16.1 Contact Data

```
GET /api/contact
```

**Response 200 (data keys):** `categories`, `employee`, `city`, `offices`, `companies`

### 16.2 Employee Contact Data

```
GET /api/contact/employee
```

**Response 200 (data keys):** `categories`, `city`, `companies`

### 16.3 Subscribe

Subscribes an email to the newsletter.

```
POST /api/subscribe?email=user@example.com
```

**Or**

```
POST /api/subscribe
Content-Type: application/x-www-form-urlencoded

email=user@example.com
```

| Param   | Type   | Description    |
|---------|--------|----------------|
| `email` | string | Email address  |

**Response 200:**
```json
{
  "status": true,
  "message": "Subscribed successfully",
  "data": true
}
```

**Errors:** `400` email required, `500` subscription failed

---

## 17. Subscribers (Auth Required)

### 17.1 List Subscribers

```
GET /api/subscribers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200 (data keys):** `categories`, `subs`

### 17.2 Delete Subscriber

```
DELETE /api/subscribers/:id
```

| Param | Description       |
|-------|-------------------|
| `id`  | Subscriber ID     |

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "status": true,
  "message": "Subscriber deleted successfully",
  "data": true
}
```

---

## 18. Search / Lookups

### 18.1 Provinces by Country

```
GET /api/search/province/:id
```

| Param | Description  |
|-------|--------------|
| `id`  | Country ID   |

**Response 200:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "result": 1,
    "data": [ ... provinces ... ]
  }
}
```

### 18.2 Cities by Province

```
GET /api/search/city/:id
```

| Param | Description |
|-------|-------------|
| `id`  | Province ID |

**Response 200:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "result": 1,
    "data": [ ... cities ... ]
  }
}
```

### 18.3 Categories

```
GET /api/search/categories
```

**Response 200 (data keys):** `categories`

### 18.4 Companies Search

```
GET /api/search/companies
```

**Response 200 (data keys):** `companies`, `categories`, `ranges`, `cities`

---

## 19. Utility

### 19.1 Categories

```
GET /api/categories
```

**Response 200 (data keys):** `categories`

### 19.2 Investment Ranges

```
GET /api/ranges
```

**Response 200 (data keys):** `ranges`

### 19.3 Cities

```
GET /api/cities
```

**Response 200 (data keys):** `cities`

---

## 20. Admin Email (Auth Required)

### 20.1 Send Email to Subscribers

```
POST /api/admin/email/subscribers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (JSON):**

```json
{
  "from": 1,
  "to": 10,
  "subject": "Franchise Opportunities"
}
```

| Field     | Description                       |
|-----------|-----------------------------------|
| `from`    | Starting index (1-based)          |
| `to`      | Ending index                      |
| `subject` | Email subject                     |

**Response 200:**
```json
{
  "status": true,
  "message": "Emails processed",
  "data": {
    "sent": 10,
    "failed": 0
  }
}
```

### 20.2 Send Email to Requests

```
POST /api/admin/email/requests
```

Same request format as 20.1. Sends to email requests instead of subscribers.

---

## 21. Quick Start Examples

### JavaScript (fetch)

```js
// Public GET
const res = await fetch('https://franchisepk.com/api/home');
const data = await res.json();
console.log(data.status, data.data.categories);

// Login
const loginRes = await fetch('https://franchisepk.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password123' })
});
const login = await loginRes.json();
const token = login.data.token;

// Authenticated request
const profileRes = await fetch('https://franchisepk.com/api/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const profile = await profileRes.json();
```

### Axios

```js
const api = axios.create({
  baseURL: 'https://franchisepk.com/api'
});

// Public
const { data } = await api.get('/companies');

// Auth
const login = await api.post('/auth/login', { email, password });
api.defaults.headers.common['Authorization'] = `Bearer ${login.data.data.token}`;

// Protected
const profile = await api.get('/auth/profile');
```

### Android (Retrofit)

```java
public interface ApiService {
    @GET("home")
    Call<HomeResponse> getHome();

    @POST("auth/login")
    Call<LoginResponse> login(@Body LoginRequest body);

    @GET("auth/profile")
    Call<ProfileResponse> getProfile(@Header("Authorization") String token);
}
```

### iOS (Swift)

```swift
let url = URL(string: "https://franchisepk.com/api/home")!
URLSession.shared.dataTask(with: url) { data, _, _ in
    let json = try? JSONSerialization.jsonObject(with: data!)
}.resume()
```

### cURL

```bash
# Public endpoint
curl https://franchisepk.com/api/home

# Login
curl -X POST https://franchisepk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Protected endpoint with token
curl https://franchisepk.com/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 22. Endpoint Summary Table

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login & get token |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/register-simple` | No | Register (simple) |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/auth/profile` | **Yes** | User profile |
| GET | `/api/home` | No | Homepage data |
| GET | `/api/home/admin` | No | Admin home data |
| GET | `/api/companies` | No | Company directory |
| GET | `/api/companies/:slug` | No | Single company |
| GET | `/api/companies/category/:slug` | No | Companies by category |
| GET | `/api/companies/search` | No | Search companies |
| POST | `/api/companies/filter` | No | Filter companies |
| GET | `/api/companies/top10` | No | Top 10 companies |
| GET | `/api/companies/international` | No | International companies |
| GET | `/api/franchise/resale` | No | Resale franchises |
| GET | `/api/franchise/resale/:id` | No | Single resale |
| GET | `/api/franchise/new` | No | New franchises |
| GET | `/api/properties` | No | Property list |
| GET | `/api/properties/:id` | No | Single property |
| POST | `/api/properties/add` | **Yes** | Add property |
| GET | `/api/jobs` | No | Job list |
| GET | `/api/jobs/:id` | No | Single job |
| GET | `/api/events` | No | Events list |
| GET | `/api/events/past` | No | Past events |
| GET | `/api/events/:id` | No | Single event |
| GET | `/api/content/articles` | No | Articles list |
| GET | `/api/content/articles/:slug` | No | Single article |
| GET | `/api/content/blogs` | No | Blogs list |
| GET | `/api/content/blogs/:slug` | No | Single blog |
| GET | `/api/content/news` | No | News list |
| GET | `/api/content/news/:slug` | No | Single news |
| GET | `/api/stories` | No | Stories list |
| GET | `/api/stories/:id` | No | Single story |
| GET | `/api/investors` | No | Investors list |
| GET | `/api/info/*` | No | 11 info pages |
| GET | `/api/contact` | No | Contact data |
| GET | `/api/contact/employee` | No | Employee contact data |
| POST | `/api/subscribe` | No | Newsletter subscribe |
| GET | `/api/subscribers` | **Yes** | Subscriber list |
| DELETE | `/api/subscribers/:id` | **Yes** | Delete subscriber |
| GET | `/api/search/province/:id` | No | Provinces |
| GET | `/api/search/city/:id` | No | Cities |
| GET | `/api/search/categories` | No | Categories |
| GET | `/api/search/companies` | No | Companies search |
| GET | `/api/categories` | No | Categories |
| GET | `/api/ranges` | No | Investment ranges |
| GET | `/api/cities` | No | Cities |
| POST | `/api/admin/email/subscribers` | **Yes** | Bulk email to subscribers |
| POST | `/api/admin/email/requests` | **Yes** | Bulk email to requests |
