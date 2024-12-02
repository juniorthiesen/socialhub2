"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Zap } from "lucide-react";
import { AutomationRules } from "@/components/automation/rules";
import { AutomationStats } from "@/components/automation/stats";
import { CreateAutomationDialog } from "@/components/automation/create-automation-dialog";

export default function AutomationPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation Rules</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your engagement automation rules
          </p>
        </div>
        <CreateAutomationDialog
          trigger={
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Rule
            </Button>
          }
        />
      </div>
      
      <AutomationStats />
      <AutomationRules />
    </div>
  );
}