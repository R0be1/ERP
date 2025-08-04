
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, CalendarOff, Clock, Receipt, ArrowRight } from "lucide-react";
import Link from "next/link";

const selfServiceLinks = [
    {
        href: "/profile",
        icon: UserCircle,
        title: "My Profile",
        description: "View and update your personal and employment information."
    },
    {
        href: "/leave",
        icon: CalendarOff,
        title: "Leave Management",
        description: "Submit new leave requests and track their status."
    },
    {
        href: "/attendance",
        icon: Clock,
        title: "Attendance",
        description: "View your attendance records and check-in/out."
    },
    {
        href: "/payslips",
        icon: Receipt,
        title: "Payslips",
        description: "Access and download your monthly payslips."
    }
]

export default function SelfServicePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Employee Self-Service</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Welcome to your Self-Service Hub</CardTitle>
                    <CardDescription>
                        Manage your personal information, requests, and documents all in one place.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    {selfServiceLinks.map((link) => (
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
                                <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                            </CardHeader>
                        </Card>
                       </Link>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
