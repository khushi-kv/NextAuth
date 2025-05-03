import { useSession } from "next-auth/react"
import { UserRole } from "@prisma/client"
import { ReactNode } from "react"
import { PrismaClient } from "@prisma/client"

interface RoleBasedContentProps {
  allowedRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleBasedContent({
  allowedRoles,
  children,
  fallback = null,
}: RoleBasedContentProps) {
  const { data: session } = useSession()

  if (!session?.user) {
    return fallback
  }

  if (!allowedRoles.includes(session.user.role)) {
    return fallback
  }

  return <>{children}</>
}

interface RoleBasedSectionProps {
  role: UserRole
  children: ReactNode
  fallback?: ReactNode
}

export function RoleBasedSection({
  role,
  children,
  fallback = null,
}: RoleBasedSectionProps) {
  return (
    <RoleBasedContent allowedRoles={[role]} fallback={fallback}>
      {children}
    </RoleBasedContent>
  )
}

export default function DebugSession() {
  const { data: session, status } = useSession();
  console.log("Session Status:", status);
  console.log("Session Data:", session);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}

const prisma = new PrismaClient();

export const authOptions = {
  // ... your existing config ...
  events: {
    async createUser({ user }: { user: { id: string } }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: { connect: { id: "user_role" } } }
      });
    }
  }
}; 