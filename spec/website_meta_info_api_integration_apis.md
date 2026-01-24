# Website Integration APIs

This document provides comprehensive API documentation for integrating the pizza backend with your website frontend.

**Base URL:** `/api/v1`

**Authentication:** Public endpoints require no authentication. Admin endpoints require JWT Bearer token in the `Authorization` header.

---

## Table of Contents

1. [Opening Hours](#1-opening-hours)
2. [Social Media](#2-social-media)
3. [Contact Info](#3-contact-info)
4. [Logos](#4-logos)
5. [Policies](#5-policies)
6. [General Ratings (Testimonials)](#6-general-ratings-testimonials)
7. [Contact Queries](#7-contact-queries)
8. [Reservation Form](#8-reservation-form)

---

## Quick Reference - Public Endpoints

### GET APIs (Data Fetching)

| Endpoint | Purpose |
|----------|---------|
| `GET /opening-hours/list` | Get store opening hours |
| `GET /social-media/list` | Get social media links |
| `GET /contact-info/published` | Get published contact info |
| `GET /logos/list` | Get all logos |
| `GET /logos/details?type=header&theme=light` | Get specific logo |
| `GET /policies/list` | Get policy list |
| `GET /policies/details/:slug` | Get policy content |
| `GET /general-ratings/list` | Get published testimonials |

### POST APIs (Form Submissions)

| Endpoint | Purpose |
|----------|---------|
| `POST /contact-queries/create` | Submit contact form |
| `POST /general-ratings/create` | Submit rating/testimonial |
| `POST /reservation-form/create` | Submit reservation request |

---

## 1. Opening Hours

Base path: `/opening-hours`

### GET `/opening-hours/list`

Get all opening hours for the store.

**Authentication:** Public

**Response:**
```typescript
{
  statusCode: 200,
  data: Array<{
    _id: string
    day: string           // e.g., "Monday"
    startTime: string     // e.g., "09:00"
    endTime: string       // e.g., "23:00"
    sortOrder: number     // For display ordering
    createdAt: string     // ISO date
    updatedAt: string     // ISO date
  }>
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "22:00",
      "sortOrder": 1,
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "day": "Tuesday",
      "startTime": "09:00",
      "endTime": "22:00",
      "sortOrder": 2,
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/opening-hours/create` | Create opening hours |
| PUT | `/opening-hours/edit/:id` | Update opening hours |
| DELETE | `/opening-hours/delete/:id` | Delete opening hours |

**POST `/opening-hours/create` Request Body:**
```typescript
{
  day: string       // Required, 2-20 characters (e.g., "Monday")
  startTime: string // Required, HH:MM format (e.g., "09:00")
  endTime: string   // Required, HH:MM format (e.g., "23:00")
  sortOrder: number // Required, integer >= 1
}
```

**PUT `/opening-hours/edit/:id` Request Body:**
```typescript
{
  day?: string       // Optional, 2-20 characters
  startTime?: string // Optional, HH:MM format
  endTime?: string   // Optional, HH:MM format
  sortOrder?: number // Optional, integer >= 1
}
```

**Rate Limiting:**
- Create: 30 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## 2. Social Media

Base path: `/social-media`

### GET `/social-media/list`

Get all social media links.

**Authentication:** Public

**Response:**
```typescript
{
  statusCode: 200,
  data: Array<{
    _id: string
    name: string    // e.g., "Facebook"
    logo: string    // Image URL
    link: string    // Social media URL
    createdAt: string
    updatedAt: string
  }>
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Facebook",
      "logo": "https://example.com/uploads/facebook-icon.png",
      "link": "https://facebook.com/pizzastore",
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Instagram",
      "logo": "https://example.com/uploads/instagram-icon.png",
      "link": "https://instagram.com/pizzastore",
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/social-media/create` | Create social media entry |
| PUT | `/social-media/edit/:id` | Update social media entry |
| DELETE | `/social-media/delete/:id` | Delete social media entry |

**POST `/social-media/create` Request Body:**
```typescript
{
  name: string // Required, 2-50 characters (e.g., "Facebook")
  logo: string // Required, image URL
  link: string // Required, valid URL
}
```

**PUT `/social-media/edit/:id` Request Body:**
```typescript
{
  name?: string // Optional, 2-50 characters
  logo?: string // Optional, image URL
  link?: string // Optional, valid URL
}
```

**Rate Limiting:**
- Create: 30 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## 3. Contact Info

Base path: `/contact-info`

### GET `/contact-info/published`

Get the published contact information for display on the website.

**Authentication:** Public

**Response:**
```typescript
{
  statusCode: 200,
  data: {
    _id: string
    addressLine1: string
    addressLine2?: string
    area: string
    city: string
    county?: string
    zip: string
    phone: string
    email: string
    lat?: number
    lng?: number
    immediatePhoneNo?: string
    immediateEmail?: string
    isPublished: boolean
    createdAt: string
    updatedAt: string
  } | null
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "addressLine1": "123 Pizza Street",
    "addressLine2": "Suite 100",
    "area": "Downtown",
    "city": "New York",
    "county": "Manhattan",
    "zip": "10001",
    "phone": "+1-234-567-8900",
    "email": "contact@pizzastore.com",
    "lat": 40.7128,
    "lng": -74.006,
    "immediatePhoneNo": "+1-234-567-8901",
    "immediateEmail": "urgent@pizzastore.com",
    "isPublished": true,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  }
}
```

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/contact-info/list` | Get all contact info (paginated) |
| POST | `/contact-info/create` | Create contact info |
| PUT | `/contact-info/edit/:id` | Update contact info |
| DELETE | `/contact-info/delete/:id` | Delete contact info |

**GET `/contact-info/list` Query Parameters:**
```typescript
{
  page?: number       // Default: 1, Min: 1
  limit?: number      // Default: 10, Min: 1, Max: 100
  sortBy?: string     // Field name to sort by
  isAscending?: boolean // Sort direction
  isPublished?: boolean // Filter by published status
}
```

**POST `/contact-info/create` Request Body:**
```typescript
{
  addressLine1: string      // Required, 2-200 characters
  addressLine2?: string     // Optional, 2-200 characters (can be empty string)
  area: string              // Required, 2-100 characters
  city: string              // Required, 2-100 characters
  county?: string           // Optional, 2-100 characters (can be empty string)
  zip: string               // Required, 2-20 characters
  phone: string             // Required, valid phone pattern
  email: string             // Required, valid email
  lat?: number              // Optional, -90 to 90
  lng?: number              // Optional, -180 to 180
  immediatePhoneNo?: string // Optional, valid phone pattern (can be empty string)
  immediateEmail?: string   // Optional, valid email (can be empty string)
  isPublished?: boolean     // Default: false
}
```

**PUT `/contact-info/edit/:id` Request Body:**
All fields from create are optional.

**Rate Limiting:**
- Create: 30 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## 4. Logos

Base path: `/logos`

### GET `/logos/list`

Get all logos.

**Authentication:** Public

**Response:**
```typescript
{
  statusCode: 200,
  data: Array<{
    _id: string
    logoImage: string                      // Image URL
    type: "header" | "favicon" | "footer"
    theme: "dark" | "light"
    isPublished: boolean
    createdAt: string
    updatedAt: string
  }>
}
```

### GET `/logos/details`

Get a specific logo by type and theme.

**Authentication:** Public

**Query Parameters:**
```typescript
{
  type: string  // Required: "header" | "favicon" | "footer"
  theme: string // Required: "dark" | "light"
}
```

**Example Request:**
```
GET /logos/details?type=header&theme=light
```

**Response:**
```typescript
{
  statusCode: 200,
  data: {
    _id: string
    logoImage: string
    type: "header" | "favicon" | "footer"
    theme: "dark" | "light"
    isPublished: boolean
    createdAt: string
    updatedAt: string
  } | null
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "logoImage": "https://example.com/uploads/logo-light.png",
    "type": "header",
    "theme": "light",
    "isPublished": true,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  }
}
```

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/logos/create` | Create logo |
| PUT | `/logos/edit/:id` | Update logo |
| DELETE | `/logos/delete/:id` | Delete logo |

**POST `/logos/create` Request Body:**
```typescript
{
  logoImage: string    // Required, image URL
  type: string         // Required: "header" | "favicon" | "footer"
  theme: string        // Required: "dark" | "light"
  isPublished?: boolean // Default: false
}
```

**PUT `/logos/edit/:id` Request Body:**
```typescript
{
  logoImage?: string    // Optional, image URL
  type?: string         // Optional: "header" | "favicon" | "footer"
  theme?: string        // Optional: "dark" | "light"
  isPublished?: boolean // Optional
}
```

**Rate Limiting:**
- Create: 30 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## 5. Policies

Base path: `/policies`

### GET `/policies/list`

Get all policies (without full content).

**Authentication:** Public

**Response:**
```typescript
{
  statusCode: 200,
  data: Array<{
    _id: string
    name: string
    slug: string
    showOnFooter: boolean
    createdAt: string
    updatedAt: string
  }>
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Privacy Policy",
      "slug": "privacy-policy",
      "showOnFooter": true,
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Terms and Conditions",
      "slug": "terms-and-conditions",
      "showOnFooter": true,
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

### GET `/policies/details/:slug`

Get full policy content by slug.

**Authentication:** Public

**URL Parameters:**
```typescript
{
  slug: string // 2-100 chars, lowercase, letters/numbers/hyphens only
}
```

**Example Request:**
```
GET /policies/details/privacy-policy
```

**Response:**
```typescript
{
  statusCode: 200,
  data: {
    _id: string
    name: string
    content: string    // Full HTML/Markdown content
    slug: string
    showOnFooter: boolean
    createdAt: string
    updatedAt: string
  } | null
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Privacy Policy",
    "content": "<h1>Privacy Policy</h1><p>This is our privacy policy content...</p>",
    "slug": "privacy-policy",
    "showOnFooter": true,
    "createdAt": "2025-01-10T10:00:00.000Z",
    "updatedAt": "2025-01-10T10:00:00.000Z"
  }
}
```

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/policies/details/id/:id` | Get policy by ID |
| POST | `/policies/create` | Create policy |
| PUT | `/policies/edit/:id` | Update policy |
| DELETE | `/policies/delete/:id` | Delete policy |

**POST `/policies/create` Request Body:**
```typescript
{
  name: string         // Required, 2-100 characters
  content: string      // Required, min 10 characters (HTML/Markdown)
  slug: string         // Required, 2-100 chars, lowercase, letters/numbers/hyphens
  showOnFooter?: boolean // Default: false
}
```

**PUT `/policies/edit/:id` Request Body:**
All fields from create are optional.

**Rate Limiting:**
- Create: 30 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## 6. General Ratings (Testimonials)

Base path: `/general-ratings`

### GET `/general-ratings/list`

Get published customer ratings/testimonials.

**Authentication:** Public

**Query Parameters:**
```typescript
{
  page?: number       // Default: 1, Min: 1
  limit?: number      // Default: 10, Min: 1, Max: 100
  sortBy?: string     // Field name to sort by
  isAscending?: boolean // Sort direction
}
```

**Example Request:**
```
GET /general-ratings/list?page=1&limit=5
```

**Response:**
```typescript
{
  statusCode: 200,
  data: {
    ratings: Array<{
      _id: string
      personName: string
      personImage?: string
      ratings: number        // 1-5
      personTagRole?: string // e.g., "Regular Customer"
      isPublished: boolean
      createdAt: string
      updatedAt: string
    }>,
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
```

**Example Response:**
```json
{
  "statusCode": 200,
  "data": {
    "ratings": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "personName": "John Doe",
        "personImage": "https://example.com/uploads/john.jpg",
        "ratings": 5,
        "personTagRole": "Regular Customer",
        "isPublished": true,
        "createdAt": "2025-01-10T10:00:00.000Z",
        "updatedAt": "2025-01-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 25,
      "totalPages": 5
    }
  }
}
```

### POST `/general-ratings/create`

Submit a new rating/testimonial.

**Authentication:** Public

**Rate Limiting:** 5 requests/hour (strict)

**Request Body:**
```typescript
{
  personName: string     // Required, 2-100 characters
  personImage?: string   // Optional, image URL (can be empty string)
  ratings: number        // Required, 1-5 (integer)
  personTagRole?: string // Optional, 2-50 characters (can be empty string)
  personPhone?: string   // Optional, valid phone pattern (can be empty string)
}
```

**Example Request:**
```json
{
  "personName": "Jane Smith",
  "ratings": 5,
  "personTagRole": "Food Blogger"
}
```

**Response:**
```typescript
{
  statusCode: 201,
  data: {
    _id: string
    personName: string
    personImage?: string
    ratings: number
    personTagRole?: string
    isPublished: boolean  // Default: false (needs admin approval)
    createdAt: string
    updatedAt: string
  }
}
```

**Note:** Newly submitted ratings have `isPublished: false` by default and require admin approval to appear in the public list.

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/general-ratings/admin/list` | Get all ratings (with filters) |
| PUT | `/general-ratings/edit/:id` | Update rating (approve/edit) |
| DELETE | `/general-ratings/delete/:id` | Delete rating |

**GET `/general-ratings/admin/list` Query Parameters:**
```typescript
{
  page?: number
  limit?: number
  sortBy?: string
  isAscending?: boolean
  isPublished?: boolean // Filter by published status
}
```

**PUT `/general-ratings/edit/:id` Request Body:**
```typescript
{
  personName?: string
  personImage?: string
  ratings?: number
  personTagRole?: string
  isPublished?: boolean  // Set to true to approve
  personPhone?: string
}
```

**Rate Limiting:**
- Create (Public): 5 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## 7. Contact Queries

Base path: `/contact-queries`

### POST `/contact-queries/create`

Submit a contact form.

**Authentication:** Public

**Rate Limiting:** 10 requests/hour

**Request Body:**
```typescript
{
  name: string    // Required, 2-100 characters
  email: string   // Required, valid email
  phone?: string  // Optional, valid phone pattern (can be empty string)
  subject: string // Required, one of: "general inquiry" | "order issue" | "feedback" | "other" | "reservation" | "general complaint"
  message: string // Required, 10-2000 characters
}
```

**Example Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "subject": "general inquiry",
  "message": "I have a question about your catering services. Do you offer packages for corporate events?"
}
```

**Response:**
```typescript
{
  statusCode: 201,
  data: {
    _id: string
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    status: "open"
    createdAt: string
    updatedAt: string
  }
}
```

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/contact-queries/list` | Get all queries (paginated) |
| PUT | `/contact-queries/edit/:id` | Update query (respond/close) |
| DELETE | `/contact-queries/delete/:id` | Delete query |

**GET `/contact-queries/list` Query Parameters:**
```typescript
{
  page?: number
  limit?: number
  sortBy?: string
  isAscending?: boolean
  status?: string // Filter: "open" | "closed"
}
```

**PUT `/contact-queries/edit/:id` Request Body:**
```typescript
{
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  status?: string          // "open" | "closed"
  closingMessage?: string  // Max 1000 characters (can be empty string)
}
```

**Contact Query Response Type:**
```typescript
{
  _id: string
  name: string
  email: string
  phone?: string
  subject: "general inquiry" | "order issue" | "feedback" | "other" | "reservation" | "general complaint"
  message: string
  status: "open" | "closed"
  closingMessage?: string
  createdAt: string
  updatedAt: string
}
```

**Rate Limiting:**
- Create (Public): 10 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## 8. Reservation Form

Base path: `/reservation-form`

### POST `/reservation-form/create`

Submit a table reservation request.

**Authentication:** Public

**Rate Limiting:** 10 requests/hour

**Request Body:**
```typescript
{
  storeId: string   // Required, MongoDB ObjectId (24 hex characters)
  date: string      // Required, ISO date format (e.g., "2025-01-15")
  time: string      // Required, HH:MM format (e.g., "19:00")
  noOfGuest: number // Required, 1-100 (integer)
  name: string      // Required, 2-100 characters
  phone: string     // Required, valid phone pattern
  message?: string  // Optional, max 1000 characters (can be empty string)
}
```

**Example Request:**
```json
{
  "storeId": "507f1f77bcf86cd799439011",
  "date": "2025-01-20",
  "time": "19:30",
  "noOfGuest": 4,
  "name": "John Doe",
  "phone": "+1-234-567-8900",
  "message": "Window seat preferred if available"
}
```

**Response:**
```typescript
{
  statusCode: 201,
  data: {
    _id: string
    storeId: string
    date: string
    time: string
    noOfGuest: number
    name: string
    phone: string
    message?: string
    status: "open"
    createdAt: string
    updatedAt: string
  }
}
```

### Admin Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/reservation-form/list` | Get all reservations (paginated) |
| PUT | `/reservation-form/edit/:id` | Update reservation (confirm/cancel) |
| DELETE | `/reservation-form/delete/:id` | Delete reservation |

**GET `/reservation-form/list` Query Parameters:**
```typescript
{
  page?: number
  limit?: number
  sortBy?: string
  isAscending?: boolean
  status?: string // Filter: "open" | "cancelled" | "reserved"
}
```

**PUT `/reservation-form/edit/:id` Request Body:**
```typescript
{
  storeId?: string
  date?: string
  time?: string
  noOfGuest?: number
  name?: string
  phone?: string
  message?: string
  status?: string          // "open" | "cancelled" | "reserved"
  closingMessage?: string  // Max 1000 characters (can be empty string)
}
```

**Reservation Query Response Type:**
```typescript
{
  _id: string
  storeId: string
  date: string
  time: string
  noOfGuest: number
  name: string
  phone: string
  message?: string
  status: "open" | "cancelled" | "reserved"
  closingMessage?: string
  createdAt: string
  updatedAt: string
}
```

**Rate Limiting:**
- Create (Public): 10 requests/hour
- Update: 60 requests/15 minutes
- Delete: 20 requests/hour

---

## Error Responses

All endpoints return errors in this format:

```typescript
{
  statusCode: number  // HTTP status code (400, 401, 403, 404, 500, etc.)
  errorMessage: string
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Frontend Integration Examples

### Fetching Opening Hours (React)

```typescript
const fetchOpeningHours = async () => {
  const response = await fetch('/api/v1/opening-hours/list');
  const { data } = await response.json();
  return data;
};
```

### Fetching Logo for Header

```typescript
const fetchHeaderLogo = async (theme: 'dark' | 'light') => {
  const response = await fetch(`/api/v1/logos/details?type=header&theme=${theme}`);
  const { data } = await response.json();
  return data?.logoImage;
};
```

### Submitting Contact Form

```typescript
const submitContactForm = async (formData: ContactFormData) => {
  const response = await fetch('/api/v1/contact-queries/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage);
  }

  return response.json();
};
```

### Submitting Reservation

```typescript
const submitReservation = async (reservation: ReservationData) => {
  const response = await fetch('/api/v1/reservation-form/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...reservation,
      date: reservation.date.toISOString().split('T')[0], // Format: YYYY-MM-DD
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errorMessage);
  }

  return response.json();
};
```

### Fetching Policies for Footer

```typescript
const fetchFooterPolicies = async () => {
  const response = await fetch('/api/v1/policies/list');
  const { data } = await response.json();
  return data.filter((policy: Policy) => policy.showOnFooter);
};
```

### Fetching Testimonials

```typescript
const fetchTestimonials = async (page = 1, limit = 6) => {
  const response = await fetch(`/api/v1/general-ratings/list?page=${page}&limit=${limit}`);
  const { data } = await response.json();
  return data;
};
```
