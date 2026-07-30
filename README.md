# Grocery Delivery App

A full-stack grocery delivery application that enables users to browse products, manage their shopping cart and place orders securely. The application includes asynchronous background jobs, email notifications, file uploads and a scalable REST API architecture.

---

## Features

### User Features

- User registration and login
- JWT authentication and authorization
- Browse grocery products
- Search products
- Filter products by category
- View product details
- Add products to cart
- Update cart quantity
- Remove products from cart
- Prevent adding more than five units of the same product
- Place orders
- View order history
- Manage user profiles
- Upload profile images

### Admin Features

- Create products
- Update products
- Delete products
- Upload product images
- Manage inventory
- View customer orders

### Background Jobs

- Send welcome emails after registration
- Send order confirmation emails
- Process asynchronous tasks using Inngest

---

## Tech Stack

### Frontend

- React
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- Multer
- Nodemailer
- Inngest

---

## Third-Party Services

- **Inngest** – Handles background jobs and event-driven workflows
- **Nodemailer** – Sends account and order notification emails
- **Multer** – Handles profile and product image uploads

---

## Authentication

- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Role-based authorization

---

## File Uploads

- Upload product images
- Upload user profile images
- Validate uploaded images using Multer

---

## Email Notifications

- Welcome email after user registration
- Order confirmation email
- SMTP integration using Nodemailer

---

## Background Processing

The application uses **Inngest** to execute asynchronous workflows without blocking API requests.

Examples include:

- Welcome email processing
- Order confirmation emails
- Scheduled background jobs
- Inventory-related tasks

---

## Validation

- Required field validation
- Email validation
- Password validation
- Image validation
- Quantity validation
- Product availability validation
- Maximum cart quantity limit

---

## Future Improvements

- Online payment integration
- Address management
- Wishlist
- Product reviews and ratings
- Coupons and discounts
- Real-time order tracking
- Push notifications
- Admin analytics dashboard
- Pagination
- Sorting and filtering
- Redis caching
- Docker
- CI/CD pipeline
- AWS deployment

---

## Learning Objectives

This project demonstrates practical experience with:

- REST API development
- MVC architecture
- PostgreSQL database design
- Authentication and authorization
- CRUD operations
- Background job processing with Inngest
- Email integration with Nodemailer
- File uploads using Multer
- Middleware implementation
- Error handling
- Secure API development
- Responsive frontend development

---

## License

This project was built for learning and portfolio purposes.
