

"use client"

import { MoreHorizontal, PlusCircle, Search, Trash2, Check, ChevronsUpDown, Edit } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { employees as initialEmployees } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

const initialNewEmployeeState = {
  // Profile
  id: '',
  employeeId: '',
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  gender: '',
  maritalStatus: '',
  nationality: '',
  nationalId: '',
  kebeleId: '',
  drivingLicense: '',
  passportNo: '',
  // Job
  department: '',
  position: '', // Job Title
  manager: '',
  employmentType: '',
  jobGrade: '',
  joinDate: '',
  probationEndDate: '',
  // Contact
  workEmail: '',
  personalEmail: '',
  mobileNumber: '',
  address: { country: 'Ethiopia', region: '', city: '', subcity: '', woreda: '', kebele: '', houseNo: '' },
  emergencyContacts: [{ name: '', relationship: '', phone: '' }],
  // Financial
  contractStartDate: '',
  contractEndDate: '',
  basicSalary: '',
  currency: '',
  bankName: '',
  accountNumber: '',
  taxId: '',
  pensionNumber: '',
  // History & Development
  dependents: [{ name: '', relationship: '', dob: '' }],
  internalExperience: [{ title: '', department: '', startDate: '', endDate: '', responsibilities: '' }],
  externalExperience: [{ company: '', title: '', startDate: '', endDate: '', responsibilities: '' }],
  education: [{ degree: '', institution: '', field: '', completionDate: '', grade: '' }],
  training: [{ name: '', provider: '', completionDate: '', file: null }],
  // Guarantees
  incomingGuarantees: [{ guarantorName: '', relationship: '', organization: '', organizationPhone: '', guarantorPhone: '', issueDate: '', document: null }],
  outgoingGuarantees: [{ recipientName: '', recipientPhone: '', relationship: '', organization: '', organizationPhone: '', poBox: '', amount: '', issueDate: '', expiryDate: '', document: null }],
};

const regions = [
  { value: 'addis-ababa', label: 'Addis Ababa' },
  { value: 'afar', label: 'Afar' },
  { value: 'amhara', label: 'Amhara' },
  { value: 'benishangul-gumuz', label: 'Benishangul-Gumuz' },
  { value: 'dire-dawa', label: 'Dire Dawa' },
  { value: 'gambela', label: 'Gambela' },
  { value: 'harari', label: 'Harari' },
  { value: 'oromia', label: 'Oromia' },
  { value: 'somali', label: 'Somali' },
  { value: 'snnp', label: 'Southern Nations, Nationalities, and Peoples\'' },
  { value: 'tigray', label: 'Tigray' },
]

const departments = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'human-resources', label: 'Human Resources' },
  { value: 'product', label: 'Product' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
]

const jobTitles = [
    { value: 'software-engineer', label: 'Software Engineer' },
    { value: 'senior-software-engineer', label: 'Senior Software Engineer' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'marketing-manager', label: 'Marketing Manager' },
    { value: 'sales-representative', label: 'Sales Representative' },
    { value: 'hr-specialist', label: 'HR Specialist' },
]

type Employee = (typeof initialEmployees)[number];
type FormEmployeeState = typeof initialNewEmployeeState;

interface EmployeeFormProps {
    initialData: FormEmployeeState;
    isEditMode?: boolean;
    onSubmit: (employeeData: FormEmployeeState, photo: string | null) => void;
    onCancel: () => void;
}

