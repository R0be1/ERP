

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
  PanelLeft,
  LogOut,
  Settings,
  Bell,
  ClipboardEdit,
  UserRound,
  UserCog,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { UserNav } from "@/components/user-nav"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/employees", icon: Users, label: "Employees" },
  { href: "/organization", icon: Network, label: "Organization" },
  { href: "/recruitment", icon: Briefcase, label: "Recruitment" },
  { href: "/personnel-actions", icon: ClipboardEdit, label: "Personnel Actions" },
  { href: "/self-service", icon: UserRound, label: "Self-Service" },
  { href: "/manager-service", icon: UserCog, label: "Manager Service" },
]

const bottomNavItems = [
  { href: "/attendance", icon: Clock, label: "Attendance" },
  { href: "/leave", icon: CalendarOff, label: "Leave" },
  { href: "/performance", icon: TrendingUp, label: "Performance" },
  { href: "/benefits", icon: Heart, label: "Benefits" },
  { href: "/payslips", icon: Receipt, label: "Payslips" },
  { href: "/feedback", icon: MessageSquare, label: "Feedback" },
  { href: "/configuration", icon: Settings, label: "Configuration" },
]

const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary md:h-8 md:w-8",
              isActive && "bg-accent text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
  )
}

const MobileNavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
          isActive && "bg-muted text-primary"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
}

const DesktopNav = () => {
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.4a2 2 0 0 1-1 1.73l-.44.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.44.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h4.44a2 2 0 0 0 2-2v-.4a2 2 0 0 1 1-1.73l.44-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.44-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span className="">HCM Express</span>
                  </Link>
                </div>
                <div className="flex-1">
                    <TooltipProvider>
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {navItems.map((item) => (
                                <NavLink key={item.href} {...item} />
                            ))}
                        </nav>
                    </TooltipProvider>
                </div>
                <div className="mt-auto p-4">
                    <TooltipProvider>
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {bottomNavItems.map((item) => (
                                <NavLink key={item.href} {...item} />
                            ))}
                        </nav>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};

const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold mb-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v.4a2 2 0 0 1-1 1.73l-.44.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.44.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h4.44a2 2 0 0 0 2-2v-.4a2 2 0 0 1 1-1.73l.44-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.44-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <span >HCM Express</span>
                    </Link>
                    {navItems.map((item) => (
                        <MobileNavLink key={item.href} {...item} />
                    ))}
                </nav>
                <nav className="mt-auto grid gap-2 text-lg font-medium">
                    {bottomNavItems.map((item) => (
                        <MobileNavLink key={item.href} {...item} />
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
};


export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]">
      <DesktopNav />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {isClient && <MobileNav />}
          <div className="w-full flex-1">
            {/* Can add search or page title here */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
