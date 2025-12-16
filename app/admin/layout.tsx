import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Allow access to login page without authentication
  // Check if we're on the login page by checking the pathname
  // Since this is server-side, we need to handle this differently
  // For now, we'll check in the client component

  if (!session) {
    // This will be handled by the login page component
    return <>{children}</>
  }

  return <AdminLayout>{children}</AdminLayout>
}