const EmployeeForm = ({ initialData, isEditMode = false, onSubmit, onCancel }: EmployeeFormProps) => {
    const [employeeData, setEmployeeData] = useState(initialData);
    const [photoPreview, setPhotoPreview] = useState<string | null>(isEditMode ? (initialData as any).avatar : null);
    const [isRegionPopoverOpen, setRegionPopoverOpen] = useState(false);
    const [isDepartmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
    const [isPositionPopoverOpen, setPositionPopoverOpen] = useState(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setEmployeeData(prevState => ({
                ...prevState,
                address: { ...prevState.address, [addressField]: value }
            }));
        } else {
            setEmployeeData(prevState => ({ ...prevState, [name]: value }));
        }
    }, []);

    const handleSelectChange = useCallback((name: string, value: string) => {
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setEmployeeData(prevState => ({
                ...prevState,
                address: { ...prevState.address, [addressField]: value }
            }));
        } else {
            setEmployeeData(prevState => ({ ...prevState, [name]: value }));
        }
    }, []);

    const handleNestedInputChange = useCallback((section: keyof FormEmployeeState, index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEmployeeData(prevState => {
            const list = prevState[section] as any[];
            const updatedList = [...list];
            updatedList[index] = { ...updatedList[index], [name]: value };
            return { ...prevState, [section]: updatedList };
        });
    }, []);

    const addListItem = useCallback((section: keyof FormEmployeeState) => {
        let newItem;
        switch (section) {
            case 'emergencyContacts': newItem = { name: '', relationship: '', phone: '' }; break;
            case 'dependents': newItem = { name: '', relationship: '', dob: '' }; break;
            case 'internalExperience': newItem = { title: '', department: '', startDate: '', endDate: '', responsibilities: '' }; break;
            case 'externalExperience': newItem = { company: '', title: '', startDate: '', endDate: '', responsibilities: '' }; break;
            case 'education': newItem = { degree: '', institution: '', field: '', completionDate: '', grade: '' }; break;
            case 'training': newItem = { name: '', provider: '', completionDate: '', file: null }; break;
            case 'incomingGuarantees': newItem = { guarantorName: '', relationship: '', organization: '', organizationPhone: '', guarantorPhone: '', issueDate: '', document: null }; break;
            case 'outgoingGuarantees': newItem = { recipientName: '', recipientPhone: '', relationship: '', organization: '', organizationPhone: '', poBox: '', amount: '', issueDate: '', expiryDate: '', document: null }; break;
            default: newItem = {};
        }
        setEmployeeData(prevState => ({
            ...prevState,
            [section]: [...(prevState[section] as any[]), newItem]
        }));
    }, []);

    const removeListItem = useCallback((section: keyof FormEmployeeState, index: number) => {
        setEmployeeData(prevState => {
            const list = prevState[section] as any[];
            return { ...prevState, [section]: list.filter((_, i) => i !== index) };
        });
    }, []);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSubmit = () => {
        onSubmit(employeeData, photoPreview);
    };
    
    return (
       <>
        <Tabs defaultValue="personal-job">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal-job">Personal & Job</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="guarantees">Guarantees</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-job" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                <div className="grid gap-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="employeeId">Employee ID</Label>
                                <Input id="employeeId" name="employeeId" value={employeeData.employeeId} onChange={handleInputChange} disabled={isEditMode} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Select name="title" onValueChange={(v) => handleSelectChange('title', v)} value={employeeData.title}>
                                    <SelectTrigger id="title"><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ato">Ato</SelectItem>
                                        <SelectItem value="Woy">Woy</SelectItem>
                                        <SelectItem value="Dr">Dr</SelectItem>
                                        <SelectItem value="Eng">Eng</SelectItem>
                                        <SelectItem value="Prof">Prof</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2"></div>
                           <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" value={employeeData.firstName} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="middleName">Middle Name</Label>
                                <Input id="middleName" name="middleName" value={employeeData.middleName} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" value={employeeData.lastName} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" name="dob" type="date" value={employeeData.dob} onChange={handleInputChange} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender" onValueChange={(v) => handleSelectChange('gender', v)} value={employeeData.gender}>
                                    <SelectTrigger id="gender"><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="marital-status">Marital Status</Label>
                                <Select name="maritalStatus" onValueChange={(v) => handleSelectChange('maritalStatus', v)} value={employeeData.maritalStatus}>
                                    <SelectTrigger id="marital-status"><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input id="nationality" name="nationality" value={employeeData.nationality} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2 md:col-span-3">
                                <Label htmlFor="photo">Photo</Label>
                                <div className="flex items-center gap-4">
                                    <Input id="photo" type="file" className="max-w-xs" onChange={handlePhotoChange} accept="image/*" />
                                    {photoPreview && (
                                        <div className="w-20 h-20 border rounded-md p-1">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={photoPreview} alt="Employee photo preview" />
                                                <AvatarFallback>Preview</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Identification Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                           <div className="grid gap-2">
                                <Label htmlFor="nationalId">National ID</Label>
                                <Input id="nationalId" name="nationalId" value={employeeData.nationalId} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kebeleId">Kebele ID</Label>
                                <Input id="kebeleId" name="kebeleId" value={employeeData.kebeleId} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="drivingLicense">Driving License</Label>
                                <Input id="drivingLicense" name="drivingLicense" value={employeeData.drivingLicense} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="passportNo">Passport No.</Label>
                                <Input id="passportNo" name="passportNo" value={employeeData.passportNo} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                         <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="department">Department</Label>
                                 <Popover open={isDepartmentPopoverOpen} onOpenChange={setDepartmentPopoverOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isDepartmentPopoverOpen}
                                        className="w-full justify-between"
                                    >
                                        {employeeData.department
                                        ? departments.find((d) => d.value === employeeData.department)?.label
                                        : "Select department..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search department..." />
                                        <CommandEmpty>No department found.</CommandEmpty>
                                        <CommandGroup>
                                        {departments.map((d) => (
                                            <CommandItem
                                            key={d.value}
                                            value={d.value}
                                            onSelect={(currentValue) => {
                                                handleSelectChange('department', currentValue === employeeData.department ? "" : currentValue)
                                                setDepartmentPopoverOpen(false)
                                            }}
                                            >
                                            <Check
                                                className={cn(
                                                "mr-2 h-4 w-4",
                                                employeeData.department === d.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {d.label}
                                            </CommandItem>
                                        ))}
                                        </CommandGroup>
                                    </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="position">Job Title</Label>
                                <Popover open={isPositionPopoverOpen} onOpenChange={setPositionPopoverOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isPositionPopoverOpen}
                                        className="w-full justify-between"
                                    >
                                        {employeeData.position
                                        ? jobTitles.find((p) => p.value === employeeData.position)?.label
                                        : "Select job title..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search job title..." />
                                        <CommandEmpty>No job title found.</CommandEmpty>
                                        <CommandGroup>
                                        {jobTitles.map((p) => (
                                            <CommandItem
                                            key={p.value}
                                            value={p.value}
                                            onSelect={(currentValue) => {
                                                handleSelectChange('position', currentValue === employeeData.position ? "" : currentValue)
                                                setPositionPopoverOpen(false)
                                            }}
                                            >
                                            <Check
                                                className={cn(
                                                "mr-2 h-4 w-4",
                                                employeeData.position === p.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {p.label}
                                            </CommandItem>
                                        ))}
                                        </CommandGroup>
                                    </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="manager">Manager</Label>
                                <Input id="manager" name="manager" value={employeeData.manager} onChange={handleInputChange} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="employment-type">Employment Type</Label>
                                 <Select name="employmentType" onValueChange={(v) => handleSelectChange('employmentType', v)} value={employeeData.employmentType}>
                                    <SelectTrigger id="employment-type"><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="permanent">Permanent</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="intern">Intern</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="jobGrade">Job Grade</Label>
                                <Input id="jobGrade" name="jobGrade" value={employeeData.jobGrade} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="joinDate">Join Date</Label>
                                <Input id="joinDate" name="joinDate" type="date" value={employeeData.joinDate} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="probationEndDate">Probation End Date</Label>
                                <Input id="probationEndDate" name="probationEndDate" type="date" value={employeeData.probationEndDate} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

             <TabsContent value="contact" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="workEmail">Work Email</Label>
                                <Input id="workEmail" name="workEmail" type="email" value={employeeData.workEmail} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="personalEmail">Personal Email</Label>
                                <Input id="personalEmail" name="personalEmail" type="email" value={employeeData.personalEmail} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="mobileNumber">Mobile Number</Label>
                                <Input id="mobileNumber" name="mobileNumber" type="tel" value={employeeData.mobileNumber} onChange={handleInputChange} />
                            </div>
                        </div>
                         <Separator />
                        <p className="font-medium text-sm">Address</p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="address.country" value={employeeData.address.country} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="region">Region</Label>
                                <Popover open={isRegionPopoverOpen} onOpenChange={setRegionPopoverOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isRegionPopoverOpen}
                                        className="w-full justify-between"
                                    >
                                        {employeeData.address.region
                                        ? regions.find((region) => region.value === employeeData.address.region)?.label
                                        : "Select region..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search region..." />
                                        <CommandEmpty>No region found.</CommandEmpty>
                                        <CommandGroup>
                                        {regions.map((region) => (
                                            <CommandItem
                                            key={region.value}
                                            value={region.value}
                                            onSelect={(currentValue) => {
                                                handleSelectChange('address.region', currentValue === employeeData.address.region ? "" : currentValue)
                                                setRegionPopoverOpen(false)
                                            }}
                                            >
                                            <Check
                                                className={cn(
                                                "mr-2 h-4 w-4",
                                                employeeData.address.region === region.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {region.label}
                                            </CommandItem>
                                        ))}
                                        </CommandGroup>
                                    </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="address.city" value={employeeData.address.city} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subcity">Subcity</Label>
                                <Input id="subcity" name="address.subcity" value={employeeData.address.subcity} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="woreda">Woreda</Label>
                                <Input id="woreda" name="address.woreda" value={employeeData.address.woreda} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kebele">Kebele</Label>
                                <Input id="kebele" name="address.kebele" value={employeeData.address.kebele} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="houseNo">House Number</Label>
                                <Input id="houseNo" name="address.houseNo" value={employeeData.address.houseNo} onChange={handleInputChange} />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">Emergency Contacts</p>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('emergencyContacts')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Contact
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {(employeeData.emergencyContacts || []).map((contact: any, index: number) => (
                                <div key={index} className="grid md:grid-cols-4 items-end gap-4 p-4 border rounded-md relative">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`ec-name-${index}`}>Full Name</Label>
                                        <Input id={`ec-name-${index}`} name="name" value={contact.name} onChange={(e) => handleNestedInputChange('emergencyContacts', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`ec-relationship-${index}`}>Relationship</Label>
                                        <Input id={`ec-relationship-${index}`} name="relationship" value={contact.relationship} onChange={(e) => handleNestedInputChange('emergencyContacts', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`ec-phone-${index}`}>Phone Number</Label>
                                        <Input id={`ec-phone-${index}`} name="phone" value={contact.phone} onChange={(e) => handleNestedInputChange('emergencyContacts', index, e)} />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeListItem('emergencyContacts', index)}
                                        className="h-9 w-9"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

             <TabsContent value="financial" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                 <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contract & Salary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="contractStartDate">Contract Start Date</Label>
                                <Input id="contractStartDate" name="contractStartDate" type="date" value={employeeData.contractStartDate} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contractEndDate">Contract End Date</Label>
                                <Input id="contractEndDate" name="contractEndDate" type="date" value={employeeData.contractEndDate} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="basicSalary">Basic Salary</Label>
                                <Input id="basicSalary" name="basicSalary" value={employeeData.basicSalary} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select name="currency" onValueChange={(v) => handleSelectChange('currency', v)} value={employeeData.currency}>
                                    <SelectTrigger id="currency"><SelectValue placeholder="Select..." /></SelectTrigger>
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
                        </CardHeader>
                         <CardContent className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input id="bankName" name="bankName" value={employeeData.bankName} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input id="accountNumber" name="accountNumber" value={employeeData.accountNumber} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="taxId">Tax ID</Label>
                                <Input id="taxId" name="taxId" value={employeeData.taxId} onChange={handleInputChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pensionNumber">Pension Number</Label>
                                <Input id="pensionNumber" name="pensionNumber" value={employeeData.pensionNumber} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </TabsContent>
             
            <TabsContent value="history" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>Dependents</CardTitle>
                                <CardDescription>Manage dependent information.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('dependents')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Dependent
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                            {(employeeData.dependents || []).map((dependent: any, index: number) => (
                                <div key={index} className="grid md:grid-cols-4 items-end gap-4 p-4 border rounded-md relative">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`dep-name-${index}`}>Full Name</Label>
                                        <Input id={`dep-name-${index}`} name="name" value={dependent.name} onChange={(e) => handleNestedInputChange('dependents', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`dep-relationship-${index}`}>Relationship</Label>
                                        <Input id={`dep-relationship-${index}`} name="relationship" value={dependent.relationship} onChange={(e) => handleNestedInputChange('dependents', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`dep-dob-${index}`}>Date of Birth</Label>
                                        <Input id={`dep-dob-${index}`} name="dob" type="date" value={dependent.dob} onChange={(e) => handleNestedInputChange('dependents', index, e)} />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeListItem('dependents', index)}
                                        className="h-9 w-9"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>Internal Work Experience</CardTitle>
                            </div>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('internalExperience')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Experience
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                            {(employeeData.internalExperience || []).map((exp: any, index: number) => (
                                <div key={index} className="grid gap-4 p-4 border rounded-md relative">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`int-title-${index}`}>Job Title</Label>
                                            <Input id={`int-title-${index}`} name="title" value={exp.title} onChange={(e) => handleNestedInputChange('internalExperience', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`int-department-${index}`}>Department</Label>
                                            <Input id={`int-department-${index}`} name="department" value={exp.department} onChange={(e) => handleNestedInputChange('internalExperience', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`int-startDate-${index}`}>Start Date</Label>
                                            <Input id={`int-startDate-${index}`} name="startDate" type="date" value={exp.startDate} onChange={(e) => handleNestedInputChange('internalExperience', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`int-endDate-${index}`}>End Date</Label>
                                            <Input id={`int-endDate-${index}`} name="endDate" type="date" value={exp.endDate} onChange={(e) => handleNestedInputChange('internalExperience', index, e)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`int-responsibilities-${index}`}>Key Responsibilities</Label>
                                        <Textarea id={`int-responsibilities-${index}`} name="responsibilities" value={exp.responsibilities} onChange={(e) => handleNestedInputChange('internalExperience', index, e)} />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeListItem('internalExperience', index)}
                                        className="absolute top-4 right-4 h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>External Work Experience</CardTitle>
                            </div>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('externalExperience')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Experience
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                            {(employeeData.externalExperience || []).map((exp: any, index: number) => (
                                <div key={index} className="grid gap-4 p-4 border rounded-md relative">
                                    <div className="grid md:grid-cols-2 gap-4">
                                         <div className="grid gap-2">
                                            <Label htmlFor={`ext-company-${index}`}>Company Name</Label>
                                            <Input id={`ext-company-${index}`} name="company" value={exp.company} onChange={(e) => handleNestedInputChange('externalExperience', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ext-title-${index}`}>Job Title</Label>
                                            <Input id={`ext-title-${index}`} name="title" value={exp.title} onChange={(e) => handleNestedInputChange('externalExperience', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ext-startDate-${index}`}>Start Date</Label>
                                            <Input id={`ext-startDate-${index}`} name="startDate" type="date" value={exp.startDate} onChange={(e) => handleNestedInputChange('externalExperience', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ext-endDate-${index}`}>End Date</Label>
                                            <Input id={`ext-endDate-${index}`} name="endDate" type="date" value={exp.endDate} onChange={(e) => handleNestedInputChange('externalExperience', index, e)} />
                                        </div>
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor={`ext-responsibilities-${index}`}>Key Responsibilities</Label>
                                        <Textarea id={`ext-responsibilities-${index}`} name="responsibilities" value={exp.responsibilities} onChange={(e) => handleNestedInputChange('externalExperience', index, e)} />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeListItem('externalExperience', index)}
                                        className="absolute top-4 right-4 h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>Education Qualifications</CardTitle>
                            </div>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('education')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Qualification
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                            {(employeeData.education || []).map((edu: any, index: number) => (
                                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border rounded-md relative">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edu-degree-${index}`}>Degree/Certificate</Label>
                                        <Input id={`edu-degree-${index}`} name="degree" value={edu.degree} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
                                        <Input id={`edu-institution-${index}`} name="institution" value={edu.institution} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
                                        <Input id={`edu-field-${index}`} name="field" value={edu.field} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edu-completionDate-${index}`}>Completion Date</Label>
                                        <Input id={`edu-completionDate-${index}`} name="completionDate" type="date" value={edu.completionDate} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edu-grade-${index}`}>Grade/Result (Optional)</Label>
                                        <Input id={`edu-grade-${index}`} name="grade" value={edu.grade} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeListItem('education', index)}
                                        className="absolute top-4 right-4 h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>Training & Certificates</CardTitle>
                            </div>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('training')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Training
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                            {(employeeData.training || []).map((train: any, index: number) => (
                                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border rounded-md relative">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`train-name-${index}`}>Program/Certificate Name</Label>
                                        <Input id={`train-name-${index}`} name="name" value={train.name} onChange={(e) => handleNestedInputChange('training', index, e)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`train-provider-${index}`}>Provider</Label>
                                        <Input id={`train-provider-${index}`} name="provider" value={train.provider} onChange={(e) => handleNestedInputChange('training', index, e)} />
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor={`train-completionDate-${index}`}>Completion Date</Label>
                                        <Input id={`train-completionDate-${index}`} name="completionDate" type="date" value={train.completionDate} onChange={(e) => handleNestedInputChange('training', index, e)} />
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor={`train-file-${index}`}>Certificate File</Label>
                                        <Input id={`train-file-${index}`} name="file" type="file" />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeListItem('training', index)}
                                        className="absolute top-4 right-4 h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            
             <TabsContent value="guarantees" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>Incoming Guarantee</CardTitle>
                                <CardDescription>Guarantees provided to the employee by a third party.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('incomingGuarantees')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Incoming
                            </Button>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {(employeeData.incomingGuarantees || []).map((guarantee: any, index: number) => (
                                <div key={index} className="grid gap-4 p-4 border rounded-md relative">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ig-name-${index}`}>Guarantor Name</Label>
                                            <Input id={`ig-name-${index}`} name="guarantorName" value={guarantee.guarantorName} onChange={(e) => handleNestedInputChange('incomingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ig-relationship-${index}`}>Relationship</Label>
                                            <Input id={`ig-relationship-${index}`} name="relationship" value={guarantee.relationship} onChange={(e) => handleNestedInputChange('incomingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ig-organization-${index}`}>Organization</Label>
                                            <Input id={`ig-organization-${index}`} name="organization" value={guarantee.organization} onChange={(e) => handleNestedInputChange('incomingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ig-org-phone-${index}`}>Organization Phone</Label>
                                            <Input id={`ig-org-phone-${index}`} name="organizationPhone" value={guarantee.organizationPhone} onChange={(e) => handleNestedInputChange('incomingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ig-guarantor-phone-${index}`}>Guarantor Phone</Label>
                                            <Input id={`ig-guarantor-phone-${index}`} name="guarantorPhone" value={guarantee.guarantorPhone} onChange={(e) => handleNestedInputChange('incomingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ig-issueDate-${index}`}>Issue Date</Label>
                                            <Input id={`ig-issueDate-${index}`} name="issueDate" type="date" value={guarantee.issueDate} onChange={(e) => handleNestedInputChange('incomingGuarantees', index, e)} />
                                        </div>
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor={`ig-document-${index}`}>Supporting Document</Label>
                                        <Input id={`ig-document-${index}`} name="document" type="file" />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeListItem('incomingGuarantees', index)} className="absolute top-4 right-4 h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="grid gap-1">
                                <CardTitle>Outgoing Guarantee</CardTitle>
                                <CardDescription>Guarantees provided by the employee to a third party.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" type="button" onClick={() => addListItem('outgoingGuarantees')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Outgoing
                            </Button>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {(employeeData.outgoingGuarantees || []).map((guarantee: any, index: number) => (
                                <div key={index} className="grid gap-4 p-4 border rounded-md relative">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-recipientName-${index}`}>Recipient Name</Label>
                                            <Input id={`og-recipientName-${index}`} name="recipientName" value={guarantee.recipientName} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-recipientPhone-${index}`}>Recipient Phone</Label>
                                            <Input id={`og-recipientPhone-${index}`} name="recipientPhone" value={guarantee.recipientPhone} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-relationship-${index}`}>Relationship</Label>
                                            <Input id={`og-relationship-${index}`} name="relationship" value={guarantee.relationship} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-organization-${index}`}>Organization</Label>
                                            <Input id={`og-organization-${index}`} name="organization" value={guarantee.organization} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-org-phone-${index}`}>Organization Phone</Label>
                                            <Input id={`og-org-phone-${index}`} name="organizationPhone" value={guarantee.organizationPhone} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-poBox-${index}`}>P.O. Box</Label>
                                            <Input id={`og-poBox-${index}`} name="poBox" value={guarantee.poBox} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-amount-${index}`}>Guarantee Amount (ETB)</Label>
                                            <Input id={`og-amount-${index}`} name="amount" value={guarantee.amount} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-issueDate-${index}`}>Issue Date</Label>
                                            <Input id={`og-issueDate-${index}`} name="issueDate" type="date" value={guarantee.issueDate} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`og-expiryDate-${index}`}>Expiry Date</Label>
                                            <Input id={`og-expiryDate-${index}`} name="expiryDate" type="date" value={guarantee.expiryDate} onChange={(e) => handleNestedInputChange('outgoingGuarantees', index, e)} />
                                        </div>
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor={`og-document-${index}`}>Supporting Document</Label>
                                        <Input id={`og-document-${index}`} name="document" type="file" />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeListItem('outgoingGuarantees', index)} className="absolute top-4 right-4 h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit}>
                {isEditMode ? 'Save Changes' : 'Add Employee'}
            </Button>
        </DialogFooter>
       </>
    );
};

export default function EmployeesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<FormEmployeeState | null>(null);
  const [isEditEmployeeDialogOpen, setEditEmployeeDialogOpen] = useState(false);


  useEffect(() => {
    const editEmployeeId = searchParams.get('edit');
    if (editEmployeeId) {
        const employeeToEdit = employees.find(emp => emp.id === editEmployeeId);
        if (employeeToEdit) {
            handleOpenEditDialog(employeeToEdit);
        }
    }
  }, [searchParams, employees]);

  const handleAddEmployee = (employeeData: FormEmployeeState, photo: string | null) => {
    const newEmp: Employee = {
      id: employeeData.employeeId || `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: `${employeeData.title} ${employeeData.firstName} ${employeeData.lastName}`,
      email: employeeData.workEmail,
      position: jobTitles.find(j => j.value === employeeData.position)?.label || employeeData.position,
      department: departments.find(d => d.value === employeeData.department)?.label || employeeData.department,
      status: 'Active',
      avatar: photo || 'https://placehold.co/40x40.png',
      ...employeeData, // Add all other fields
    };
    setEmployees(prev => [...prev, newEmp]);
    setAddEmployeeDialogOpen(false);
  };
  
  const handleUpdateEmployee = (employeeData: FormEmployeeState, photo: string | null) => {
    if (!selectedEmployee) return;

    const updatedEmployees = employees.map(emp => {
      if (emp.id === (selectedEmployee as any).id) {
        return {
          ...(emp as any),
          ...employeeData,
           name: `${employeeData.title} ${employeeData.firstName} ${employeeData.lastName}`,
           email: employeeData.workEmail,
           position: jobTitles.find(j => j.value === employeeData.position)?.label || employeeData.position,
           department: departments.find(d => d.value === employeeData.department)?.label || employeeData.department,
           avatar: photo || (emp as any).avatar,
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees as any);
    handleCloseEditDialog();
  };
  
  const handleOpenEditDialog = (employee: Employee) => {
      const employeeData = JSON.parse(JSON.stringify(employee));
      const fullEmployeeData = { ...initialNewEmployeeState, ...employeeData };
      setSelectedEmployee(fullEmployeeData);
      setEditEmployeeDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditEmployeeDialogOpen(false);
    setSelectedEmployee(null);
    const newUrl = window.location.pathname;
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
  };


  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };
  
  const exportToCsv = () => {
    const headers = ["ID", "Name", "Email", "Position", "Department", "Status"];
    const rows = employees.map(emp => [emp.id, emp.name, emp.email, emp.position, emp.department, emp.status].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Employees</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={exportToCsv}>
            Export
          </Button>
          <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setAddEmployeeDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the details for the new employee across the different sections.
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm 
                initialData={initialNewEmployeeState} 
                onSubmit={handleAddEmployee}
                onCancel={() => setAddEmployeeDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Manage your employees and view their information.
          </CardDescription>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search employees..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                         <AvatarImage src={employee.avatar} alt="Avatar" data-ai-hint="person portrait" />
                         <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "Active" ? "secondary" : employee.status === 'On Leave' ? 'outline' : 'destructive'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => router.push(`/employees/${employee.id}`)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleOpenEditDialog(employee as any)}>Edit</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the employee record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{filteredEmployees.length > 10 ? 10 : filteredEmployees.length}</strong> of <strong>{filteredEmployees.length}</strong> employees
          </div>
        </CardFooter>
      </Card>
      
       <Dialog open={isEditEmployeeDialogOpen} onOpenChange={setEditEmployeeDialogOpen}>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>
                  Update the details for the employee.
                </DialogDescription>
              </DialogHeader>
              {selectedEmployee && (
                <EmployeeForm 
                    initialData={selectedEmployee} 
                    isEditMode={true}
                    onSubmit={handleUpdateEmployee}
                    onCancel={handleCloseEditDialog}
                />
              )}
            </DialogContent>
          </Dialog>
    </div>
  )
}
