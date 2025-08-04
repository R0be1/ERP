
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, ClipboardList, TrendingUp, UserCog, Users } from "lucide-react";
import Link from "next/link";

const managerServiceLinks = [
    {
        href: "/leave",
        icon: CheckCircle,
        title: "Team Approvals",
        description: "Approve or reject leave and attendance requests."
    },
    {
        href: "/employees",
        icon: Users,
        title: "Team Directory",
        description: "View team profiles, calendars, and attendance."
    },
    {
        href: "/performance",
        icon: TrendingUp,
        title: "Team Performance",
        description: "Access performance reviews and goals for your team."
    },
    {
        href: "/reports",
        icon: ClipboardList,
        title: "Reports & Analytics",
        description: "Generate and export reports for your team."
    },
    {
        href: "/delegation",
        icon: UserCog,
        title: "Delegate Authority",
        description: "Assign temporary approval authority to another manager."
    }
]

export default function ManagerServicePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Manager Self-Service</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Welcome to the Manager Hub</CardTitle>
                    <CardDescription>
                        Manage your team's requests, performance, and information from one central place.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {managerServiceLinks.map((link) => (
                       <Link href={link.href} key={link.href} className="block hover:shadow-lg transition-shadow rounded-lg border">
                         <Card className="flex flex-col h-full shadow-none border-none">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                                <div className="bg-muted p-3 rounded-md">
                                    <link.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="grid gap-1">
                                    <CardTitle>{link.title}</CardTitle>
                                    <CardDescription>{link.description}</CardDescription>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto self-center" />
                            </CardHeader>
                        </Card>
                       </Link>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
