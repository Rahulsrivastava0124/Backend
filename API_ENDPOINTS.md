# API Endpoints Documentation

## Overview

This document lists all endpoints and their associated functions in the Backend API.

---

## Authentication Routes

| Method | Endpoint  | Function      | Controller                            |
| ------ | --------- | ------------- | ------------------------------------- |
| POST   | `/login`  | login         | src/controllers/Auth/login.js         |
| POST   | `/create` | createAccount | src/controllers/Auth/CreateAccount.js |

---

## User Management Routes

| Method | Endpoint                  | Function             | Controller                            |
| ------ | ------------------------- | -------------------- | ------------------------------------- |
| GET    | `/users`                  | getAllUsers          | src/controllers/Auth/CreateAccount.js |
| GET    | `/users/:id`              | getSingleUser        | src/controllers/Auth/CreateAccount.js |
| PUT    | `/users/:id`              | updateUser           | src/controllers/Auth/CreateAccount.js |
| DELETE | `/users/:id`              | deleteUser           | src/controllers/Auth/CreateAccount.js |
| POST   | `/request-password-reset` | requestPasswordReset | src/controllers/Auth/CreateAccount.js |
| POST   | `/reset-password-otp`     | resetPasswordWithOTP | src/controllers/Auth/CreateAccount.js |
| GET    | `/users-count`            | countUsers           | src/controllers/Auth/CreateAccount.js |

---

## Project Routes

| Method | Endpoint                   | Function            | Controller                                     |
| ------ | -------------------------- | ------------------- | ---------------------------------------------- |
| POST   | `/projects`                | createProject       | src/controllers/Dashboard/ProjectController.js |
| GET    | `/projects`                | listProjects        | src/controllers/Dashboard/ProjectController.js |
| GET    | `/projects/:id`            | getProject          | src/controllers/Dashboard/ProjectController.js |
| GET    | `/projects-count`          | countProjects       | src/controllers/Dashboard/ProjectController.js |
| GET    | `/projects/zones-launches` | getZonesAndLaunches | src/controllers/Dashboard/ProjectController.js |
| PUT    | `/projects/:id`            | updateProject       | src/controllers/Dashboard/ProjectController.js |
| DELETE | `/projects/:id`            | deleteProject       | src/controllers/Dashboard/ProjectController.js |

---

## Amenity Routes

| Method | Endpoint     | Function      | Controller                                     |
| ------ | ------------ | ------------- | ---------------------------------------------- |
| POST   | `/amenities` | createAmenity | src/controllers/Dashboard/AmenityController.js |
| GET    | `/amenities` | listAmenities | src/controllers/Dashboard/AmenityController.js |

---

## Domain Routes

| Method | Endpoint                 | Function            | Controller                            |
| ------ | ------------------------ | ------------------- | ------------------------------------- |
| GET    | `/domains`               | getAllDomains       | src/controllers/Domains/GetDomains.js |
| GET    | `/domains/active-count`  | countActiveDomains  | src/controllers/Domains/GetDomains.js |
| GET    | `/domains/expired-count` | countExpiredDomains | src/controllers/Domains/GetDomains.js |

---

## Home Hero Routes

| Method | Endpoint        | Function       | Controller                                      |
| ------ | --------------- | -------------- | ----------------------------------------------- |
| POST   | `/homehero`     | addHomeHero    | src/controllers/Dashboard/HomeHeroController.js |
| GET    | `/homehero`     | getAllHomeHero | src/controllers/Dashboard/HomeHeroController.js |
| GET    | `/homehero/:id` | getHomeHero    | src/controllers/Dashboard/HomeHeroController.js |
| PUT    | `/homehero/:id` | editHomeHero   | src/controllers/Dashboard/HomeHeroController.js |
| DELETE | `/homehero/:id` | deleteHomeHero | src/controllers/Dashboard/HomeHeroController.js |

---

## Home About Routes

| Method | Endpoint         | Function      | Controller                                       |
| ------ | ---------------- | ------------- | ------------------------------------------------ |
| POST   | `/homeabout`     | addHomeAbout  | src/controllers/Dashboard/HomeAboutController.js |
| GET    | `/homeabout`     | getHomeAbout  | src/controllers/Dashboard/HomeAboutController.js |
| PUT    | `/homeabout/:id` | editHomeAbout | src/controllers/Dashboard/HomeAboutController.js |

---

## Associate Developer Routes

| Method | Endpoint                         | Function                 | Controller                                                |
| ------ | -------------------------------- | ------------------------ | --------------------------------------------------------- |
| POST   | `/associatedeveloper`            | createAssociateDeveloper | src/controllers/Dashboard/AssociateDeveloperController.js |
| GET    | `/associatedeveloper`            | getAssociateDeveloper    | src/controllers/Dashboard/AssociateDeveloperController.js |
| PUT    | `/associatedeveloper/:id`        | updateAssociateDeveloper | src/controllers/Dashboard/AssociateDeveloperController.js |
| PUT    | `/associatedeveloper/:id/:index` | updateAssociateDeveloper | src/controllers/Dashboard/AssociateDeveloperController.js |
| DELETE | `/associatedeveloper/:id`        | deleteAssociateDeveloper | src/controllers/Dashboard/AssociateDeveloperController.js |

---

## Payment List Routes

| Method | Endpoint                  | Function                  | Controller                                         |
| ------ | ------------------------- | ------------------------- | -------------------------------------------------- |
| POST   | `/paymentlist`            | createPayment             | src/controllers/Dashboard/PaymentListController.js |
| GET    | `/paymentlist`            | getAllPayments            | src/controllers/Dashboard/PaymentListController.js |
| PUT    | `/paymentlist/:id`        | updatePayment             | src/controllers/Dashboard/PaymentListController.js |
| PUT    | `/paymentlist/:id/:index` | removePaymentImageByIndex | src/controllers/Dashboard/PaymentListController.js |
| DELETE | `/paymentlist/:id`        | deletePayment             | src/controllers/Dashboard/PaymentListController.js |

---

## Review Routes

| Method | Endpoint       | Function     | Controller                                    |
| ------ | -------------- | ------------ | --------------------------------------------- |
| POST   | `/reviews`     | addReview    | src/controllers/Dashboard/ReviewController.js |
| GET    | `/reviews`     | getReviews   | src/controllers/Dashboard/ReviewController.js |
| PUT    | `/reviews/:id` | updateReview | src/controllers/Dashboard/ReviewController.js |
| DELETE | `/reviews/:id` | deleteReview | src/controllers/Dashboard/ReviewController.js |

---

## Dashboard Routes

| Method | Endpoint | Function               |
| ------ | -------- | ---------------------- |
| GET    | `/home`  | Returns "hello friend" |

---

## Summary

- **Total Endpoints:** 59
- **Route Modules:** 9
- **Controllers:** 12

### Route Files:

- `src/routes/routes.js` - Main router
- `src/routes/amenity.routes.js`
- `src/routes/project.routes.js`
- `src/routes/dashboard.routes.js`
- `src/routes/domain.routes.js`
- `src/routes/homehero.routes.js`
- `src/routes/homeabout.routes.js`
- `src/routes/associatedeveloper.routes.js`
- `src/routes/paymentlist.routes.js`
- `src/routes/review.routes.js`

---

**Last Updated:** February 20, 2026
