"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { TeamMembers } from "@/components/team/members";
import { TeamStats } from "@/components/team/stats";

export default function TeamPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and their roles
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <TeamStats />
      <TeamMembers />
    </div>
  );
}