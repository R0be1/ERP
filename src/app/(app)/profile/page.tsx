

"use client"

import { employees } from "@/lib/data"
import { notFound, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, Building, Calendar, DollarSign, Edit, Globe, GraduationCap, Hash, Heart, Home, Mail, MapPin, Phone, User, Users, Venus, Building2, Tag, BadgeInfo, ChevronsRight, FileText, UserCheck, Shield, ShieldCheck, CheckSquare, Award, Layers, Download, Loader2, ArrowUpRight, ArrowDownRight, UserCheck as UserCheckIcon, Shuffle, Copy, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateExperienceLetter } from "@/ai/flows/generate-experience-letter"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import 'jspdf-autotable';
import { format } from "date-fns"

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

const DependentItem = ({ dependent }: { dependent: any }) => (
    <div className="grid md:grid-cols-3 gap-4 border p-4 rounded-md">
        <InfoItem icon={User} label="Name" value={dependent.name} />
        <InfoItem icon={Users} label="Relationship" value={dependent.relationship} />
        <InfoItem icon={Calendar} label="Date of Birth" value={dependent.dob} />
    </div>
)

const actionIcons: { [key: string]: React.ElementType } = {
  Promotion: ArrowUpRight,
  Demotion: ArrowDownRight,
  "Acting Assignment": UserCheckIcon,
  Transfer: Shuffle,
  "Lateral Transfer": Copy,
  "Disciplinary Case": AlertTriangle,
};

const ActivityItem = ({ action }: { action: any }) => {
    const Icon = actionIcons[action.type] || Briefcase;
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 bg-muted p-2 rounded-full">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="grid gap-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{action.type}</h4>
                    <Badge variant={
                        action.status === 'Completed' ? 'secondary' :
                        action.status === 'Pending' ? 'default' : 'destructive'
                    }>{action.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Effective Date: {formatDate(action.effectiveDate)}</p>
                {action.details.newJobTitle && <p className="text-xs text-muted-foreground">To: {action.details.newJobTitle.label}</p>}
                {action.details.actingJobTitle && <p className="text-xs text-muted-foreground">As: {action.details.actingJobTitle.label}</p>}
                {action.details.newDepartment && <p className="text-xs text-muted-foreground">To: {action.details.newDepartment.label} department</p>}
            </div>
        </div>
    )
}


interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

// Function to convert number to words
const numberToWords = (num: number): string => {
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if (num === 0) return 'Zero';

    const toWords = (n: number): string => {
        if (n < 20) return a[n];
        let rem = n % 10;
        return b[Math.floor(n / 10)] + (rem ? '-' + a[rem] : '');
    };
    
    const numToWords = (n: number) => {
        if (n < 100) return toWords(n);
        let rem = n % 100;
        return a[Math.floor(n/100)] + ' hundred' + (rem > 0 ? ' ' + toWords(rem) : '');
    }

    let words = '';
    const crores = Math.floor(num / 10000000);
    num %= 10000000;
    const lakhs = Math.floor(num / 100000);
    num %= 100000;
    const thousands = Math.floor(num / 1000);
    num %= 1000;
    const hundreds = num;

    if (crores > 0) words += numToWords(crores) + ' crore ';
    if (lakhs > 0) words += numToWords(lakhs) + ' lakh ';
    if (thousands > 0) words += numToWords(thousands) + ' thousand ';
    if (hundreds > 0) words += numToWords(hundreds);

    return words.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
        return format(new Date(dateString), "dd-MMM-yyyy");
    } catch (e) {
        return dateString;
    }
}

