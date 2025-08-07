
# 🎯 Applicant Management Backend (NestJS + PostgreSQL)

A production-ready backend API for managing applicants using **NestJS**, **Sequelize**, and **PostgreSQL**, following REST principles, RBAC, file upload, and OWASP Top 10 security standards.

---

## ⚙️ Features

- JWT Authentication with role-based access (admin, hr, reviewer)
- CRUD operations on applicants
- Resume upload with Multer (PDF only, max 5MB)
- Custom actions: schedule interview, approve, reject
- Filtering, pagination, and sorting
- Swagger documentation at `/api-docs`
- OWASP Top 10 API security compliance
- Modular code with DTO validation

---

## 🧱 Tech Stack

- **NestJS** + **TypeScript**
- **PostgreSQL** + **Sequelize**
- **JWT** for Auth
- **Multer** for file uploads
- **Swagger** for API Docs
- **class-validator**, **throttler**, **helmet**