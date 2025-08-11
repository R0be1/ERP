
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UserCircle, CalendarOff, Clock, Receipt, ArrowRight, Edit, Mail, Phone, MapPin, BadgeInfo, CheckCircle } from "lucide-react";
import Link from "next/link";
import { employees } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const loggedInEmployeeId = "EMP001"; // Mocking logged-in user

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-muted-foreground mt-1" />
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
            </div>
        </div>
    )
}

export default function SelfServicePage() {
    const employee = employees.find(e => e.id === loggedInEmployeeId);

    if (!employee) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Could not find employee data.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Employee Self-Service</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex-row items-center gap-4">
                             <Avatar className="h-16 w-16">
                                <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{employee.name}</CardTitle>
                                <CardDescription>{employee.position}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <InfoItem icon={Mail} label="Email" value={employee.workEmail} />
                            <InfoItem icon={Phone} label="Phone" value={employee.mobileNumber} />
                            <InfoItem icon={BadgeInfo} label="Status" value={<Badge variant={employee.status === "Active" ? "secondary" : "destructive"}>{employee.status}</Badge>} />
                        </CardContent>
                        <CardFooter>
                             <Button asChild variant="secondary" className="w-full">
                                <Link href="/profile">
                                    <Edit className="mr-2 h-4 w-4" /> View/Edit Full Profile
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Quick Links</CardTitle>
                            <CardDescription>Access common tasks quickly.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button asChild variant="outline" className="justify-start">
                                <Link href="/leave"><CalendarOff className="mr-2 h-4 w-4" /> Request Leave</Link>
                            </Button>
                            <Button asChild variant="outline" className="justify-start">
                                <Link href="/attendance"><Clock className="mr-2 h-4 w-4" /> View Attendance</Link>
                            </Button>
                             <Button asChild variant="outline" className="justify-start">
                                <Link href="/payslips"><Receipt className="mr-2 h-4 w-4" /> View Payslips</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Leave Balance</CardTitle>
                                    <CardDescription>Your available leave days.</CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/leave">View History <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-sm text-muted-foreground">Vacation</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold">5</p>
                                <p className="text-sm text-muted-foreground">Sick Days</p>
                            </div>
                             <div>
                                <p className="text-2xl font-bold">2</p>
                                <p className="text-sm text-muted-foreground">Personal</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                             <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Recent Notifications</CardTitle>
                                    <CardDescription>Your latest updates and alerts.</CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/notifications">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center gap-4">
                               <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                                   <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                               </div>
                               <div className="grid gap-1">
                                    <p className="text-sm font-medium">Leave Request Approved</p>
                                    <p className="text-sm text-muted-foreground">Your vacation request was approved.</p>
                               </div>
                            </div>
                            <Separator />
                             <div className="flex items-center gap-4">
                               <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                                   <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                               </div>
                               <div className="grid gap-1">
                                    <p className="text-sm font-medium">New Payslip Available</p>
                                    <p className="text-sm text-muted-foreground">Your payslip for July 2024 is ready.</p>
                               </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
