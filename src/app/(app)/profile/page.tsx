

"use client"

import { employees } from "@/lib/data"
import { notFound, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, Building, Calendar, DollarSign, Edit, Globe, GraduationCap, Hash, Heart, Home, Mail, MapPin, Phone, User, Users, Venus, Building2, Tag, BadgeInfo, ChevronsRight, FileText, UserCheck, Shield, ShieldCheck, CheckSquare, Award, Layers, Download, Loader2, ArrowUpRight, ArrowDownRight, UserCheck as UserCheckIcon, Shuffle, Copy, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import 'jspdf-autotable';
import { format } from "date-fns"
import { getMasterData } from "@/lib/master-data"


// In a real app, you would fetch the logged-in user's data
const loggedInEmployeeId = "EMP001"; // Mocking logged-in user

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => {
    if (!value && typeof value !== 'boolean') return null;
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

const ActivityItem = ({ action, masterData, allEmployees }: { action: any, masterData: any, allEmployees: any[] }) => {
    const Icon = actionIcons[action.type] || Briefcase;
    const { details } = action;

    const getChangeDetails = () => {
        const newJobTitleDetails = masterData.jobTitles.find((jt:any) => jt.value === (details.newJobTitle || details.actingJobTitle));
        const newDepartmentLabel = masterData.departments.find((d:any) => d.value === details.newDepartment)?.label;
        const newManagerName = allEmployees.find(e => e.id === details.newManager)?.name;
        const actionTakenLabel = masterData.disciplinaryActionTypes.find((dt:any) => dt.value === details.caseType)?.label;

        const detailItems: {label: string, value: any}[] = [];

        if (newDepartmentLabel) detailItems.push({ label: 'New Department', value: newDepartmentLabel });
        if (newJobTitleDetails) {
            detailItems.push({ label: action.type === 'Acting Assignment' ? 'Acting Job Title' : 'New Job Title', value: newJobTitleDetails.label });
            detailItems.push({ label: 'Job Grade', value: masterData.jobGrades.find((g:any) => g.value === newJobTitleDetails.jobGrade)?.label });
        }
        if (newManagerName) detailItems.push({ label: 'New Manager', value: newManagerName });
        if (details.startDate) detailItems.push({ label: 'Start Date', value: formatDate(details.startDate) });
        if (details.endDate) detailItems.push({ label: 'End Date', value: formatDate(details.endDate) });
        if (actionTakenLabel) detailItems.push({ label: 'Action Taken', value: actionTakenLabel });
        if (details.incidentDate) detailItems.push({ label: 'Incident Date', value: formatDate(details.incidentDate) });
        
        return detailItems.filter(item => item.value);
    };

    const handleDownloadMemo = () => {
        if (!action.memoContent) return;
        const doc = new jsPDF();
        const employeeName = allEmployees.find(e => e.id === action.employeeId)?.name || 'employee';
        
        const quillCss = `
            .ql-align-center { text-align: center; }
            .ql-align-right { text-align: right; }
            .ql-align-justify { text-align: justify; }
            .ql-editor { font-family: Helvetica, sans-serif; font-size: 12px; }
            .ql-editor p { margin: 0 0 1em; }
            .ql-editor ul, .ql-editor ol { padding-left: 1.5em; margin-bottom: 1em; }
            .ql-editor li { padding-left: 0.5em; }
            .ql-editor p, .ql-editor li, .ql-editor h1, .ql-editor h2, .ql-editor h3 { line-height: 1.5; }
            .ql-editor span[data-line-height] { line-height: attr(data-line-height); }
        `;

        const finalHtml = `
            <html>
                <head>
                    <style>
                       ${quillCss}
                    </style>
                </head>
                <body>
                    ${masterData.letterhead?.applyToMemos && masterData.letterhead.image ? `<img src="${masterData.letterhead.image}" style="width: 100%; position: absolute; top: 0; left: 0; z-index: -1;" />` : ''}
                    <div style="padding: 60pt 50pt;">
                        <div class="ql-container ql-snow" style="border: none;">
                          <div class="ql-editor">${action.memoContent}</div>
                        </div>
                        ${action.signature ? `
                            <div style="margin-top: 20px; position: relative;">
                                ${action.signature.signatureImage ? `<img src="${action.signature.signatureImage}" style="width: 150px; height: auto;" />` : ''}
                                ${action.signature.stampImage ? `<img src="${action.signature.stampImage}" style="width: 100px; height: 100px; position: absolute; left: 110px; top: -10px; opacity: 0.8;" />` : ''}
                                <p style="margin: 0; font-weight: bold;">${action.signature.signatoryName || ''}</p>
                                <p style="margin: 0;">${action.signature.signatoryTitle || ''}</p>
                            </div>` : '<p style="margin-top: 20px;">Nib International Bank</p>'}
                    </div>
                </body>
            </html>
        `;

        doc.html(finalHtml, {
            autoPaging: 'text',
            callback: function (doc) {
                doc.save(`Memo_${action.type.replace(' ','_')}_${employeeName.replace(/ /g, '_')}.pdf`);
            },
            x: 0,
            y: 0,
            width: 210, // A4 width
            windowWidth: 800
        });
    };

    const actionDetails = getChangeDetails();

    return (
        <div className="relative pl-8">
            <div className="absolute left-0 top-0 flex h-full w-8 justify-center">
                 <div className="h-full w-px bg-border"></div>
                 <div className="absolute top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                 </div>
            </div>
            <div className="ml-4 grid gap-1 pb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{action.type}</h4>
                        <Badge variant={
                            action.status === 'Completed' ? 'secondary' :
                            action.status === 'Pending' ? 'default' : 'destructive'
                        }>{action.status}</Badge>
                    </div>
                    {action.memoContent && (
                        <Button variant="outline" size="sm" onClick={handleDownloadMemo}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Memo
                        </Button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">Effective Date: {formatDate(action.effectiveDate)}</p>
                {actionDetails.length > 0 && (
                     <Card className="mt-2">
                        <CardContent className="p-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {actionDetails.map(item => <InfoItem key={item.label} icon={Calendar} label={item.label} value={item.value} />)}
                        </CardContent>
                    </Card>
                )}
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
    
    const masterData = useMemo(() => getMasterData(), []);
    const [allEmployees, setAllEmployees] = useState(employees);

    const loadData = () => {
        setIsLoading(true);
        const storedEmployees = localStorage.getItem('employees');
        let allEmployeesData = employees;
        if (storedEmployees) {
            try {
                 allEmployeesData = JSON.parse(storedEmployees);
                 setAllEmployees(allEmployeesData);
            } catch (error) {
                console.error("Failed to parse employees from localStorage", error);
            }
        }
        
        const foundEmployee = allEmployeesData.find(e => e.id === loggedInEmployeeId);
        setEmployee(foundEmployee || null);

        const storedActions = localStorage.getItem('personnelActions');
        if (storedActions) {
            try {
                const allActions = JSON.parse(storedActions);
                const userActions = allActions
                    .filter((action: any) => action.employeeId === loggedInEmployeeId && action.status === 'Completed')
                    .sort((a: any, b: any) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
                setPersonnelActions(userActions);
            } catch (error) {
                console.error("Failed to parse personnel actions from localStorage", error);
            }
        }

        setIsLoading(false);
    };

    useEffect(() => {
        loadData();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'employees' || event.key === 'personnelActions' || event.key === 'masterData') {
                loadData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    const handleGenerateLetter = async () => {
        if (!employee) return;
        setIsGenerating(true);

        const template = (masterData.experienceLetterTemplates || []).find(
            (t: any) => t.status === 'active'
        );

        if (!template) {
            toast({
                variant: 'destructive',
                title: 'No Active Template',
                description: `An active Work Experience Letter template could not be found.`,
            });
            setIsGenerating(false);
            return;
        }

        try {
            
            const signatureRules = masterData.signatureRules || [];
            const today = new Date();
            const employeeJobCategoryValue = masterData.jobCategories.find(jc => jc.label === employee.jobCategory)?.value || '';
            const rule = signatureRules.find((r: any) => 
                r.documentType === 'letter' &&
                r.status === 'active' &&
                r.jobCategories.includes(employeeJobCategoryValue) &&
                new Date(r.startDate) <= today &&
                (!r.endDate || new Date(r.endDate) >= today)
            );

            // Populate content
            const salaryInFigures = Number(employee.basicSalary).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const salaryInWords = numberToWords(Number(employee.basicSalary));
            const pronoun = employee.gender === 'female' ? 'She' : 'He';
            
             const tableData = (employee.internalExperience || []).map(exp => `
                <tr>
                    <td style="padding: 5px; border: 1px solid #ddd; font-size: 11px;">${formatDate(exp.startDate)}</td>
                    <td style="padding: 5px; border: 1px solid #ddd; font-size: 11px;">${exp.endDate ? formatDate(exp.endDate) : 'To date'}</td>
                    <td style="padding: 5px; border: 1px solid #ddd; font-size: 11px;">${exp.title}</td>
                </tr>`).join('');

            const tableHtml = `
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;">
                    <thead>
                        <tr>
                            <th style="padding: 5px; border: 1px solid #ddd; background-color: #E0E0E0; font-size: 11px; text-align: left;">Start Date</th>
                            <th style="padding: 5px; border: 1px solid #ddd; background-color: #E0E0E0; font-size: 11px; text-align: left;">End Date</th>
                            <th style="padding: 5px; border: 1px solid #ddd; background-color: #E0E0E0; font-size: 11px; text-align: left;">Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableData}
                    </tbody>
                </table>
            `;

            let content = template.content
                .replace(/{{employeeName}}/g, `<strong>${employee.name}</strong>`)
                .replace(/{{joinDate}}/g, formatDate(employee.joinDate))
                .replace(/{{currentPosition}}/g, employee.position)
                .replace(/{{currentDepartment}}/g, employee.department)
                .replace(/{{salaryInFigures}}/g, salaryInFigures)
                .replace(/{{salaryInWords}}/g, salaryInWords)
                .replace(/{{pronoun}}/g, pronoun)
                .replace(/{{today}}/g, format(today, "MMMM dd, yyyy"));

            if (content.includes(`<p>{{internalExperienceTable}}</p>`)) {
                content = content.replace(`<p>{{internalExperienceTable}}</p>`, tableHtml);
            } else {
                content = content.replace(`{{internalExperienceTable}}`, tableHtml);
            }

            const signatureBlockHtml = rule 
                ? `
                    <div style="margin-top: 20px; position: relative;">
                        ${rule.signatureImage ? `<img src="${rule.signatureImage}" style="width: 150px; height: auto;" />` : ''}
                        ${rule.stampImage ? `<img src="${rule.stampImage}" style="width: 100px; height: 100px; position: absolute; left: 110px; top: -10px; opacity: 0.8;" />` : ''}
                        <p style="margin: 0; font-weight: bold;">${rule.signatoryName || ''}</p>
                        <p style="margin: 0;">${rule.signatoryTitle || ''}</p>
                    </div>`
                : '<p style="margin-top: 20px;">Nib International Bank</p>';


             const quillCss = `
                body { font-family: 'Times New Roman', Times, serif; }
                .ql-align-center { text-align: center; }
                .ql-align-right { text-align: right; }
                .ql-align-justify { text-align: justify; }
                .ql-editor { font-family: 'Times New Roman', Times, serif; font-size: 12px; }
                .ql-editor p { margin: 0 0 1em; line-height: 1.5; }
                .ql-editor strong { font-weight: bold; }
                table { font-size: 11px; }
            `;
            
            const employeePhotoHtml = employee.avatar 
                ? `<img src="${employee.avatar}" style="position: absolute; top: 75px; left: 50px; width: 90px; height: 110px; border: 1px solid #ccc;"/>`
                : '';

            const finalHtml = `
                <html>
                    <head>
                        <style>
                           ${quillCss}
                        </style>
                    </head>
                    <body>
                         ${masterData.letterhead?.applyToLetters && masterData.letterhead.image ? `<img src="${masterData.letterhead.image}" style="width: 100%; position: absolute; top: 0; left: 0; z-index: -1;" />` : ''}
                         ${employeePhotoHtml}
                        <div style="padding: 40pt 40pt 40pt 40pt;">
                            <div class="ql-container ql-snow" style="border: none;">
                              <div class="ql-editor">
                                ${content}
                              </div>
                            </div>
                            ${signatureBlockHtml}
                        </div>
                    </body>
                </html>
            `;
            
            const pdf = new jsPDF();
            await pdf.html(finalHtml, {
                autoPaging: 'text',
                callback: function (doc) {
                    doc.save(`Experience_Letter_${employee.name.replace(/\s/g, '_')}.pdf`);
                },
                x: 0,
                y: 0,
                width: 210, // A4 width
                windowWidth: 800
            });

        } catch (error) {
            console.error("Failed to generate experience letter", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate experience letter. Please try again.",
            });
        } finally {
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
    const internalExperience = employee.internalExperience ? [...employee.internalExperience].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) : [];
    const externalExperience = employee.externalExperience ? [...employee.externalExperience].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) : [];
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
                    <TabsTrigger value="career-progression">Career Progression</TabsTrigger>
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
                 <TabsContent value="career-progression" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Career Progression</CardTitle>
                            <CardDescription>A chronological record of all personnel actions related to you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {personnelActions.length > 0 ? (
                                <div className="space-y-4">
                                    {personnelActions.map(action => (
                                        <ActivityItem key={action.id} action={action} masterData={masterData} allEmployees={allEmployees} />
                                    ))}
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

    
