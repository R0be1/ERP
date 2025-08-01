

"use client"

import { employees as initialEmployees } from "@/lib/data"
import { notFound, useRouter, useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, Building, Calendar, DollarSign, Edit, Globe, GraduationCap, Hash, Heart, Home, Mail, MapPin, Phone, User, Users, Venus, Building2, Tag, BadgeInfo, ChevronsRight, FileText, UserCheck, Shield, ShieldCheck, CheckSquare, Award, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

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

const ExperienceItem = ({ title, entity, duration, details }: { title: string, entity: string, duration: string, details?: React.ReactNode }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="bg-primary/20 text-primary rounded-full p-2">
                 {details ? <GraduationCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
            </div>
            <div className="flex-grow w-px bg-border my-2"></div>
        </div>
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-muted-foreground text-sm">{entity}</p>
            <p className="text-muted-foreground text-xs mb-1">{duration}</p>
             {details && <div className="text-xs text-muted-foreground">{details}</div>}
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


export default function EmployeeProfilePage({ params: serverParams }: { params: { id: string } }) {
    const router = useRouter();
    const params = useParams();
    const employeeId = (params?.id || serverParams.id) as string;
    
    // This state will hold all employees, including newly added ones.
    const [employees, setEmployees] = useState(initialEmployees);
    const [isLoading, setIsLoading] = useState(true);
    const [employee, setEmployee] = useState<(typeof initialEmployees)[number] | undefined>(undefined);

    // In a real app, you'd likely fetch this from a global state or an API
    // For now, we'll check local storage for simplicity.
    useEffect(() => {
        setIsLoading(true);
        const storedEmployees = localStorage.getItem('employees');
        let allEmployees = initialEmployees;
        if (storedEmployees) {
            try {
                 allEmployees = JSON.parse(storedEmployees);
                 setEmployees(allEmployees);
            } catch (error) {
                console.error("Failed to parse employees from localStorage", error);
            }
        }
        
        const foundEmployee = allEmployees.find(e => e.id === employeeId);
        setEmployee(foundEmployee);
        setIsLoading(false);
    }, [employeeId]);


    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (!employee) {
        notFound();
        return null;
    }
    
    // Fallback for missing nested data
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
                     <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Employees
                    </Button>
                    <h1 className="text-2xl font-bold">Employee Profile</h1>
                    <p className="text-muted-foreground">Detailed information for {employee.name}.</p>
                </div>
                <Button onClick={() => router.push(`/employees?edit=${employee.id}`)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Card className="text-center">
                        <CardContent className="pt-6 flex flex-col items-center gap-4">
                             <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-bold">{employee.name}</h2>
                                <p className="text-muted-foreground">{employee.position}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal & Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                           <InfoItem icon={Hash} label="Employee ID" value={employee.employeeId} />
                           <InfoItem icon={Mail} label="Work Email" value={employee.workEmail} />
                           <InfoItem icon={Mail} label="Personal Email" value={employee.personalEmail} />
                           <InfoItem icon={Phone} label="Mobile Number" value={employee.mobileNumber} />
                           <InfoItem icon={Venus} label="Gender" value={employee.gender} />
                           <InfoItem icon={Globe} label="Nationality" value={employee.nationality} />
                           <InfoItem icon={Calendar} label="Date of Birth" value={employee.dob} />
                           <InfoItem icon={Heart} label="Marital Status" value={employee.maritalStatus} />
                           <InfoItem icon={Users} label="Dependents" value={dependents.length > 0 ? dependents.length : 'None'} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Address</CardTitle></CardHeader>
                        <CardContent>
                             <InfoItem icon={MapPin} label="Current Address" value={fullAddress} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Identification</CardTitle></CardHeader>
                        <CardContent className="grid gap-4">
                           <InfoItem icon={UserCheck} label="National ID" value={employee.nationalId} />
                           <InfoItem icon={UserCheck} label="Kebele ID" value={employee.kebeleId} />
                           <InfoItem icon={Shield} label="Driving License" value={employee.drivingLicense} />
                           <InfoItem icon={FileText} label="Passport No." value={employee.passportNo} />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Employment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <InfoItem icon={Building} label="Department" value={employee.department} />
                            <InfoItem icon={Briefcase} label="Job Title" value={employee.position} />
                            <InfoItem icon={User} label="Manager" value={employee.manager} />
                            <InfoItem icon={Tag} label="Job Grade" value={employee.jobGrade} />
                            <InfoItem icon={Layers} label="Job Category" value={employee.jobCategory} />
                            <InfoItem icon={Home} label="Work Location" value="Head Office" />
                             <InfoItem icon={BadgeInfo} label="Employment Type" value={employee.employmentType} />
                            <InfoItem icon={Calendar} label="Join Date" value={employee.joinDate} />
                            <InfoItem icon={Calendar} label="Probation End Date" value={employee.probationEndDate} />
                            <InfoItem icon={DollarSign} label="Basic Salary" value={`${employee.basicSalary} ${employee.currency}`} />
                            <InfoItem icon={Badge} label="Status" value={<Badge variant={employee.status === "Active" ? "secondary" : "destructive"}>{employee.status}</Badge>} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Work Experience</CardTitle></CardHeader>
                        <CardContent className="grid gap-6">
                             <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><ChevronsRight className="h-5 w-5" /> Internal Experience</h3>
                                {internalExperience.length > 0 ? internalExperience.map((exp, i) => (
                                    <ExperienceItem key={`int-${i}`} title={exp.title} entity={exp.department} duration={`${exp.startDate} - ${exp.endDate || 'Present'}`} />
                                )) : <p className="text-muted-foreground text-sm">No internal experience recorded.</p>}
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><ChevronsRight className="h-5 w-5" /> External Experience</h3>
                                {externalExperience.length > 0 ? externalExperience.map((exp, i) => (
                                     <div key={`ext-${i}`} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-primary/20 text-primary rounded-full p-2">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <div className="flex-grow w-px bg-border my-2"></div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{exp.title}</h4>
                                                {exp.managerialRole && <Badge variant="outline" className="flex items-center gap-1"><CheckSquare className="h-3 w-3" /> Managerial</Badge>}
                                            </div>
                                            <p className="text-muted-foreground text-sm">{exp.company}</p>
                                            <p className="text-muted-foreground text-xs mb-1">{`${exp.startDate} - ${exp.endDate}`}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-muted-foreground text-sm">No external experience recorded.</p>}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Education & Training</CardTitle></CardHeader>
                         <CardContent className="grid gap-6">
                             <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Education</h3>
                                {education.length > 0 ? education.map((edu, i) => {
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
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><Award className="h-5 w-5" /> Training</h3>
                                {training.length > 0 ? training.map((trn, i) => (
                                     <ExperienceItem key={`trn-${i}`} title={trn.name} entity={trn.provider} duration={`Completed: ${trn.completionDate}`} />
                                )) : <p className="text-muted-foreground text-sm">No training history recorded.</p>}
                            </div>
                         </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Guarantee Information</CardTitle></CardHeader>
                        <CardContent className="grid gap-6">
                            <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Incoming Guarantees</h3>
                                {incomingGuarantees.length > 0 ? incomingGuarantees.map((guarantee, i) => (
                                    <GuaranteeItem key={`inc-${i}`} guarantee={guarantee} type="incoming" />
                                )) : <p className="text-muted-foreground text-sm">No incoming guarantees recorded.</p>}
                            </div>
                            <Separator />
                             <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Outgoing Guarantees</h3>
                                {outgoingGuarantees.length > 0 ? outgoingGuarantees.map((guarantee, i) => (
                                     <GuaranteeItem key={`out-${i}`} guarantee={guarantee} type="outgoing" />
                                )) : <p className="text-muted-foreground text-sm">No outgoing guarantees recorded.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
