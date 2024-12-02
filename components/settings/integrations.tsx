"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, Settings2 } from "lucide-react";

export function IntegrationSettings() {
  const integrations = [
    {
      name: "Facebook",
      status: "Not Connected",
      icon: Facebook,
      account: null,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Other Integrations</CardTitle>
        <CardDescription>
          Connect additional social media accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <integration.icon className="h-6 w-6" />
              <div>
                <h3 className="font-medium">{integration.name}</h3>
                {integration.account && (
                  <p className="text-sm text-muted-foreground">
                    {integration.account}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={integration.status === "Connected" ? "default" : "secondary"}
              >
                {integration.status}
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}