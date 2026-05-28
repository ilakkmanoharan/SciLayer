import { UserRole } from "@/lib/auth/types";
import { redirect } from "next/navigation";
import { getSession, type SessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSession();
}

export async function requireAuth(redirectTo = "/login"): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

export async function upsertResearcherFromOrcid(input: {
  orcidId: string;
  name: string;
  email?: string | null;
}) {
  if (!prisma) {
    return {
      id: `orcid-${input.orcidId}`,
      orcidId: input.orcidId,
      name: input.name,
      role: "AUTHOR" satisfies UserRole,
    };
  }

  try {
    const user = await prisma.user.upsert({
      where: { orcidId: input.orcidId },
      create: {
        orcidId: input.orcidId,
        name: input.name,
        email: input.email ?? undefined,
        role: "AUTHOR",
      },
      update: {
        name: input.name,
        email: input.email ?? undefined,
      },
    });

    return user;
  } catch {
    return {
      id: `orcid-${input.orcidId}`,
      orcidId: input.orcidId,
      name: input.name,
      role: "AUTHOR" satisfies UserRole,
    };
  }
}
