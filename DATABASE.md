# Database Documentation

Complete guide for database operations, migrations, and maintenance for the Glossifi e-commerce platform.

## Table of Contents

- [Database Schema](#database-schema)
- [Prisma Setup](#prisma-setup)
- [Migrations](#migrations)
- [Database Operations](#database-operations)
- [Backup and Restore](#backup-and-restore)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Database Schema

The application uses PostgreSQL with Prisma ORM. The schema is defined in `prisma/schema.prisma`.

### Models

#### Product

Stores product information for the e-commerce catalog.

```prisma
model Product {
  id          String    @id @default(uuid())
  name        String
  description String    @db.Text
  price       Decimal   @db.Decimal(10, 2)
  imageUrl    String    // Primary/main image
  stock       Int       @default(0)
  category    MugType?  // Enum: THERMAL, PORCELAIN, MAZZOTTE, ICED_COFFEE
  featured    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  images      ProductImage[]
  orderItems  OrderItem[]
  cartItems   CartItem[]
  wishlistItems Wishlist[]
  reviews     Review[]
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Product name
- `description`: Full product description (Text)
- `price`: Product price (Decimal 10,2)
- `imageUrl`: URL to primary product image
- `stock`: Available inventory quantity
- `category`: Product category (MugType enum: THERMAL, PORCELAIN, MAZZOTTE, ICED_COFFEE)
- `featured`: Whether product is featured on homepage
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `images`: Multiple product images (ProductImage model)
- `orderItems`: Order items referencing this product
- `cartItems`: Cart items referencing this product
- `wishlistItems`: Wishlist items referencing this product
- `reviews`: Customer reviews for this product

#### Order

Stores customer orders and order status with tracking information.

```prisma
model Order {
  id              String      @id @default(uuid())
  userId          String?     // Optional for guest checkout
  customerName    String
  customerEmail   String
  customerPhone   String?
  shippingAddress String      @db.Text
  totalAmount     Decimal     @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  trackingNumber  String?
  shippingCarrier String?
  estimatedDelivery DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user            User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  items           OrderItem[]
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `userId`: Optional reference to User (for logged-in customers)
- `customerName`: Customer's full name
- `customerEmail`: Customer's email address
- `customerPhone`: Optional phone number
- `shippingAddress`: Complete shipping address (Text)
- `totalAmount`: Total order amount (Decimal 10,2)
- `status`: Current order status (enum)
- `trackingNumber`: Shipping tracking number
- `shippingCarrier`: Shipping carrier name (e.g., FedEx, UPS, USPS)
- `estimatedDelivery`: Estimated delivery date
- `shippedAt`: Timestamp when order was shipped
- `deliveredAt`: Timestamp when order was delivered
- `createdAt`: Order creation timestamp
- `updatedAt`: Last update timestamp

**Order Status Enum:**
- `PENDING` - Order received, awaiting processing
- `PROCESSING` - Order is being prepared
- `SHIPPED` - Order has been shipped
- `DELIVERED` - Order delivered to customer
- `CANCELLED` - Order cancelled

**Relations:**
- `user`: Optional reference to User model (for registered customers)
- `items`: Order items (OrderItem model) - replaces JSON structure

#### AdminUser

Stores administrator account information.

```prisma
model AdminUser {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String
  createdAt DateTime @default(now())
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `email`: Admin email (unique)
- `password`: Bcrypt-hashed password
- `name`: Admin display name
- `createdAt`: Account creation timestamp

#### User

Stores customer account information for registered users.

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String?  // Hashed with bcrypt
  name          String
  phone         String?
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  orders        Order[]
  cartItems     CartItem[]
  wishlistItems Wishlist[]
  reviews       Review[]
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `email`: User email address (unique)
- `password`: Bcrypt-hashed password (optional for OAuth)
- `name`: User display name
- `phone`: Optional phone number
- `emailVerified`: Email verification timestamp
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `orders`: Orders placed by this user
- `cartItems`: Shopping cart items
- `wishlistItems`: Wishlist items
- `reviews`: Product reviews written by this user

#### OrderItem

Stores individual items within an order with product details.

```prisma
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal  @db.Decimal(10, 2) // Snapshot of price at time of order
  createdAt DateTime @default(now())
  
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `orderId`: Reference to Order
- `productId`: Reference to Product
- `quantity`: Quantity ordered
- `price`: Price at time of order (snapshot)
- `createdAt`: Record creation timestamp

**Relations:**
- `order`: Parent order
- `product`: Product reference

#### ProductImage

Stores multiple images for a product.

```prisma
model ProductImage {
  id        String   @id @default(uuid())
  productId String
  url       String
  alt       String?
  order     Int      @default(0) // Display order
  createdAt DateTime @default(now())
  
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `productId`: Reference to Product
- `url`: Image URL
- `alt`: Optional alt text for accessibility
- `order`: Display order (0 = first)
- `createdAt`: Record creation timestamp

**Relations:**
- `product`: Parent product

#### CartItem

Stores shopping cart items for logged-in users.

```prisma
model CartItem {
  id        String   @id @default(uuid())
  userId    String
  productId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `userId`: Reference to User
- `productId`: Reference to Product
- `quantity`: Quantity in cart
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `user`: User who owns the cart item
- `product`: Product reference

**Note:** Cart items are stored in database for logged-in users. Guest users use localStorage.

#### Review

Stores customer product reviews and ratings.

```prisma
model Review {
  id        String   @id @default(uuid())
  userId    String
  productId String
  rating    Int      // 1-5 stars
  comment   String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
  
  @@unique([userId, productId])
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `userId`: Reference to User (reviewer)
- `productId`: Reference to Product
- `rating`: Star rating (1-5)
- `comment`: Optional review comment
- `createdAt`: Review creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `user`: User who wrote the review
- `product`: Product being reviewed

**Note:** Each user can only write one review per product (enforced by unique constraint).

#### Wishlist

Stores user wishlist items (favorites).

```prisma
model Wishlist {
  id        String   @id @default(uuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `userId`: Reference to User
- `productId`: Reference to Product
- `createdAt`: Record creation timestamp

**Relations:**
- `user`: User who owns the wishlist item
- `product`: Product reference

**Note:** Wishlist items are stored in database for logged-in users. Guest users use localStorage. Each user can only have one wishlist entry per product (enforced by unique constraint).

#### CustomMugRequest

Stores custom personalized mug requests from customers.

```prisma
model CustomMugRequest {
  id                 String                  @id @default(uuid())
  userId             String?                 // Optional for guest requests
  name               String
  email              String
  phone              String?
  quantity           Int
  mugType            MugType
  personalizationText String?                 @db.Text
  designPreferences  String?                 @db.Text
  imageUrls          String[]                // Array of Cloudinary URLs
  notes              String?                 @db.Text
  status             CustomMugRequestStatus  @default(PENDING)
  estimatedPrice     Decimal?                @db.Decimal(10, 2)
  adminNotes         String?                 @db.Text
  createdAt          DateTime                @default(now())
  updatedAt          DateTime                @updatedAt
  
  user               User?                   @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `userId`: Optional reference to User (for logged-in customers)
- `name`: Customer's full name
- `email`: Customer's email address
- `phone`: Optional phone number
- `quantity`: Number of mugs requested
- `mugType`: Type of mug (MugType enum)
- `personalizationText`: Text to be printed on the mug
- `designPreferences`: Customer's design preferences and requirements
- `imageUrls`: Array of Cloudinary image URLs (reference images)
- `notes`: Additional notes from customer
- `status`: Current request status (CustomMugRequestStatus enum)
- `estimatedPrice`: Admin-provided price estimate
- `adminNotes`: Internal admin notes
- `createdAt`: Request creation timestamp
- `updatedAt`: Last update timestamp

**CustomMugRequestStatus Enum:**
- `PENDING` - Request submitted, awaiting review
- `QUOTED` - Price quote provided to customer
- `APPROVED` - Request approved, ready for production
- `IN_PROGRESS` - Mug is being produced
- `COMPLETED` - Request completed
- `CANCELLED` - Request cancelled

**Relations:**
- `user`: Optional reference to User model (for registered customers)

**Note:** Images are uploaded to Cloudinary and stored as URLs. The system supports up to 2 images per request.

#### PendingRegistration

Stores pending user registrations awaiting OTP verification. User accounts are only created after OTP verification.

```prisma
model PendingRegistration {
  id         String   @id @default(uuid())
  name       String
  email      String   @unique
  password   String   // Hashed password
  phone      String?
  otp         String   // 6-digit OTP
  otpExpires  DateTime
  createdAt   DateTime @default(now())
}
```

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: User's full name
- `email`: User's email address (unique)
- `password`: Hashed password (bcrypt)
- `phone`: Optional phone number
- `otp`: 6-digit verification code
- `otpExpires`: OTP expiration timestamp (10 minutes from creation)
- `createdAt`: Registration creation timestamp

**Note:** Pending registrations expire after 10 minutes. Users can request a new OTP if it expires. Once OTP is verified, the user account is created and the pending registration is deleted.

#### MugType Enum

Product category enum for mug types.

```prisma
enum MugType {
  THERMAL
  PORCELAIN
  MAZZOTTE
  ICED_COFFEE
}
```

**Values:**
- `THERMAL` - Thermal mugs
- `PORCELAIN` - Porcelain mugs
- `MAZZOTTE` - Mazzotte mugs
- `ICED_COFFEE` - Iced coffee mugs

## Prisma Setup

### Prisma Client

The Prisma client is configured in `lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

This setup:
- Prevents multiple Prisma client instances in development
- Enables query logging in development
- Uses singleton pattern for production

### Generating Prisma Client

After schema changes, regenerate the Prisma client:

```bash
npm run db:generate
```

Or directly:

```bash
npx prisma generate
```

## Migrations

### Creating Migrations

When you modify the schema, create a migration:

```bash
npm run db:migrate
```

This will:
1. Create a new migration file in `prisma/migrations/`
2. Apply the migration to your database
3. Regenerate the Prisma client

**Migration Naming:**

Prisma will prompt for a migration name. Use descriptive names:

```
add_product_reviews
update_order_status_enum
add_user_authentication
```

### Applying Migrations

**Development:**
```bash
npm run db:migrate
```

**Production:**
```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-url"

# Apply migrations
npx prisma migrate deploy
```

### Migration Workflow

1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Create Migration**: `npm run db:migrate`
3. **Review Migration**: Check generated SQL in `prisma/migrations/`
4. **Test Locally**: Verify migration works
5. **Deploy to Production**: `npx prisma migrate deploy`

### Schema Changes Without Migrations

For quick development iterations, you can use `db:push`:

```bash
npm run db:push
```

⚠️ **Warning**: `db:push` doesn't create migration files. Use only for:
- Initial development
- Prototyping
- Quick schema experiments

**Never use `db:push` in production!**

### Resetting Database

⚠️ **Dangerous**: This deletes all data!

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run seed scripts (if configured)

## Database Operations

### Using Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

Opens at `http://localhost:5555`

Features:
- Browse all tables
- View and edit records
- Create new records
- Delete records
- Filter and search

### Creating Records

**Product:**
```typescript
const product = await db.product.create({
  data: {
    name: "Premium Mug",
    description: "A beautiful premium mug",
    price: "24.99",
    imageUrl: "https://example.com/mug.jpg",
    stock: 50,
    category: "Premium",
    featured: true,
  },
})
```

**Order with OrderItems:**
```typescript
const order = await db.order.create({
  data: {
    userId: "user-uuid", // Optional for logged-in users
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+1234567890",
    shippingAddress: "123 Main St, City, State 12345",
    totalAmount: "49.98",
    status: "PENDING",
    items: {
      create: [
        {
          productId: "product-uuid",
          quantity: 2,
          price: "24.99",
        },
      ],
    },
  },
})
```

**User:**
```typescript
const user = await db.user.create({
  data: {
    email: "user@example.com",
    password: await bcrypt.hash("password", 10),
    name: "John Doe",
    phone: "+1234567890",
  },
})
```

**CartItem:**
```typescript
const cartItem = await db.cartItem.create({
  data: {
    userId: "user-uuid",
    productId: "product-uuid",
    quantity: 2,
  },
})
```

**Wishlist:**
```typescript
const wishlistItem = await db.wishlist.create({
  data: {
    userId: "user-uuid",
    productId: "product-uuid",
  },
})
```

**Review:**
```typescript
const review = await db.review.create({
  data: {
    userId: "user-uuid",
    productId: "product-uuid",
    rating: 5,
    comment: "Great product!",
  },
})
```

**ProductImage:**
```typescript
const productImage = await db.productImage.create({
  data: {
    productId: "product-uuid",
    url: "https://example.com/image.jpg",
    alt: "Product image",
    order: 0,
  },
})
```

**Admin User:**
Use the provided script:
```bash
npm run create-admin email@example.com password "Admin Name"
```

### Querying Records

**Find All Products:**
```typescript
const products = await db.product.findMany({
  orderBy: { createdAt: 'desc' },
})
```

**Find Featured Products:**
```typescript
const featured = await db.product.findMany({
  where: { featured: true },
})
```

**Find Orders by Status:**
```typescript
const pendingOrders = await db.order.findMany({
  where: { status: 'PENDING' },
  orderBy: { createdAt: 'desc' },
})
```

**Find Single Record:**
```typescript
const product = await db.product.findUnique({
  where: { id: 'product-id' },
})
```

### Updating Records

**Update Product:**
```typescript
const updated = await db.product.update({
  where: { id: 'product-id' },
  data: {
    stock: 100,
    price: '29.99',
  },
})
```

**Update Order Status with Tracking:**
```typescript
const order = await db.order.update({
  where: { id: 'order-id' },
  data: {
    status: 'SHIPPED',
    trackingNumber: 'TRACK123456',
    shippingCarrier: 'FedEx',
    estimatedDelivery: new Date('2024-12-25'),
    shippedAt: new Date(), // Auto-set when status changes to SHIPPED
  },
})
```

**Update Order to Delivered:**
```typescript
const order = await db.order.update({
  where: { id: 'order-id' },
  data: {
    status: 'DELIVERED',
    deliveredAt: new Date(), // Auto-set when status changes to DELIVERED
  },
})
```

### Deleting Records

**Delete Product:**
```typescript
await db.product.delete({
  where: { id: 'product-id' },
})
```

⚠️ **Warning**: Deleting a product doesn't remove it from existing orders (orders store product data in JSON).

## Backup and Restore

### Creating Backups

**Using pg_dump (PostgreSQL):**

```bash
# Full database backup
pg_dump -h localhost -U username -d glossifi > backup.sql

# Backup with custom format (recommended)
pg_dump -h localhost -U username -d glossifi -F c -f backup.dump

# Backup specific tables
pg_dump -h localhost -U username -d glossifi -t Product -t Order > tables.sql
```

**Using Prisma Migrate:**

Migrations serve as a form of backup. Keep all migration files in version control.

### Restoring Backups

**From SQL file:**
```bash
psql -h localhost -U username -d glossifi < backup.sql
```

**From custom format:**
```bash
pg_restore -h localhost -U username -d glossifi backup.dump
```

### Automated Backups

**Using cron (Linux/Mac):**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -h localhost -U username -d glossifi > /backups/glossifi-$(date +\%Y\%m\%d).sql
```

**Using Cloud Provider Tools:**

- **Vercel Postgres**: Automatic backups enabled
- **Supabase**: Daily backups included
- **AWS RDS**: Automated backups configurable
- **DigitalOcean**: Automated backups available

## Common Tasks

### Seeding Products

Use the provided seed script:

```bash
npm run seed:products
```

Or customize `scripts/seed-products.ts` and run:

```bash
npx tsx scripts/seed-products.ts
```

### Updating Stock After Order

Stock is automatically decremented when orders are created (see `app/api/orders/route.ts`).

To manually update stock:

```typescript
await db.product.update({
  where: { id: 'product-id' },
  data: {
    stock: {
      decrement: quantity,
    },
  },
})
```

### Finding Orders by Customer Email

```typescript
const customerOrders = await db.order.findMany({
  where: {
    customerEmail: 'customer@example.com',
  },
  include: {
    items: {
      include: {
        product: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
})
```

### Finding Orders by User ID

```typescript
const userOrders = await db.order.findMany({
  where: {
    userId: 'user-uuid',
  },
  include: {
    items: {
      include: {
        product: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
})
```

### Getting User's Cart Items

```typescript
const cartItems = await db.cartItem.findMany({
  where: {
    userId: 'user-uuid',
  },
  include: {
    product: true,
  },
})
```

### Getting User's Wishlist

```typescript
const wishlistItems = await db.wishlist.findMany({
  where: {
    userId: 'user-uuid',
  },
  include: {
    product: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

### Getting Product Reviews

```typescript
const reviews = await db.review.findMany({
  where: {
    productId: 'product-uuid',
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

### Getting Order Statistics

```typescript
// Total orders
const totalOrders = await db.order.count()

// Orders by status
const pendingCount = await db.order.count({
  where: { status: 'PENDING' },
})

// Total revenue
const result = await db.order.aggregate({
  _sum: {
    totalAmount: true,
  },
})
const totalRevenue = result._sum.totalAmount
```

### Bulk Operations

**Update multiple products:**
```typescript
await db.product.updateMany({
  where: { featured: false },
  data: { stock: 0 },
})
```

**Delete old orders:**
```typescript
await db.order.deleteMany({
  where: {
    createdAt: {
      lt: new Date('2024-01-01'),
    },
    status: 'DELIVERED',
  },
})
```

## Troubleshooting

### Connection Issues

**Error**: "Can't reach database server"

- Verify `DATABASE_URL` is correct
- Check database is running
- Verify network connectivity
- Check firewall rules

**Error**: "SSL connection required"

Add `?sslmode=require` to `DATABASE_URL`:
```
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### Migration Issues

**Error**: "Migration failed"

1. Check migration SQL for errors
2. Verify database permissions
3. Check for conflicting migrations
4. Review Prisma migration logs

**Resolving Failed Migrations:**

```bash
# Mark migration as applied (if already applied manually)
npx prisma migrate resolve --applied migration_name

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back migration_name
```

### Schema Sync Issues

**Error**: "Schema and database are out of sync"

```bash
# Reset and reapply all migrations (⚠️ deletes data)
npx prisma migrate reset

# Or create a new migration to sync
npx prisma migrate dev --create-only
# Review and edit the migration, then apply
```

### Performance Issues

**Slow Queries:**

1. Add database indexes:
```prisma
model Product {
  // ... fields
  @@index([category])
  @@index([featured])
}

model Order {
  // ... fields
  @@index([status])
  @@index([customerEmail])
  @@index([createdAt])
}
```

2. Use `select` to limit fields:
```typescript
const products = await db.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    imageUrl: true,
  },
})
```

3. Use pagination:
```typescript
const products = await db.product.findMany({
  skip: 0,
  take: 20,
})
```

### Data Integrity

**Preventing Orphaned Records:**

When deleting products, consider:
- Orders reference products in JSON (not foreign keys)
- No cascade deletes needed currently
- Future: Add soft deletes instead of hard deletes

## Best Practices

1. **Always use migrations** for schema changes in production
2. **Test migrations** on a copy of production data first
3. **Backup before migrations** in production
4. **Use transactions** for multi-step operations
5. **Add indexes** for frequently queried fields
6. **Monitor query performance** using Prisma query logging
7. **Keep migration files** in version control
8. **Document schema changes** in CHANGELOG.md

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Migrate Guide](https://www.prisma.io/docs/guides/migrate)

