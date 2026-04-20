"use client";
import { useEffect, useState } from "react";
import { getMyOrgApi } from "@/lib/api/org.api";
import { useAuthStore } from "@/stores/auth.store";
import OrgCard from "@/components/org/orgCard";
import CreateOrgDialog from "@/components/org/createDialog";
import { Organization } from "@/types";
import { Plus, Building2 } from "lucide-react";

interface OrgWithRole {
  org: Organization;
  role: "owner" | "member";
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [orgs, setOrgs] = useState<OrgWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrgApi()
      .then((res) => {
        const mapped = res.organizations.map((org) => ({
          org,
          role:
            org.ownerId === user?.id
              ? "owner"
              : ("member" as "owner" | "member"),
        }));
        setOrgs(mapped);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleOrgCreated = (newOrg: Organization) => {
    setOrgs((prev) => [...prev, { org: newOrg, role: "owner" }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 />
            <h1 className="text-2xl font-bold">My Organizations</h1>
          </div>
          <p className="text-muted-foreground">Welcome, {user?.name}</p>
        </div>
        <CreateOrgDialog onCreated={handleOrgCreated} />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : orgs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">You don't have organizations yet</p>
          <p className="text-sm">Create one or accept an invitation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map(({ org, role }) => (
            <OrgCard key={org.id} org={org} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}
