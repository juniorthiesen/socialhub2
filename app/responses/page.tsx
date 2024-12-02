"use client";

import { Card } from "@/components/ui/card";
import { ResponseTemplates } from "@/components/responses/templates";
import { ResponseStats } from "@/components/responses/stats";

export default function ResponsesPage() {
  return (
    <div className="space-y-8">
      <ResponseStats />
      <ResponseTemplates />
    </div>
  );
}