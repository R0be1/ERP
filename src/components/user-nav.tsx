
"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle"
import { Bell } from "lucide-react"
import { notifications } from "@/lib/notifications"
import Link from "next/link"

export function UserNav() {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel>
            <div className="flex justify-between items-center">
              <p className="font-semibold">Notifications</p>
              <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild className="cursor-pointer">
                <Link href={notification.href}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={notification.avatar} alt="Avatar" data-ai-hint="person portrait" />
                       <AvatarFallback>{notification.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/notifications" className="text-center justify-center">
              View all notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="@shadcn" data-ai-hint="person portrait" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="flex items-center justify-center">
              <ThemeToggle />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
