# Architecture Documentation

Technical architecture and design patterns used in the Glossifi e-commerce platform.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)
- [Component Architecture](#component-architecture)
- [API Architecture](#api-architecture)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)

## Overview

Glossifi is built as a modern full-stack Next.js application using the App Router architecture. The application follows a component-based structure with clear separation between client and server components, API routes, and shared utilities.

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **React 18**: UI library with Server Components
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Toast notifications

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Relational database
- **NextAuth.js**: Authentication library
- **Zod**: Schema validation
- **Cloudinary**: Image upload and storage service

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Prisma Studio**: Database GUI

## Project Structure

```
Glossifi/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Route group (public pages)
│   │   ├── layout.tsx           # Marketing layout with Header/Footer
│   │   ├── page.tsx             # Homepage
│   │   ├── products/            # Product pages
│   │   │   ├── page.tsx         # Product listing
│   │   │   └── [id]/            # Dynamic product detail
│   │   ├── checkout/            # Checkout page
│   │   ├── login/              # Customer login page
│   │   ├── register/           # Customer registration page
│   │   ├── orders/             # Customer order history
│   │   ├── wishlist/           # Customer wishlist
│   │   ├── custom-mug/         # Custom mug request page
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms of service
│   │   └── returns/            # Returns policy
│   ├── admin/                   # Admin dashboard (protected)
│   │   ├── layout.tsx           # Admin layout with sidebar
│   │   ├── login/               # Admin login page
│   │   ├── dashboard/           # Admin dashboard
│   │   ├── products/            # Product management
│   │   ├── orders/              # Order management
│   │   └── custom-mugs/         # Custom mug request management
│   ├── api/                     # API routes
│   │   ├── auth/                # NextAuth endpoints
│   │   │   └── [...nextauth]/  # Catch-all auth routes
│   │   ├── auth/                # Authentication API
│   │   │   └── register/        # POST /api/auth/register
│   │   ├── products/            # Product CRUD API
│   │   │   ├── route.ts         # GET, POST /api/products
│   │   │   └── [id]/            # GET, PUT, DELETE /api/products/[id]
│   │   ├── orders/              # Order API
│   │   │   ├── route.ts         # GET, POST /api/orders
│   │   │   ├── my/              # GET /api/orders/my (customer orders)
│   │   │   └── [id]/            # GET, PUT /api/orders/[id]
│   │   ├── cart/                # Shopping cart API
│   │   │   ├── route.ts         # GET, POST, PUT, DELETE /api/cart
│   │   │   └── sync/           # POST /api/cart/sync
│   │   ├── wishlist/            # Wishlist API
│   │   │   ├── route.ts         # GET, POST, DELETE /api/wishlist
│   │   │   ├── check/           # GET /api/wishlist/check
│   │   │   └── sync/            # POST /api/wishlist/sync
│   │   ├── reviews/             # Product reviews API
│   │   │   ├── route.ts         # GET, POST /api/reviews
│   │   │   └── [id]/            # PUT, DELETE /api/reviews/[id]
│   │   ├── contact/             # Contact form API
│   │   │   └── route.ts         # POST /api/contact
│   │   └── custom-mug/          # Custom mug request API
│   │       ├── route.ts         # POST /api/custom-mug
│   │       ├── list/           # GET /api/custom-mug/list (admin)
│   │       └── [id]/           # GET, PUT /api/custom-mug/[id] (admin)
│   ├── layout.tsx               # Root layout
│   ├── providers.tsx            # Client providers (SessionProvider)
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx           # Button component
│   │   ├── Card.tsx             # Card component
│   │   ├── Input.tsx            # Input component
│   │   ├── Modal.tsx            # Modal component
│   │   └── Table.tsx             # Table component
│   ├── product/                 # Product-related components
│   │   ├── ProductCard.tsx      # Product card display
│   │   ├── ProductGrid.tsx      # Product grid layout
│   │   ├── ProductImageGallery.tsx # Product image gallery
│   │   ├── Reviews.tsx          # Product reviews display
│   │   ├── ReviewForm.tsx        # Review submission form
│   │   └── Cart.tsx             # Shopping cart modal
│   ├── auth/                    # Authentication components
│   │   └── AuthModal.tsx        # Login/Register modal
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Site header with navigation
│   │   └── Footer.tsx           # Site footer
│   └── admin/                   # Admin-specific components
│       └── AdminLayout.tsx      # Admin dashboard layout
├── lib/                          # Utility libraries
│   ├── db.ts                    # Prisma client singleton
│   ├── auth.ts                  # NextAuth configuration
│   └── utils.ts                 # Helper functions
├── prisma/                       # Database schema
│   └── schema.prisma            # Prisma schema definition
├── scripts/                      # Utility scripts
│   ├── create-admin.ts          # Admin user creation
│   └── seed-products.ts         # Database seeding
├── public/                       # Static assets
│   ├── logos/                   # Brand logos
│   └── images/                  # Image assets
└── types/                        # TypeScript type definitions
    └── next-auth.d.ts           # NextAuth type extensions
```

## Design Patterns

### 1. Server and Client Components

Next.js 14 App Router uses Server Components by default. Components are marked as Client Components only when needed:

**Server Component** (default):
```typescript
// app/(marketing)/page.tsx
export default function HomePage() {
  // Runs on server, no JavaScript sent to client
}
```

**Client Component** (explicit):
```typescript
'use client'
// components/product/Cart.tsx
export const Cart: React.FC<CartProps> = ({ ... }) => {
  // Runs on client, uses React hooks
}
```

**When to use Client Components:**
- Interactive components (onClick, onChange)
- Browser APIs (localStorage, window)
- React hooks (useState, useEffect)
- Context providers

### 2. Route Groups

Route groups `(marketing)` and `(admin)` organize routes without affecting URL structure:

- `(marketing)/` - Public pages with marketing layout
- `admin/` - Admin pages with admin layout
- Both share the root layout

### 3. API Route Handlers

API routes use Next.js Route Handlers:

```typescript
// app/api/products/route.ts
export async function GET(request: NextRequest) {
  // Handle GET requests
}

export async function POST(request: NextRequest) {
  // Handle POST requests
}
```

### 4. Singleton Pattern

Prisma client uses singleton pattern to prevent multiple instances:

```typescript
// lib/db.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()
```

### 5. Validation with Zod

All API inputs are validated using Zod schemas:

```typescript
const productSchema = z.object({
  name: z.string().min(1),
  price: z.string().or(z.number()),
  // ...
})

const data = productSchema.parse(body) // Throws if invalid
```

## Data Flow

### Product Data Flow

1. **Display Products:**
   ```
   Server Component → Fetch from API → Display
   ```

2. **Add to Cart:**
   ```
   Client Component → Check auth status
   ├─ Logged in: POST /api/cart → Database
   └─ Guest: Update localStorage → Trigger re-render
   ```

3. **Create Order:**
   ```
   Client Component → POST /api/orders → Validate → Create Order + OrderItems → Update stock → Clear cart
   ```

4. **Customer Authentication:**
   ```
   Register: POST /api/auth/register → Hash password → Create User → Sign in
   Login: POST /api/auth/signin → NextAuth → Validate credentials → JWT Session
   ```

5. **Cart Sync on Login:**
   ```
   User logs in → Load localStorage cart → POST /api/cart/sync → Merge with DB cart → Clear localStorage
   ```

6. **Wishlist Management:**
   ```
   Logged in: POST /api/wishlist → Database
   Guest: Update localStorage
   ```

### Admin Data Flow

1. **Authentication:**
   ```
   Login Form → POST /api/auth/signin → NextAuth → Check AdminUser → JWT Session (role: admin)
   ```

2. **Protected Routes:**
   ```
   Page Load → Check Session + Role → Redirect if not admin → Render content
   ```

3. **Product Management:**
   ```
   Admin Form → POST /api/products → Validate → Create Product + ProductImages → Return response
   ```

4. **Order Management:**
   ```
   Admin updates order → PUT /api/orders/[id] → Update status + tracking → Auto-set timestamps
   ```

5. **Custom Mug Request Management:**
   ```
   Admin views requests → GET /api/custom-mug/list → Display all requests
   Admin updates request → PUT /api/custom-mug/[id] → Update status/price/notes → Return updated request
   ```

### Customer Data Flow

1. **Registration:**
   ```
   Register Form → POST /api/auth/register → Validate → Hash password → Create User → Sign in
   ```

2. **Order History:**
   ```
   Customer page → GET /api/orders/my → Filter by userId → Display orders with OrderItems
   ```

3. **Wishlist:**
   ```
   Add to wishlist → POST /api/wishlist → Check duplicate → Create Wishlist record
   View wishlist → GET /api/wishlist → Filter by userId → Display products
   ```

4. **Custom Mug Requests:**
   ```
   Customer form → Upload images → POST /api/custom-mug → Upload to Cloudinary → Create CustomMugRequest → Return success
   ```

5. **Reviews:**
   ```
   Submit review → POST /api/reviews → Check existing → Create Review → Update product rating
   ```

## Component Architecture

### Component Hierarchy

```
RootLayout
├── Providers (SessionProvider)
│   └── Toaster (Notifications)
│   └── MarketingLayout (Public Pages)
│       ├── Header
│       │   └── Cart (Modal)
│       ├── Page Content
│       └── Footer
│   └── AdminLayout (Admin Pages)
│       ├── AdminSidebar
│       └── Page Content
```

### Component Types

**Layout Components:**
- `app/layout.tsx` - Root layout (providers, global styles)
- `app/(marketing)/layout.tsx` - Marketing layout (Header, Footer)
- `app/admin/layout.tsx` - Admin layout (Sidebar)

**Page Components:**
- Server Components that fetch data and render UI
- Located in `app/` directory

**UI Components:**
- Reusable, presentational components
- Located in `components/ui/`

**Feature Components:**
- Domain-specific components
- Located in `components/product/`, `components/layout/`, etc.

### Component Communication

**Props Down:**
- Parent components pass data to children via props

**Events Up:**
- Children communicate with parents via callback functions

**Shared State:**
- Cart state managed in `(marketing)/layout.tsx`
- Database cart for logged-in users, localStorage for guests
- Auto-syncs localStorage cart to database on login
- Passed down via props to Header and pages

**Global State:**
- Authentication state via NextAuth SessionProvider
- Accessible via `useSession()` hook

## API Architecture

### API Route Structure

All API routes follow RESTful conventions:

```
GET    /api/products        - List all products (with filtering)
GET    /api/products/[id]   - Get single product (with images & reviews)
POST   /api/products        - Create product (admin, with images)
PUT    /api/products/[id]   - Update product (admin, with images)
DELETE /api/products/[id]   - Delete product (admin)

GET    /api/orders          - List all orders (admin)
GET    /api/orders/my       - List customer orders (authenticated)
GET    /api/orders/[id]     - Get single order (admin)
POST   /api/orders          - Create order (public, with OrderItems)
PUT    /api/orders/[id]     - Update order status & tracking (admin)

GET    /api/cart            - Get user cart (authenticated)
POST   /api/cart            - Add to cart (authenticated)
PUT    /api/cart            - Update cart item (authenticated)
DELETE /api/cart            - Remove from cart (authenticated)
POST   /api/cart/sync       - Sync localStorage cart (authenticated)

GET    /api/wishlist        - Get user wishlist (authenticated)
POST   /api/wishlist        - Add to wishlist (authenticated)
DELETE /api/wishlist        - Remove from wishlist (authenticated)
GET    /api/wishlist/check  - Check if product in wishlist
POST   /api/wishlist/sync   - Sync localStorage wishlist (authenticated)

GET    /api/reviews         - Get product reviews
POST /api/reviews           - Create review (authenticated)
PUT    /api/reviews/[id]    - Update review (authenticated)
DELETE /api/reviews/[id]    - Delete review (authenticated)

POST   /api/auth/register   - Register new customer
POST   /api/contact         - Submit contact form
```

### Request/Response Flow

1. **Request Validation:**
   ```typescript
   const body = await request.json()
   const data = schema.parse(body) // Zod validation
   ```

2. **Authentication Check:**
   ```typescript
   const session = await getServerSession(authOptions)
   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
   ```

3. **Business Logic:**
   ```typescript
   // Database operations
   const result = await db.product.create({ data })
   ```

4. **Response:**
   ```typescript
   return NextResponse.json(result, { status: 201 })
   ```

### Error Handling

All API routes use consistent error handling:

```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Invalid input", details: error.errors },
      { status: 400 }
    )
  }
  console.error("Error:", error)
  return NextResponse.json(
    { error: "Failed to process request" },
    { status: 500 }
  )
}
```

## Authentication Flow

### NextAuth Configuration

Authentication is configured in `lib/auth.ts`:

```typescript
export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({ ... })],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" }, // Default to customer login
  callbacks: {
    jwt: ({ token, user }) => {
      // Add role to token
      if (user) token.role = user.role
      return token
    },
    session: ({ session, token }) => {
      // Add role to session
      session.user.role = token.role
      return session
    }
  }
}
```

### Authentication Process

1. **Admin Login:**
   - User submits credentials with `role: 'admin'`
   - NextAuth validates against AdminUser table
   - Password verified with bcrypt
   - JWT token created with `role: 'admin'`

2. **Customer Login:**
   - User submits credentials with `role: 'customer'` (default)
   - NextAuth validates against User table
   - Password verified with bcrypt
   - JWT token created with `role: 'customer'`

3. **Customer Registration:**
   - User submits registration form
   - POST /api/auth/register validates and creates User
   - Password hashed with bcrypt
   - User automatically signed in

4. **Session Management:**
   - JWT stored in HTTP-only cookie
   - Session accessible via `useSession()` hook
   - Server-side: `getServerSession(authOptions)`
   - Role-based access control via `session.user.role`

5. **Protected Routes:**
   - Admin routes check session + role in layout
   - Redirect to `/admin/login` if not admin
   - Customer routes check session (optional)
   - Redirect to `/login` if needed

### Session Structure

```typescript
{
  user: {
    id: string
    email: string
    name: string
    role?: "admin" | "customer" // Added role field
  }
}
```

## State Management

### Client-Side State

**Local Component State:**
- `useState` for component-specific state
- Used in forms, modals, UI interactions

**Cart State:**
- Managed in `(marketing)/layout.tsx`
- Persisted in `localStorage`
- Shared across marketing pages via props

**Wishlist State:**
- Database wishlist for logged-in users
- localStorage for guest users
- Auto-syncs localStorage wishlist to database on login

### Server-Side State

**Database State:**
- Managed by Prisma
- Products, Orders, AdminUsers

**Session State:**
- Managed by NextAuth
- Stored in JWT token

### State Persistence

- **Cart (Logged in)**: Database (CartItem model)
- **Cart (Guest)**: `localStorage.getItem('cart')`
- **Wishlist (Logged in)**: Database (Wishlist model)
- **Wishlist (Guest)**: `localStorage.getItem('wishlist')`
- **Session**: NextAuth cookies (JWT)
- **Database**: PostgreSQL (Products, Orders, Users, Reviews, etc.)

## Styling Architecture

### Tailwind CSS

The application uses Tailwind CSS with custom configuration:

**Custom Colors** (defined in `tailwind.config.ts`):
```typescript
brand: {
  cream: "#FFF2EC",
  lime: "#DCEC80",
  lavender: "#B79AFF",
  purple: "#7061F0",
}
```

**Usage:**
```tsx
className="bg-brand-purple text-white"
className="text-brand-lavender"
```

### Typography

**Font Family:**
- Montserrat (Google Fonts)
- Applied globally via CSS variables

**Font Weights:**
- `font-light` (300)
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)
- `font-extrabold` (800)

### Responsive Design

Tailwind responsive breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

### Component Styling Patterns

**Utility Classes:**
- Primary styling method
- Composable and maintainable

**Component Variants:**
- Button variants: `primary`, `secondary`
- Card variants: `default`, `featured`

## File Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Pages**: lowercase (`page.tsx`, `layout.tsx`)
- **API Routes**: lowercase (`route.ts`)
- **Utilities**: camelCase (`utils.ts`, `db.ts`)
- **Types**: camelCase with `.d.ts` extension

## Code Organization Principles

1. **Separation of Concerns:**
   - UI components separate from business logic
   - API routes handle data operations
   - Utilities in `lib/` directory

2. **Reusability:**
   - UI components in `components/ui/`
   - Shared utilities in `lib/utils.ts`

3. **Type Safety:**
   - TypeScript for all code
   - Prisma generates types from schema
   - Zod validates runtime data

4. **Server-First:**
   - Default to Server Components
   - Use Client Components only when needed

## Performance Considerations

1. **Server Components:**
   - Reduce JavaScript bundle size
   - Faster initial page load

2. **Image Optimization:**
   - Next.js Image component
   - Automatic optimization and lazy loading

3. **Database Queries:**
   - Prisma query optimization
   - Selective field fetching

4. **Static Generation:**
   - Potential for ISR on product pages
   - Static pages where possible

## Security Architecture

1. **Authentication:**
   - Password hashing with bcrypt
   - JWT-based sessions
   - HTTP-only cookies

2. **Authorization:**
   - Route protection in layouts
   - API route authentication checks

3. **Input Validation:**
   - Zod schema validation
   - Type-safe database operations

4. **SQL Injection Prevention:**
   - Prisma parameterized queries
   - No raw SQL in application code

## Future Architecture Considerations

1. **State Management:**
   - Consider Zustand or Redux if state becomes complex
   - Currently localStorage is sufficient

2. **Caching:**
   - Implement Redis for session storage (if needed)
   - Add ISR for product pages

3. **API Improvements:**
   - Add rate limiting
   - Implement API versioning
   - Add request logging

4. **Database:**
   - Add database indexes for performance
   - Consider read replicas for scaling

5. **Monitoring:**
   - Add error tracking (Sentry)
   - Implement analytics
   - Performance monitoring

