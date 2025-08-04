
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notifications } from "@/lib/notifications";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">All Notifications</h1>
        <div className="flex items-center gap-2">
           <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="requests">Requests</SelectItem>
                <SelectItem value="approvals">Approvals</SelectItem>
                <SelectItem value="reminders">Reminders</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Mark all as read</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            A complete log of all your past and present notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                {notifications.map((notification) => (
                    <Link href={notification.href} key={notification.id} className="block border-b pb-4 last:border-b-0">
                        <div className="flex items-start gap-4">
                             <Avatar className="h-10 w-10">
                               <AvatarImage src={notification.avatar} alt="Avatar" data-ai-hint="person portrait" />
                               <AvatarFallback>{notification.fallback}</AvatarFallback>
                            </Avatar>
                             <div className="grid gap-1">
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
