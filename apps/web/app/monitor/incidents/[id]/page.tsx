"use client";

import { useParams } from "next/navigation";
import { IncidentDetailPage } from "../../../_components/incidents/incident-detail-page";

export default function MonitorIncidentDetailRoute() {
  const params = useParams<{ id: string }>();
  const incidentId = Number(params.id);

  return (
    <IncidentDetailPage
      incidentId={incidentId}
      backHref="/monitor/incidents"
      mode="monitor"
    />
  );
}


