import { Badge } from "@/components/ui/badge";
import { PROJECT_STATUS, REQUEST_STATUS, type ProjectStatus, type RequestStatus } from "@/lib/constants";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const s = PROJECT_STATUS[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const s = REQUEST_STATUS[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
