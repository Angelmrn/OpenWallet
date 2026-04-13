import { Organization } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface OrgCardProps {
  org: Organization;
  role: "owner" | "member";
}

export default function OrgCard({ org, role }: OrgCardProps) {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/org/${org.id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{org.name}</CardTitle>
        <Badge variant={role === "owner" ? "default" : "secondary"}>
          {role === "owner" ? "Owner" : "Member"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {" "}
          {org.totalPointsIssued} Points Issued
        </p>
      </CardContent>
    </Card>
  );
}
