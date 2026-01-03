# Changelog

All notable changes to the Glossifi e-commerce platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Payment gateway integration (Stripe, PayPal)
- Advanced search and filtering

## [0.4.0] - 2024-12-XX

### Added
- Resend email service integration
- Contact form email notifications to admin
- Custom mug request email notifications (admin + customer confirmation)
- Email utility library with HTML email templates
- Admin product filtering (search, category, featured, stock status)
- Cloudinary file upload for product images (main + additional)
- Scrollable modal forms for better UX
- OTP-based email verification system for customer accounts
- PendingRegistration model for storing unverified registrations
- OTP verification page (`/verify-otp`)
- Resend OTP functionality
- 6-digit OTP codes sent via email (10-minute expiry)
- User accounts only created after successful OTP verification

### Changed
- Product images now support file upload to Cloudinary (in addition to URL input)
- Contact form now sends emails via Resend
- Custom mug requests now trigger email notifications

### Technical Details
- Added Resend SDK for email sending
- Created email utility functions with HTML templates
- Updated product API routes to handle FormData with file uploads
- Enhanced admin product page with filtering capabilities

## [0.3.0] - 2024-12-XX

### Added
- Custom personalized mug request functionality
- CustomMugRequest database model with status tracking
- Customer-facing custom mug request form with file upload
- Cloudinary integration for image uploads (free tier)
- Admin panel for managing custom mug requests (`/admin/custom-mugs`)
- API routes for custom mug requests (`/api/custom-mug`)
- Image upload support with Cloudinary (up to 2 images per request)
- CustomMugRequestStatus enum (PENDING, QUOTED, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED)
- Custom mug request page (`/custom-mug`)
- Navigation link for custom mug requests in header
- Admin navigation link for custom mug management

### Changed
- Updated package.json with Cloudinary and Multer dependencies

### Technical Details
- Added CustomMugRequest model to Prisma schema
- Implemented file upload handling with multipart/form-data
- Cloudinary configuration for image storage and optimization
- Admin interface for viewing, updating status, and managing custom requests

## [0.2.0] - 2024-12-XX

### Added
- Customer authentication system (registration and login)
- User model with email/password authentication
- Customer order history page (`/orders`)
- Database-backed shopping cart for logged-in users
- Cart sync functionality (localStorage to database on login)
- Database-backed wishlist for logged-in users
- Wishlist sync functionality (localStorage to database on login)
- Wishlist page (`/wishlist`) for viewing saved items
- Product reviews and ratings system
- Review submission form for authenticated customers
- Product image gallery with multiple images support
- ProductImage model for storing multiple product images
- OrderItem model replacing JSON order items
- Order tracking fields (trackingNumber, shippingCarrier, estimatedDelivery, shippedAt, deliveredAt)
- Enhanced admin order management with OrderItems display
- Admin product forms with multiple images upload
- MugType enum for product categories (THERMAL, PORCELAIN, MAZZOTTE, ICED_COFFEE)
- Category filtering on products page
- Contact form API endpoint
- Auth modal component for login/registration
- Navigation links for orders and wishlist in header
- API routes for cart management (`/api/cart`, `/api/cart/sync`)
- API routes for wishlist management (`/api/wishlist`, `/api/wishlist/check`, `/api/wishlist/sync`)
- API routes for reviews (`/api/reviews`)
- API route for customer orders (`/api/orders/my`)
- API route for customer registration (`/api/auth/register`)

### Changed
- Order model now uses OrderItem relations instead of JSON
- Order model includes userId for logged-in customers
- Order model includes tracking fields for shipping
- Product model category changed from String to MugType enum
- Product model now supports multiple images via ProductImage relation
- Cart functionality: database for logged-in users, localStorage for guests
- Wishlist functionality: database for logged-in users, localStorage for guests
- NextAuth configuration updated to support both AdminUser and User models
- NextAuth session includes role field (admin/customer)
- Admin product forms support multiple images and enum categories
- Admin order management displays OrderItems with product information
- Product detail pages show image galleries and reviews

### Technical Details
- Updated Prisma schema with User, OrderItem, ProductImage, CartItem, Review models
- Added MugType enum for product categorization
- Implemented hybrid cart/wishlist system (database + localStorage)
- Added automatic sync on login for cart and wishlist
- Enhanced API routes with proper authentication and validation
- Updated documentation (DATABASE.md, ARCHITECTURE.md, CHANGELOG.md)

## [0.1.0] - 2024-01-XX

### Added
- Initial project setup with Next.js 14 and TypeScript
- Marketing website with homepage, product listing, and product detail pages
- Shopping cart functionality with localStorage persistence
- Checkout page with order submission
- Admin dashboard with authentication
- Product management (CRUD operations)
- Order management with status tracking
- Admin authentication using NextAuth.js with JWT sessions
- Database schema with Prisma (Product, Order, AdminUser, Wishlist models)
- API routes for products and orders
- Responsive design with Tailwind CSS
- Brand color system (Cream, Lime, Lavender, Purple)
- Montserrat font integration
- Logo implementation (logo-black.png, logo-white.png)
- Footer component with links
- Header component with navigation and cart icon
- Product card and grid components
- Modal component for cart display
- Toast notifications with React Hot Toast
- Input validation with Zod
- Database seeding script for sample products
- Admin user creation script
- Prisma Studio integration
- Protected admin routes
- Order status enum (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Stock management with automatic decrement on order
- Featured products functionality
- Wishlist functionality (localStorage-based, database model prepared)
- About, Contact, Privacy, Terms, and Returns pages

### Technical Details
- Next.js 14 App Router architecture
- Server and Client Components separation
- PostgreSQL database with Prisma ORM
- TypeScript for type safety
- Tailwind CSS for styling
- NextAuth.js for authentication
- bcryptjs for password hashing
- Zod for schema validation

### Documentation
- README.md with project overview and quick start guide
- BRANDING_GUIDE.md with brand colors and typography
- DEPLOYMENT.md with deployment instructions
- DATABASE.md with database operations guide
- ARCHITECTURE.md with technical architecture documentation
- CHANGELOG.md (this file)

---

## Version History

### Version 0.1.0
- **Release Date**: Initial release
- **Status**: Development/Production Ready
- **Features**: Core e-commerce functionality, admin dashboard, product and order management

---

## Change Types

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

## Notes

- Dates are in YYYY-MM-DD format
- All changes should be documented here
- Breaking changes should be clearly marked
- Migration instructions should be included for database changes

