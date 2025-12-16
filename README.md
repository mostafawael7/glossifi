# Glossifi E-commerce Platform

A full-stack e-commerce platform for Glossifi mugs built with Next.js 14, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## Features

### Marketing Website
- **Homepage** with hero section and featured products
- **Product Listing** page with grid layout
- **Product Detail** pages with add to cart functionality
- **Shopping Cart** with quantity management
- **Checkout** page with order submission
- **About** page with brand story
- **Contact** page with contact form

### Admin Dashboard
- **Authentication** with NextAuth.js
- **Dashboard** with statistics and recent orders
- **Product Management** with full CRUD operations
- **Order Management** with status updates
- Protected routes with session management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Tailwind
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd Glossifi
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/glossifi"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. Create an admin user:
You can create an admin user using the provided script:
```bash
npm run create-admin [email] [password] [name]
```

Example:
```bash
npm run create-admin admin@glossifi.com admin123 "Admin User"
```

Or manually using Prisma Studio: `npm run db:studio`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Glossifi/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Marketing pages (public)
│   │   ├── page.tsx       # Homepage
│   │   ├── products/      # Product listing & details
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   └── checkout/      # Checkout page
│   ├── admin/             # Admin dashboard (protected)
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # Dashboard overview
│   │   ├── products/      # Product management
│   │   └── orders/        # Order management
│   ├── api/               # API routes
│   │   ├── products/      # Product CRUD endpoints
│   │   ├── orders/        # Order endpoints
│   │   └── auth/          # Authentication endpoints
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   ├── product/          # Product-related components
│   ├── layout/           # Layout components
│   └── admin/            # Admin-specific components
├── lib/                  # Utilities
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # Auth configuration
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema & migrations
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## API Endpoints

### Products
- `GET /api/products` - List all products (public)
- `GET /api/products?featured=true` - Get featured products (public)
- `GET /api/products/[id]` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Orders
- `GET /api/orders` - List orders (admin only)
- `GET /api/orders?status=PENDING` - Filter orders by status (admin only)
- `GET /api/orders/[id]` - Get single order (admin only)
- `POST /api/orders` - Create order (public)
- `PUT /api/orders/[id]` - Update order status (admin only)

## Database Schema

### Product
- id (UUID)
- name (String)
- description (Text)
- price (Decimal)
- imageUrl (String)
- stock (Integer)
- category (String, optional)
- featured (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)

### Order
- id (UUID)
- customerName (String)
- customerEmail (String)
- customerPhone (String, optional)
- shippingAddress (Text)
- totalAmount (Decimal)
- status (Enum: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- items (JSON)
- createdAt (DateTime)
- updatedAt (DateTime)

### AdminUser
- id (UUID)
- email (String, unique)
- password (String, hashed)
- name (String)
- createdAt (DateTime)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio

## Notes

- The logo file should be placed in `public/logo.svg` or `public/logo.png`
- For production, consider adding payment integration (Stripe, PayPal)
- Image uploads can be handled via local storage initially, or cloud storage (Cloudinary, AWS S3) for production
- Admin authentication uses email/password; can be enhanced with OAuth later
- Shopping cart is stored in localStorage for simplicity

## License

This project is private and proprietary.