export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [employee, setEmployee] = useState<(typeof employees)[number] | null>(null);
    const [personnelActions, setPersonnelActions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

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

        const storedActions = localStorage.getItem('personnelActions');
        if (storedActions) {
            try {
                const allActions = JSON.parse(storedActions);
                const userActions = allActions.filter((action: any) => action.employeeId === loggedInEmployeeId);
                setPersonnelActions(userActions);
            } catch (error) {
                console.error("Failed to parse personnel actions from localStorage", error);
            }
        }

        setIsLoading(false);
    }, []);
    
    const handleGenerateLetter = async () => {
        if (!employee) return;
        setIsGenerating(true);
        try {
            const doc = new jsPDF() as jsPDFWithAutoTable;
            
            const addContent = () => {
                const today = new Date();
                const date = format(today, "MMMM dd, yyyy");

                doc.setFontSize(12);
                doc.text(date, doc.internal.pageSize.getWidth() - 20, 20, { align: 'right' });
                
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text("To Whom It May Concern", doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });
                doc.setFont('helvetica', 'normal');

                doc.setFontSize(12);
                const joinDate = formatDate(employee.joinDate);
                const introText = `This is to certify that ${employee.name} has been in the service of Nib International Bank since ${joinDate}. During this period, the captioned employee has been serving on the following job position(s):`;
                doc.text(introText, 20, 70, { maxWidth: doc.internal.pageSize.getWidth() - 40, align: 'justify' });

                const tableData = employee.internalExperience.map(exp => [
                    formatDate(exp.startDate),
                    exp.endDate ? formatDate(exp.endDate) : 'Present',
                    exp.title,
                ]);

                doc.autoTable({
                    head: [['Start Date', 'End Date', 'Job Titles']],
                    body: tableData,
                    startY: 85,
                    headStyles: { fillColor: [70, 130, 180] }, // Soft blue
                });
                
                const lastTableY = doc.autoTable.previous.finalY;
                
                const pronoun = employee.gender === 'female' ? 'She' : 'He';
                const salaryInBirr = Number(employee.basicSalary).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                const salaryInWords = numberToWords(Number(employee.basicSalary));
                const salaryText = `${pronoun} is entitled a monthly basic salary of Birr ${salaryInBirr} (Birr ${salaryInWords}). All necessary income tax has been regularly deducted from the employee’s taxable income(s) and duly paid to the concerned government organ(s).`;
                
                doc.text(salaryText, 20, lastTableY + 15, { maxWidth: doc.internal.pageSize.getWidth() - 40, align: 'justify' });

                const closingText = "Please note that this work experience letter does not serve as a release paper.";
                doc.text(closingText, 20, lastTableY + 35, { maxWidth: doc.internal.pageSize.getWidth() - 40 });
                
                doc.text("Nib International Bank", 20, lastTableY + 60);

                doc.save(`Experience_Letter_${employee.name.replace(/\s/g, '_')}.pdf`);
                setIsGenerating(false);
            };

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = employee.avatar;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                doc.addImage(dataURL, 'PNG', 20, 10, 30, 30);
                addContent();
            };
            img.onerror = () => {
                console.error("Failed to load image for PDF");
                addContent();
            }

        } catch (error) {
            console.error("Failed to generate experience letter", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate experience letter. Please try again.",
            });
            setIsGenerating(false);
        }
    };


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

            <Tabs defaultValue="personal">
                <TabsList className="flex-wrap h-auto">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="job">Job</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education-training">Education &amp; Training</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="dependents">Dependents</TabsTrigger>
                    <TabsTrigger value="guarantees">Guarantees</TabsTrigger>
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
                           <InfoItem icon={Calendar} label="Date of Birth" value={formatDate(employee.dob)} />
                           <InfoItem icon={Heart} label="Marital Status" value={employee.maritalStatus} />
                           <InfoItem icon={MapPin} label="Current Address" value={fullAddress} />
                           <InfoItem icon={UserCheck} label="National ID" value={employee.nationalId} />
                           <InfoItem icon={UserCheck} label="Kebele ID" value={employee.kebeleId} />
                           <InfoItem icon={Shield} label="Driving License" value={employee.drivingLicense} />
                           <InfoItem icon={FileText} label="Passport No." value={employee.passportNo} />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="job" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6">
                            <InfoItem icon={Building} label="Department" value={employee.department} />
                            <InfoItem icon={Briefcase} label="Job Title" value={employee.position} />
                            <InfoItem icon={User} label="Manager" value={employee.manager} />
                            <InfoItem icon={Tag} label="Job Grade" value={employee.jobGrade} />
                            <InfoItem icon={Layers} label="Job Category" value={employee.jobCategory} />
                            <InfoItem icon={Home} label="Work Location" value="Head Office" />
                             <InfoItem icon={BadgeInfo} label="Employment Type" value={employee.employmentType} />
                            <InfoItem icon={Calendar} label="Join Date" value={formatDate(employee.joinDate)} />
                            <InfoItem icon={Calendar} label="Probation End Date" value={formatDate(employee.probationEndDate)} />
                            <InfoItem icon={Badge} label="Status" value={<Badge variant={employee.status === "Active" ? "secondary" : "destructive"}>{employee.status}</Badge>} />
                        </CardContent>
                    </Card>
                 </TabsContent>
                <TabsContent value="experience" className="mt-4">
                    <div className="flex justify-end mb-4">
                        <Button variant="outline" onClick={handleGenerateLetter} disabled={isGenerating}>
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="mr-2 h-4 w-4" />
                            )}
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
                                        duration={`${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`}
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
                                        duration={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                                        description={exp.managerialRole ? 'Managerial Role' : ''}
                                    />
                                )) : <p className="text-muted-foreground text-sm">No external experience recorded.</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="education-training" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Education &amp; Training</CardTitle></CardHeader>
                         <CardContent className="grid gap-6">
                             <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Education</h3>
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
                                            duration={`Completed: ${formatDate(edu.completionDate)}`}
                                            details={details}
                                        />
                                    )
                                }) : <p className="text-muted-foreground text-sm">No education history recorded.</p>}
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><Award className="h-5 w-5" /> Training</h3>
                                {training.length > 0 ? training.map((trn, i) => (
                                     <ExperienceItem key={`trn-${i}`} title={trn.name} entity={trn.provider} duration={`Completed: ${formatDate(trn.completionDate)}`} />
                                )) : <p className="text-muted-foreground text-sm">No training history recorded.</p>}
                            </div>
                         </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="financial" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6">
                            <InfoItem icon={DollarSign} label="Basic Salary" value={`${employee.basicSalary} ${employee.currency}`} />
                            <InfoItem icon={Building} label="Bank Name" value={employee.bankName} />
                            <InfoItem icon={Hash} label="Account Number" value={employee.accountNumber} />
                            <InfoItem icon={FileText} label="Tax ID" value={employee.taxId} />
                            <InfoItem icon={FileText} label="Pension Number" value={employee.pensionNumber} />
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="dependents" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dependents</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {dependents.length > 0 ? dependents.map((dependent, i) => (
                                <DependentItem key={i} dependent={dependent} />
                            )) : <p className="text-muted-foreground text-sm">No dependents recorded.</p>}
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="guarantees" className="mt-4">
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
                 </TabsContent>
                 <TabsContent value="activity" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Log</CardTitle>
                            <CardDescription>A chronological record of all personnel actions related to you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {personnelActions.length > 0 ? (
                                <div className="relative pl-6">
                                    <div className="absolute left-9 top-0 h-full w-px bg-border"></div>
                                    <div className="space-y-8">
                                    {personnelActions.map(action => (
                                        <ActivityItem key={action.id} action={action} />
                                    ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">No personnel actions recorded.</p>
                            )}
                        </CardContent>
                    </Card>
                 </TabsContent>
            </Tabs>
        </div>
    )
}


    
