

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Network,
  Briefcase,
  CalendarOff,
  TrendingUp,
  Heart,
  UserCircle,
  Receipt,
  MessageSquare,
  Clock,
  Settings,
  ClipboardEdit,
  UserRound,
  UserCog,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"
import { useEffect, useState } from "react"


const coreNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/employees", icon: Users, label: "Employees" },
  { href: "/organization", icon: Network, label: "Organization" },
  { href: "/recruitment", icon: Briefcase, label: "Recruitment" },
  { href: "/personnel-actions", icon: ClipboardEdit, label: "Personnel Actions" },
]

const selfServiceNavItems = [
    { href: "/self-service", icon: UserRound, label: "Employee Self-Service" },
    { href: "/manager-service", icon: UserCog, label: "Manager Service" },
]

const generalNavItems = [
  { href: "/attendance", icon: Clock, label: "Attendance" },
  { href: "/leave", icon: CalendarOff, label: "Leave" },
  { href: "/performance", icon: TrendingUp, label: "Performance" },
  { href: "/benefits", icon: Heart, label: "Benefits" },
  { href: "/payslips", icon: Receipt, label: "Payslips" },
  { href: "/feedback", icon: MessageSquare, label: "Feedback" },
]

const bottomNavItems = [
  { href: "/configuration", icon: Settings, label: "Configuration" },
  { href: "/profile", icon: UserCircle, label: "My Profile" },
]


const NavItem = ({ item }: { item: { href: string; icon: React.ElementType; label: string; } }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.label, side: "right", align: "center" }}
            >
                <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!isClient) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }
  
  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                 <Link href="/" className="flex items-center gap-2 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.4a2 2 0 0 1-1 1.73l-.44.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.44.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h4.44a2 2 0 0 0 2-2v-.4a2 2 0 0 1 1-1.73l.44-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.44-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span className="group-data-[collapsible=icon]:hidden">HCM Express</span>
                  </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                     <SidebarGroup>
                        <SidebarGroupLabel>Core</SidebarGroupLabel>
                         {coreNavItems.map(item => <NavItem key={item.href} item={item} />)}
                    </SidebarGroup>

                    <SidebarSeparator />

                    <SidebarGroup>
                        <SidebarGroupLabel>Self Service</SidebarGroupLabel>
                        {selfServiceNavItems.map(item => <NavItem key={item.href} item={item} />)}
                    </SidebarGroup>

                    <SidebarSeparator />
                    
                    <SidebarGroup>
                        <SidebarGroupLabel>General</SidebarGroupLabel>
                        {generalNavItems.map(item => <NavItem key={item.href} item={item} />)}
                    </SidebarGroup>

                </SidebarMenu>
            </SidebarContent>
            <SidebarHeader>
                <SidebarMenu>
                    {bottomNavItems.map(item => <NavItem key={item.href} item={item} />)}
                </SidebarMenu>
            </SidebarHeader>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-background z-10">
                <SidebarTrigger />
                <div className="w-full flex-1">
                    {/* Can add search or page title here */}
                </div>
                <UserNav />
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}
