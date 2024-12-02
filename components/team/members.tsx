"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export function TeamMembers() {
  const members = [
    {
      id: 1,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Admin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      role: "Manager",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      status: "Active",
    },
  ];

  return (
    <div className="grid gap-6 mt-6">
      {members.map((member) => (
        <Card key={member.id}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                {member.role}
              </Badge>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}