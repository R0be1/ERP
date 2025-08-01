
"use client"

import { employees } from "@/lib/data"
import { notFound, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, Building, Calendar, DollarSign, Edit, Globe, GraduationCap, Hash, Heart, Home, Mail, MapPin, Phone, User, Users, Venus, Building2, Tag, BadgeInfo, ChevronsRight, FileText, UserCheck, Shield, ShieldCheck, CheckSquare, Award, Layers, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// In a real app, you would fetch the logged-in user's data
const loggedInEmployeeId = "EMP001"; // Mocking logged-in user

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-5 w-5 text-muted-foreground mt-1" />
            <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
            </div>
        </div>
    )
}

const ExperienceItem = ({ title, entity, duration, details, description }: { title: string, entity: string, duration: string, details?: React.ReactNode, description?: string }) => (
    <div className="flex gap-4 p-4 border rounded-md">
        <div className="flex flex-col items-center">
            <div className="bg-primary/20 text-primary rounded-full p-2">
                 {details ? <GraduationCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
            </div>
        </div>
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-muted-foreground text-sm">{entity}</p>
            <p className="text-muted-foreground text-xs mb-1">{duration}</p>
             {details && <div className="text-xs text-muted-foreground">{details}</div>}
             {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        </div>
    </div>
)


const GuaranteeItem = ({ guarantee, type }: { guarantee: any, type: 'incoming' | 'outgoing' }) => {
    if (type === 'incoming') {
        return (
             <div className="grid md:grid-cols-2 gap-4 border p-4 rounded-md">
                <InfoItem icon={User} label="Guarantor Name" value={guarantee.guarantorName} />
                <InfoItem icon={Users} label="Relationship" value={guarantee.relationship} />
                <InfoItem icon={Building} label="Organization" value={guarantee.organization} />
                <InfoItem icon={Phone} label="Organization Phone" value={guarantee.organizationPhone} />
                <InfoItem icon={Phone} label="Guarantor Phone" value={guarantee.guarantorPhone} />
                <InfoItem icon={Calendar} label="Issue Date" value={guarantee.issueDate} />
                <InfoItem icon={FileText} label="Document" value={guarantee.document ? "Attached" : "Not available"} />
            </div>
        )
    }
    return (
        <div className="grid md:grid-cols-2 gap-4 border p-4 rounded-md">
            <InfoItem icon={User} label="Recipient Name" value={guarantee.recipientName} />
            <InfoItem icon={Phone} label="Recipient Phone" value={guarantee.recipientPhone} />
            <InfoItem icon={Users} label="Relationship" value={guarantee.relationship} />
            <InfoItem icon={Building} label="Organization" value={guarantee.organization} />
            <InfoItem icon={Phone} label="Organization Phone" value={guarantee.organizationPhone} />
            <InfoItem icon={Mail} label="P.O. Box" value={guarantee.poBox} />
            <InfoItem icon={DollarSign} label="Guarantee Amount" value={`${guarantee.amount} ETB`} />
            <InfoItem icon={Calendar} label="Issue Date" value={guarantee.issueDate} />
            <InfoItem icon={Calendar} label="Expiry Date" value={guarantee.expiryDate} />
            <InfoItem icon={FileText} label="Document" value={guarantee.document ? "Attached" : "Not available"} />
        </div>
    )
}

export default function ProfilePage() {
    const router = useRouter();
    const [employee, setEmployee] = useState<(typeof employees)[number] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const storedEmployees = localStorage.getItem('employees');
        let allEmployees = employees;
        if (storedEmployees) {
            try {
                 allEmployees = JSON.parse(storedEmployees);
            } catch (error) {
                console.error("Failed to parse employees from localStorage", error);
            }
        }
        
        const foundEmployee = allEmployees.find(e => e.id === loggedInEmployeeId);
        setEmployee(foundEmployee || null);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (!employee) {
        notFound();
        return null;
    }
    
    const address = employee.address || { country: '', region: '', city: '', subcity: '', woreda: '', kebele: '', houseNo: ''};
    const emergencyContacts = employee.emergencyContacts || [];
    const dependents = employee.dependents || [];
    const internalExperience = employee.internalExperience || [];
    const externalExperience = employee.externalExperience || [];
    const education = employee.education || [];
    const training = employee.training || [];
    const incomingGuarantees = employee.incomingGuarantees || [];
    const outgoingGuarantees = employee.outgoingGuarantees || [];

    const fullAddress = [address.houseNo, address.kebele, address.woreda, address.subcity, address.city, address.country].filter(Boolean).join(', ');

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Information</h1>
                    <p className="text-muted-foreground">A comprehensive overview of your profile.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/employees?edit=${employee.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <Tabs defaultValue="experience">
                <TabsList>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="training">Training</TabsTrigger>
                    <TabsTrigger value="guarantors_in">Guarantors (In)</TabsTrigger>
                    <TabsTrigger value="guarantees_out">Guarantees (Out)</TabsTrigger>
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Personal & Contact Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6">
                           <InfoItem icon={Hash} label="Employee ID" value={employee.employeeId} />
                           <InfoItem icon={Mail} label="Work Email" value={employee.workEmail} />
                           <InfoItem icon={Mail} label="Personal Email" value={employee.personalEmail} />
                           <InfoItem icon={Phone} label="Mobile Number" value={employee.mobileNumber} />
                           <InfoItem icon={Venus} label="Gender" value={employee.gender} />
                           <InfoItem icon={Globe} label="Nationality" value={employee.nationality} />
                           <InfoItem icon={Calendar} label="Date of Birth" value={employee.dob} />
                           <InfoItem icon={Heart} label="Marital Status" value={employee.maritalStatus} />
                           <InfoItem icon={MapPin} label="Current Address" value={fullAddress} />
                           <InfoItem icon={UserCheck} label="National ID" value={employee.nationalId} />
                           <InfoItem icon={UserCheck} label="Kebele ID" value={employee.kebeleId} />
                           <InfoItem icon={Shield} label="Driving License" value={employee.drivingLicense} />
                           <InfoItem icon={FileText} label="Passport No." value={employee.passportNo} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="experience" className="mt-4">
                    <div className="flex justify-end mb-4">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Generate Experience Letter
                        </Button>
                    </div>
                     <Card>
                        <CardHeader><CardTitle>Work Experience</CardTitle></CardHeader>
                        <CardContent className="grid gap-6">
                             <div>
                                <h3 className="font-semibold mb-4">Current & Internal Experience</h3>
                                <div className="flex flex-col gap-4">
                                {internalExperience.length > 0 ? internalExperience.map((exp: any, i) => (
                                    <ExperienceItem 
                                        key={`int-${i}`}
                                        title={exp.title}
                                        entity={exp.department}
                                        duration={`${exp.startDate} - ${exp.endDate || 'Present'}`}
                                        description={exp.managerialRole ? 'Managerial Role' : ''}
                                    />
                                )) : <p className="text-muted-foreground text-sm">No internal experience recorded.</p>}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-semibold mb-4">Previous Experience</h3>
                                <div className="flex flex-col gap-4">
                                {externalExperience.length > 0 ? externalExperience.map((exp: any, i) => (
                                     <ExperienceItem 
                                        key={`ext-${i}`}
                                        title={exp.title}
                                        entity={exp.company}
                                        duration={`${exp.startDate} - ${exp.endDate}`}
                                        description={exp.managerialRole ? 'Managerial Role' : ''}
                                    />
                                )) : <p className="text-muted-foreground text-sm">No external experience recorded.</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="education" className="mt-4">
                     <Card>
                        <CardHeader><CardTitle>Education</CardTitle></CardHeader>
                         <CardContent className="grid gap-6">
                             <div className="flex flex-col gap-4">
                                {education.length > 0 ? education.map((edu: any, i) => {
                                    const details = [
                                        edu.programType,
                                        edu.cgpa ? `CGPA: ${edu.cgpa}`: null,
                                        edu.result ? `Result: ${edu.result}` : null
                                    ].filter(Boolean).join(' • ');

                                    return (
                                        <ExperienceItem 
                                            key={`edu-${i}`} 
                                            title={edu.award} 
                                            entity={`${edu.institution} - ${edu.fieldOfStudy}`} 
                                            duration={`Completed: ${edu.completionDate}`}
                                            details={details}
                                        />
                                    )
                                }) : <p className="text-muted-foreground text-sm">No education history recorded.</p>}
                            </div>
                         </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="training" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Training</CardTitle></CardHeader>
                         <CardContent className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                {training.length > 0 ? training.map((trn, i) => (
                                     <ExperienceItem key={`trn-${i}`} title={trn.name} entity={trn.provider} duration={`Completed: ${trn.completionDate}`} />
                                )) : <p className="text-muted-foreground text-sm">No training history recorded.</p>}
                            </div>
                         </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="guarantors_in" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Incoming Guarantees</CardTitle></CardHeader>
                        <CardContent className="grid gap-6">
                            {incomingGuarantees.length > 0 ? incomingGuarantees.map((guarantee, i) => (
                                <GuaranteeItem key={`inc-${i}`} guarantee={guarantee} type="incoming" />
                            )) : <p className="text-muted-foreground text-sm">No incoming guarantees recorded.</p>}
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="guarantees_out" className="mt-4">
                     <Card>
                        <CardHeader><CardTitle>Outgoing Guarantees</CardTitle></CardHeader>
                        <CardContent className="grid gap-6">
                            {outgoingGuarantees.length > 0 ? outgoingGuarantees.map((guarantee, i) => (
                                 <GuaranteeItem key={`out-${i}`} guarantee={guarantee} type="outgoing" />
                            )) : <p className="text-muted-foreground text-sm">No outgoing guarantees recorded.</p>}
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="activity" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Activity log coming soon.</p>
                        </CardContent>
                    </Card>
                 </TabsContent>
            </Tabs>
        </div>
    )
}
