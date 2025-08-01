
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const emergencyContacts = [
    { name: "Jane Doe", relationship: "Spouse", phone: "+1 987 654 321" },
];

const dependents = [
    { name: "Sam Doe", relationship: "Child", dob: "2010-05-20" },
];

const internalExperience = [
    { title: "Junior Officer", department: "Branch Operations", startDate: "2020-01-15", endDate: "2022-01-14" },
];

const externalExperience = [
    { company: "ABC Corp", title: "Intern", startDate: "2019-06-01", endDate: "2019-12-31" },
]

const education = [
    { degree: "BSc in Computer Science", institution: "Addis Ababa University", field: "Computer Science", completionDate: "2019-07-01" },
]

const training = [
    { name: "Advanced Customer Service", provider: "Ethio-Excellence", completionDate: "2021-03-15" }
]

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">My Profile</h1>
                <Button>Save Changes</Button>
            </div>

            <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="job">Job & Contact</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="history">History & Development</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-4 flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="https://placehold.co/80x80.png" alt="User" data-ai-hint="person portrait" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">Upload New Photo</Button>
                            </div>
                            <Separator />
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" defaultValue="John" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middle-name">Middle Name</Label>
                                    <Input id="middle-name" defaultValue="" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" defaultValue="Doe" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="employee-id">Employee ID</Label>
                                    <Input id="employee-id" defaultValue="NIB00123" disabled />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date" defaultValue="1990-01-01" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select defaultValue="male">
                                        <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="marital-status">Marital Status</Label>
                                    <Select defaultValue="single">
                                        <SelectTrigger id="marital-status"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input id="nationality" defaultValue="Ethiopian" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Dependents</CardTitle>
                                <CardDescription>Manage your dependent information.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline"><PlusCircle className="mr-2" />Add Dependent</Button>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dependents.map((dep, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{dep.name}</TableCell>
                                            <TableCell>{dep.relationship}</TableCell>
                                            <TableCell>{dep.dob}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="job" className="mt-4 flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                             <CardDescription>Your current employment information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                             <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" defaultValue="Technology" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="job-title">Job Title</Label>
                                <Input id="job-title" defaultValue="Software Engineer" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="manager">Manager</Label>
                                <Input id="manager" defaultValue="Jane Smith" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="employment-type">Employment Type</Label>
                                 <Select defaultValue="permanent">
                                    <SelectTrigger id="employment-type"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="permanent">Permanent</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="intern">Intern</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="job-grade">Job Grade</Label>
                                <Input id="job-grade" defaultValue="Grade B" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="join-date">Join Date</Label>
                                <Input id="join-date" type="date" defaultValue="2022-01-15" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="probation-end">Probation End Date</Label>
                                <Input id="probation-end" type="date" defaultValue="2022-04-15" />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                             <CardDescription>How to reach you.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="work-email">Work Email</Label>
                                    <Input id="work-email" type="email" defaultValue="john.doe@example.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="personal-email">Personal Email</Label>
                                    <Input id="personal-email" type="email" defaultValue="johndoe@personal.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Mobile Number</Label>
                                    <Input id="phone" type="tel" defaultValue="+251 91 123 4567" />
                                </div>
                            </div>
                             <Separator />
                            <p className="font-medium text-sm">Address</p>
                            <div className="grid md:grid-cols-3 gap-4">
                               <div className="grid gap-2">
                                    <Label htmlFor="region">Region</Label>
                                    <Input id="region" defaultValue="Addis Ababa" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" defaultValue="Addis Ababa" />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="subcity">Subcity</Label>
                                    <Input id="subcity" defaultValue="Bole" />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="woreda">Woreda</Label>
                                    <Input id="woreda" defaultValue="03" />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="kebele">Kebele</Label>
                                    <Input id="kebele" defaultValue="05" />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="house-no">House Number</Label>
                                    <Input id="house-no" defaultValue="123" />
                                </div>
                            </div>
                             <Separator />
                             <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">Emergency Contacts</p>
                                <Button size="sm" variant="outline"><PlusCircle className="mr-2" />Add Contact</Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Phone Number</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {emergencyContacts.map((contact, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{contact.name}</TableCell>
                                            <TableCell>{contact.relationship}</TableCell>
                                            <TableCell>{contact.phone}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="financial" className="mt-4 flex flex-col gap-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Contract Details</CardTitle>
                             <CardDescription>Your current contract and salary information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                             <div className="grid gap-2">
                                <Label htmlFor="contract-start">Contract Start Date</Label>
                                <Input id="contract-start" type="date" defaultValue="2022-01-15" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contract-end">Contract End Date</Label>
                                <Input id="contract-end" type="date" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="salary">Basic Salary</Label>
                                <Input id="salary" defaultValue="50000" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="currency">Currency</Label>
                                 <Select defaultValue="ETB">
                                    <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ETB">ETB</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Bank Details</CardTitle>
                            <CardDescription>Your banking and tax information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="bank-name">Bank Name</Label>
                                <Input id="bank-name" defaultValue="Nib International Bank" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="account-number">Account Number</Label>
                                <Input id="account-number" defaultValue="1000123456789" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tax-id">Tax ID</Label>
                                <Input id="tax-id" defaultValue="9876543210" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pension-number">Pension Number</Label>
                                <Input id="pension-number" defaultValue="PN12345" />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                          <CardTitle>Password</CardTitle>
                          <CardDescription>
                            Change your password here.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                          <div className="grid md:grid-cols-2 gap-4">
                             <div className="grid gap-2">
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input id="current-password" type="password" />
                            </div>
                             <div className="grid gap-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-4 flex flex-col gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Work Experience</CardTitle>
                                <CardDescription>Your professional history.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline"><PlusCircle className="mr-2" />Add Experience</Button>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div>
                                <h3 className="font-medium mb-2">Internal Experience (at Nib International Bank)</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Job Title</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {internalExperience.map((exp, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{exp.title}</TableCell>
                                                <TableCell>{exp.department}</TableCell>
                                                <TableCell>{exp.startDate}</TableCell>
                                                <TableCell>{exp.endDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                             <div>
                                <h3 className="font-medium mb-2">External Experience</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Job Title</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {externalExperience.map((exp, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{exp.company}</TableCell>
                                                <TableCell>{exp.title}</TableCell>
                                                <TableCell>{exp.startDate}</TableCell>
                                                <TableCell>{exp.endDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Education Qualifications</CardTitle>
                                <CardDescription>Your academic background.</CardDescription>
                            </div>
                             <Button size="sm" variant="outline"><PlusCircle className="mr-2" />Add Qualification</Button>
                        </CardHeader>
                        <CardContent>
                              <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Degree/Certificate</TableHead>
                                            <TableHead>Institution</TableHead>
                                            <TableHead>Field of Study</TableHead>
                                            <TableHead>Completion Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {education.map((edu, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{edu.degree}</TableCell>
                                                <TableCell>{edu.institution}</TableCell>
                                                <TableCell>{edu.field}</TableCell>
                                                <TableCell>{edu.completionDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div>
                                <CardTitle>Training & Certificates</CardTitle>
                                <CardDescription>Your completed training programs and certifications.</CardDescription>
                            </div>
                             <Button size="sm" variant="outline"><PlusCircle className="mr-2" />Add Training</Button>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Program/Certificate Name</TableHead>
                                            <TableHead>Provider</TableHead>
                                            <TableHead>Completion Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {training.map((trn, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{trn.name}</TableCell>
                                                <TableCell>{trn.provider}</TableCell>
                                                <TableCell>{trn.completionDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon"><Trash2 className="text-destructive h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
