# Glossifi E-commerce Platform

A modern, full-stack e-commerce platform for Glossifi premium mugs. Built with cutting-edge web technologies to provide a seamless shopping experience for customers and an intuitive management interface for administrators.

## Overview

Glossifi is a complete e-commerce solution featuring a customer-facing marketing website and a secure admin dashboard. The platform enables customers to browse products, manage their shopping cart, and place orders, while administrators can manage products, track orders, and monitor business metrics.

## Key Features

### Customer Features
- Browse and search products with detailed information
- Shopping cart with quantity management (stored in browser localStorage)
- Secure checkout process with order submission
- Product wishlist functionality
- Custom personalized mug request form with image upload
- Product reviews and ratings
- Order history tracking
- Responsive design for all devices

### Admin Features
- Secure authentication system
- Product management (create, read, update, delete)
- Order management with status tracking
- Custom mug request management
- Dashboard with business statistics
- Protected admin routes

## Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js (JWT-based)
- **Validation**: Zod
- **Notifications**: React Hot Toast
- **Image Storage**: Cloudinary (free tier)
- **Font**: Montserrat (Google Fonts)

## Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/glossifi"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary Configuration (for image uploads)
# Sign up at https://cloudinary.com (free tier available)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
# Or use CLOUDINARY_URL format:
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Resend Configuration (for email notifications)
# Sign up at https://resend.com (free tier: 3,000 emails/month)
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"  # Or your verified domain email
ADMIN_EMAIL="glossyprint2025@gmail.com"  # Where to receive notifications
```

3. **Initialize database**
```bash
npm run db:generate
npm run db:push
```

4. **Create admin user**
```bash
npm run create-admin admin@glossifi.com admin123 "Admin User"
```

5. **Seed sample products (optional)**
   ```bash
   npm run seed:products
   ```

6. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
Glossifi/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/       # Public marketing pages
│   ├── admin/             # Protected admin dashboard
│   └── api/               # API route handlers
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── product/          # Product-related components
│   ├── layout/           # Layout components (Header, Footer)
│   └── admin/            # Admin-specific components
├── lib/                  # Utility libraries
│   ├── db.ts             # Prisma database client
│   ├── auth.ts           # NextAuth configuration
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
├── scripts/              # Utility scripts
│   ├── create-admin.ts   # Admin user creation script
│   └── seed-products.ts  # Product seeding script
└── public/               # Static assets
    └── logos/            # Brand logo files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database (development)
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run create-admin` - Create admin user
- `npm run seed:products` - Seed database with sample products

## Documentation

For detailed documentation, please refer to:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions and production setup
- **[DATABASE.md](./DATABASE.md)** - Database operations, migrations, and maintenance
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Code architecture and design patterns
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and changes
- **[BRANDING_GUIDE.md](./BRANDING_GUIDE.md)** - Brand colors, typography, and logo usage

## Important Notes

- **Logo Files**: Logo files are located in `/public/logos/` directory:
  - `logo-black.png` - For light backgrounds
  - `logo-white.png` - For dark backgrounds
- **Shopping Cart**: Cart data is stored in browser localStorage
- **Wishlist**: Wishlist functionality uses localStorage (database model exists for future implementation)
- **Authentication**: Admin authentication uses email/password with bcrypt hashing
- **Image Storage**: Currently supports external image URLs; cloud storage integration recommended for production

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- User accounts and authentication for customers
- Email notifications for orders
- Product image upload functionality
- Advanced search and filtering
- Order tracking system
- Customer reviews and ratings

## License

This project is private and proprietary.

