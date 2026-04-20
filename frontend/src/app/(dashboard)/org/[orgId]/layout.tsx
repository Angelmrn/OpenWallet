"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useOrgStore } from "@/stores/org.store";
import { getOrgApi } from "@/lib/api/org.api";
import { getMembersApi } from "@/lib/api/members.api";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { setActiveOrg } = useOrgStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId || !user) return;

    Promise.all([getOrgApi(orgId), getMembersApi(orgId)])
      .then(([orgRes]) => {
        const org = orgRes.organization;

        setActiveOrg({
          id: org.id,
          name: org.name,
          role: (org.ownerId === user.id ? "owner" : "member") as
            | "owner"
            | "member",
        });
        setLoading(false);
      })
      .catch(() => router.push("/dashboard"));
  }, [orgId, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading organization...</p>
      </div>
    );
  }

  return <>{children}</>;
}
