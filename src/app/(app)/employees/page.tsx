

"use client"

import { MoreHorizontal, PlusCircle, Search, Trash2, Check, ChevronsUpDown, Edit, List, LayoutGrid, Info } from "lucide-react"
import { useState, useEffect, useCallback, useMemo } from "react"
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
import { masterData as initialMasterData } from "@/lib/master-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  spouseFullName: '',
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
  jobCategory: '',
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
  currency: 'ETB',
  bankName: '',
  accountNumber: '',
  taxId: '',
  pensionNumber: '',
  entitledAllowances: [],
  // History & Development
  dependents: [{ name: '', relationship: '', dob: '' }],
  internalExperience: [{ title: '', department: '', startDate: '', endDate: '', managerialRole: false }],
  externalExperience: [{ company: '', title: '', startDate: '', endDate: '', managerialRole: false }],
  education: [{ award: '', institution: '', fieldOfStudy: '', completionDate: '', programType: '', cgpa: '', result: '' }],
  training: [{ name: '', provider: '', completionDate: '', file: null }],
  // Guarantees
  incomingGuarantees: [{ guarantorName: '', relationship: '', organization: '', organizationPhone: '', guarantorPhone: '', issueDate: '', document: null }],
  outgoingGuarantees: [{ recipientName: '', recipientPhone: '', relationship: '', organization: '', organizationPhone: '', poBox: '', amount: '', issueDate: '', expiryDate: '', document: null }],
};

type Employee = (typeof initialEmployees)[number];
type FormEmployeeState = typeof initialNewEmployeeState;

const Combobox = ({ items, value, onChange, placeholder }: { items: {value: string, label: string}[], value: string, onChange: (value: string) => void, placeholder: string }) => {
    const [open, setOpen] = useState(false)
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
            >
                {value
                ? items.find((item) => item.value === value)?.label
                : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
                <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                    {items.map((item) => (
                        <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(currentValue) => {
                            onChange(currentValue === value ? "" : currentValue)
                            setOpen(false)
                        }}
                        >
                        <Check
                            className={cn(
                            "mr-2 h-4 w-4",
                            value === item.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {item.label}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
            </Command>
            </PopoverContent>
        </Popover>
    )
}

const EmployeeForm = ({ initialData: initialDataProp, isEditMode = false, onSubmit, onCancel, masterData, allEmployees }: { initialData: FormEmployeeState, isEditMode?: boolean, onSubmit: (employeeData: FormEmployeeState, photo: string | null) => void, onCancel: () => void, masterData: typeof initialMasterData, allEmployees: Employee[] }) => {
    const [employeeData, setEmployeeData] = useState(initialDataProp);
    const [photoPreview, setPhotoPreview] = useState<string | null>(isEditMode ? (initialDataProp as any).avatar : null);
    
    useEffect(() => {
        setEmployeeData(initialDataProp);
        setPhotoPreview(isEditMode ? (initialDataProp as any).avatar : null);
    }, [initialDataProp, isEditMode]);

     const calculateEntitledAllowances = useCallback((jobGrade?: string, department?: string, position?: string) => {
        if (!jobGrade || !department || !position) return [];

        const applicableRules = new Map<string, any>();

        const allRules = masterData.allowanceRules || [];

        // Grade-based rules (highest priority)
        const gradeRules = allRules.filter(r => r.ruleType === 'grade' && r.jobGrade === jobGrade);
        gradeRules.forEach(rule => {
            const positionSpecific = (rule.positions || []).find((p: any) => p.jobTitle === position);
            if (positionSpecific) {
                applicableRules.set(rule.allowanceType, { ...rule, value: positionSpecific.value });
            } else if ((!rule.jobTitles || rule.jobTitles.length === 0 || rule.jobTitles.includes(position))) {
                 if (!applicableRules.has(rule.allowanceType)) {
                    applicableRules.set(rule.allowanceType, rule);
                 }
            }
        });

        // Department-based rules (lower priority)
        const departmentRules = allRules.filter(r => r.ruleType === 'department' && (r.departments || []).includes(department));
        departmentRules.forEach(rule => {
            if (!applicableRules.has(rule.allowanceType)) { // Only apply if no grade rule exists
                if ((rule.jobTitles || []).includes(position)) {
                     const positionSpecific = (rule.positions || []).find((p: any) => p.jobTitle === position);
                     if(positionSpecific) {
                        applicableRules.set(rule.allowanceType, { ...rule, value: positionSpecific.value });
                     } else {
                        applicableRules.set(rule.allowanceType, rule);
                     }
                }
            }
        });

        return Array.from(applicableRules.values()).map(rule => ({
            type: masterData.allowanceTypes.find((t: any) => t.value === rule.allowanceType)?.label,
            value: rule.value,
            basis: rule.basis,
            isTaxable: rule.isTaxable
        }));
    }, [masterData.allowanceRules, masterData.allowanceTypes]);

    const handleSelectChange = useCallback((name: string, value: string) => {
        setEmployeeData(prevState => {
            let newState = { ...prevState };
             if (name.startsWith('address.')) {
                const addressField = name.split('.')[1];
                newState.address = { ...newState.address, [addressField]: value };
            } else {
                newState[name as keyof typeof newState] = value;
            }

            // Auto-populate Job Grade, Category, Salary, Manager, and Allowances
            if (name === 'position' || name === 'department' || name === 'jobGrade') {
                if (name === 'position') {
                    const selectedJobTitle = masterData.jobTitles.find(jt => jt.value === value);
                    if (selectedJobTitle) {
                        newState.jobGrade = selectedJobTitle.jobGrade;
                        newState.jobCategory = selectedJobTitle.jobCategory;
                    }
                }
                
                // Salary
                if (newState.jobGrade) {
                    const structure = masterData.salaryStructures.find(s => s.jobGrade === newState.jobGrade && s.status === 'active');
                    if (structure && structure.steps.length > 0) {
                        // When grade changes, reset salary if it's not in the new steps or not set
                        const newSalaryStepExists = structure.steps.some((s:any) => s.salary === newState.basicSalary);
                        if (!newState.basicSalary || !newSalaryStepExists) {
                           newState.basicSalary = '';
                        }
                    } else {
                        newState.basicSalary = ''; // Reset if no structure found
                    }
                }

                // Manager
                if (newState.department) {
                    const findManagerForDepartment = (deptValue: string) => {
                        const managerialJobTitle = masterData.jobTitles.find(jt =>
                            jt.isHeadOfDepartment &&
                            jt.managedDepartments &&
                            jt.managedDepartments.includes(deptValue)
                        );
                        return managerialJobTitle ? allEmployees.find(emp => emp.position === managerialJobTitle.label) || null : null;
                    };
                    
                    const currentJobTitle = masterData.jobTitles.find(jt => jt.value === newState.position);
                    let managerToSet = null;

                    if (currentJobTitle?.isHeadOfDepartment) {
                        const currentDept = masterData.departments.find(d => d.value === newState.department);
                        if (currentDept?.parent) managerToSet = findManagerForDepartment(currentDept.parent);
                    } else {
                        managerToSet = findManagerForDepartment(newState.department);
                    }
                    
                    const currentEmployeeName = `${newState.title} ${newState.firstName} ${newState.lastName}`.trim();
                    newState.manager = (managerToSet && managerToSet.name !== currentEmployeeName) ? managerToSet.name : '';
                }

                // Allowances
                if (newState.jobGrade && newState.department && newState.position) {
                    newState.entitledAllowances = calculateEntitledAllowances(newState.jobGrade, newState.department, newState.position) as any;
                }
            }
             if (name === 'jobGrade') {
                newState.basicSalary = ''; // Reset salary when grade changes directly
            }

            return newState;
        });
    }, [masterData, allEmployees, calculateEntitledAllowances]);
    
    useEffect(() => {
        if (employeeData.maritalStatus === 'married') {
            const hasSpouse = employeeData.dependents.some(dep => dep.relationship === 'Spouse');
            if (employeeData.spouseFullName && !hasSpouse) {
                setEmployeeData(prev => ({
                    ...prev,
                    dependents: [...prev.dependents, { name: prev.spouseFullName, relationship: 'Spouse', dob: '' }]
                }));
            } else if (employeeData.spouseFullName && hasSpouse) {
                 setEmployeeData(prev => ({
                    ...prev,
                    dependents: prev.dependents.map(dep => dep.relationship === 'Spouse' ? { ...dep, name: prev.spouseFullName } : dep)
                }));
            }
        } else {
             const hasSpouse = employeeData.dependents.some(dep => dep.relationship === 'Spouse');
             if(hasSpouse) {
                setEmployeeData(prev => ({
                    ...prev,
                    spouseFullName: '',
                    dependents: prev.dependents.filter(dep => dep.relationship !== 'Spouse')
                }));
             }
        }
    }, [employeeData.maritalStatus, employeeData.spouseFullName]);

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
    
    const handleNestedCheckboxChange = useCallback((section: keyof FormEmployeeState, index: number, name: string, checked: boolean) => {
        setEmployeeData(prevState => {
            const list = prevState[section] as any[];
            const updatedList = [...list];
            updatedList[index] = { ...updatedList[index], [name]: checked };
            return { ...prevState, [section]: updatedList };
        });
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

    const handleNestedSelectChange = useCallback((section: keyof FormEmployeeState, index: number, name: string, value: string) => {
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
            case 'internalExperience': newItem = { title: '', department: '', startDate: '', endDate: '', managerialRole: false }; break;
            case 'externalExperience': newItem = { company: '', title: '', startDate: '', endDate: '', managerialRole: false }; break;
            case 'education': newItem = { award: '', institution: '', fieldOfStudy: '', completionDate: '', programType: '', cgpa: '', result: '' }; break;
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
    
    const salaryStructure = useMemo(() => {
        return masterData.salaryStructures.find(s => s.jobGrade === employeeData.jobGrade && s.status === 'active');
    }, [employeeData.jobGrade, masterData.salaryStructures]);
    
    return (
       <>
        <Tabs defaultValue="personal-job">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal-job">Personal &amp; Job</TabsTrigger>
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
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="widowed">Widowed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {employeeData.maritalStatus === 'married' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="spouseFullName">Spouse Full Name</Label>
                                    <Input id="spouseFullName" name="spouseFullName" value={employeeData.spouseFullName} onChange={handleInputChange} />
                                </div>
                            )}
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
                            <CardTitle>Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Department</Label>
                                <Combobox
                                    items={masterData.departments}
                                    value={employeeData.department}
                                    onChange={(value) => handleSelectChange('department', value)}
                                    placeholder="Select department..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Job Title</Label>
                                 <Combobox
                                    items={masterData.jobTitles}
                                    value={employeeData.position}
                                    onChange={(value) => handleSelectChange('position', value)}
                                    placeholder="Select job title..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="manager">Manager</Label>
                                <Input id="manager" name="manager" value={employeeData.manager} onChange={handleInputChange} readOnly />
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
                                <Label>Job Grade</Label>
                                <Input value={masterData.jobGrades.find(g => g.value === employeeData.jobGrade)?.label || ''} readOnly />
                            </div>
                            <div className="grid gap-2">
                                <Label>Job Category</Label>
                                <Input value={masterData.jobCategories.find(c => c.value === employeeData.jobCategory)?.label || ''} readOnly />
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
                                <Label>Region</Label>
                                <Combobox
                                    items={masterData.regions}
                                    value={employeeData.address.region}
                                    onChange={(value) => handleSelectChange('address.region', value)}
                                    placeholder="Select region..."
                                />
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
                            <CardTitle>Contract &amp; Salary</CardTitle>
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
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="basicSalary">Basic Salary</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-3 w-3 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Auto-populated from salary structure based on Job Grade.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <Select
                                    name="basicSalary"
                                    onValueChange={(v) => handleSelectChange('basicSalary', v)}
                                    value={employeeData.basicSalary}
                                    disabled={!salaryStructure}
                                >
                                    <SelectTrigger id="basicSalary">
                                        <SelectValue placeholder={!salaryStructure ? "Select job grade first" : "Select salary step..."} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salaryStructure?.steps.map((step: any) => (
                                            <SelectItem key={step.step} value={step.salary}>
                                                Step {step.step}: {Number(step.salary).toLocaleString()} {employeeData.currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                            <div className="flex items-center gap-2">
                                <CardTitle>Allowance Details</CardTitle>
                                 <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-3 w-3 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Allowances are auto-populated based on Job Grade and Department rules.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <CardDescription>Entitled allowances based on configured rules.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {(employeeData.entitledAllowances && employeeData.entitledAllowances.length > 0) ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Allowance Type</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Taxable</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employeeData.entitledAllowances.map((allowance: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{allowance.type}</TableCell>
                                            <TableCell>
                                                {allowance.basis === 'percentage' 
                                                    ? `${allowance.value}%` 
                                                    : `${Number(allowance.value).toLocaleString()} ${employeeData.currency}`
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={allowance.isTaxable ? "destructive" : "secondary"}>
                                                    {allowance.isTaxable ? 'Yes' : 'No'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                           ) : (
                                <p className="text-sm text-muted-foreground">No allowances applicable based on current Job and Department.</p>
                           )}
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
                                        <div className="flex items-center space-x-2 pt-2 md:col-span-2">
                                            <Checkbox id={`int-managerial-${index}`} checked={exp.managerialRole} onCheckedChange={(checked) => handleNestedCheckboxChange('internalExperience', index, 'managerialRole', !!checked)} />
                                            <Label htmlFor={`int-managerial-${index}`}>Managerial Role</Label>
                                        </div>
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
                                     <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox id={`ext-managerial-${index}`} checked={exp.managerialRole} onCheckedChange={(checked) => handleNestedCheckboxChange('externalExperience', index, 'managerialRole', !!checked)} />
                                        <Label htmlFor={`ext-managerial-${index}`}>Managerial Role</Label>
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
                                <div key={index} className="grid gap-4 p-4 border rounded-md relative">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Award</Label>
                                            <Combobox 
                                                items={masterData.educationAwards}
                                                value={edu.award}
                                                onChange={(value) => handleNestedSelectChange('education', index, 'award', value)}
                                                placeholder="Select award..."
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Field of Study</Label>
                                            <Combobox 
                                                items={masterData.fieldsOfStudy}
                                                value={edu.fieldOfStudy}
                                                onChange={(value) => handleNestedSelectChange('education', index, 'fieldOfStudy', value)}
                                                placeholder="Select field..."
                                            />
                                        </div>
                                         <div className="grid gap-2">
                                            <Label>Institution</Label>
                                             <Combobox 
                                                items={masterData.institutions}
                                                value={edu.institution}
                                                onChange={(value) => handleNestedSelectChange('education', index, 'institution', value)}
                                                placeholder="Select institution..."
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`edu-programType-${index}`}>Program Type</Label>
                                            <Select
                                                name="programType"
                                                onValueChange={(v) => handleNestedSelectChange('education', index, 'programType', v)}
                                                value={edu.programType}
                                            >
                                                <SelectTrigger id={`edu-programType-${index}`}><SelectValue placeholder="Select..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="regular">Regular</SelectItem>
                                                    <SelectItem value="weekend">Weekend</SelectItem>
                                                    <SelectItem value="distance">Distance</SelectItem>
                                                    <SelectItem value="extension">Extension</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`edu-cgpa-${index}`}>CGPA</Label>
                                            <Input id={`edu-cgpa-${index}`} name="cgpa" type="number" step="0.01" min="0" max="4" value={edu.cgpa} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                        </div>
                                        {edu.award === 'diploma' && (
                                            <div className="grid gap-2">
                                                <Label htmlFor={`edu-result-${index}`}>Result</Label>
                                                <Input id={`edu-result-${index}`} name="result" value={edu.result} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label htmlFor={`edu-completionDate-${index}`}>Completion Date</Label>
                                            <Input id={`edu-completionDate-${index}`} name="completionDate" type="date" value={edu.completionDate} onChange={(e) => handleNestedInputChange('education', index, e)} />
                                        </div>
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
                                <CardTitle>Training &amp; Certificates</CardTitle>
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
  const [masterData, setMasterData] = useState(initialMasterData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<FormEmployeeState | null>(null);
  const [isEditEmployeeDialogOpen, setEditEmployeeDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const loadData = useCallback(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
        try {
            setEmployees(JSON.parse(storedEmployees));
        } catch(e) {
            console.error("Failed to parse employees from localStorage", e);
            setEmployees(initialEmployees);
        }
    }
    const storedMasterData = localStorage.getItem('masterData');
    if (storedMasterData) {
        try {
            setMasterData(JSON.parse(storedMasterData));
        } catch(e) {
            console.error("Failed to parse master data from localStorage", e);
            setMasterData(initialMasterData);
        }
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'employees' || event.key === 'masterData') {
            loadData();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadData]);

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
        localStorage.setItem('employees', JSON.stringify(employees));
    }
  }, [employees]);


  const handleOpenEditDialog = useCallback((employee: Employee) => {
      const employeeDataForEdit = JSON.parse(JSON.stringify(employee));
      
      // Ensure all fields from the initial state are present, especially nested ones.
      const fullEmployeeData = {
        ...initialNewEmployeeState,
        ...employeeDataForEdit,
        address: { ...initialNewEmployeeState.address, ...employeeDataForEdit.address },
        emergencyContacts: employeeDataForEdit.emergencyContacts?.length ? employeeDataForEdit.emergencyContacts : initialNewEmployeeState.emergencyContacts,
        dependents: employeeDataForEdit.dependents?.length ? employeeDataForEdit.dependents : initialNewEmployeeState.dependents,
        internalExperience: employeeDataForEdit.internalExperience?.length ? employeeDataForEdit.internalExperience : [{ title: '', department: '', startDate: '', endDate: '', managerialRole: false }],
        externalExperience: employeeDataForEdit.externalExperience?.length ? employeeDataForEdit.externalExperience : initialNewEmployeeState.externalExperience,
        education: employeeDataForEdit.education?.length ? employeeDataForEdit.education : initialNewEmployeeState.education,
        training: employeeDataForEdit.training?.length ? employeeDataForEdit.training : initialNewEmployeeState.training,
        incomingGuarantees: employeeDataForEdit.incomingGuarantees?.length ? employeeDataForEdit.incomingGuarantees : initialNewEmployeeState.incomingGuarantees,
        outgoingGuarantees: employeeDataForEdit.outgoingGuarantees?.length ? employeeDataForEdit.outgoingGuarantees : initialNewEmployeeState.outgoingGuarantees,
      };

      setSelectedEmployee(fullEmployeeData);
      setEditEmployeeDialogOpen(true);
  }, []);

  useEffect(() => {
    const editEmployeeId = searchParams.get('edit');
    if (editEmployeeId) {
        const employeeToEdit = employees.find(emp => emp.id === editEmployeeId);
        if (employeeToEdit) {
            handleOpenEditDialog(employeeToEdit as any);
        }
        // Clean up the URL query param
        const newUrl = window.location.pathname;
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  }, [searchParams, employees, handleOpenEditDialog]);

  const handleAddEmployee = (employeeData: FormEmployeeState, photo: string | null) => {
    
    const jobTitleLabel = masterData.jobTitles.find(j => j.value === employeeData.position)?.label || employeeData.position;
    const departmentLabel = masterData.departments.find(d => d.value === employeeData.department)?.label || employeeData.department;
    const jobCategory = masterData.jobCategories.find(c => c.value === employeeData.jobCategory)

    const initialExperience = {
        title: jobTitleLabel,
        department: departmentLabel,
        startDate: employeeData.joinDate,
        endDate: '',
        managerialRole: jobCategory?.label === 'Managerial'
    };
      
    const newEmp: Employee = {
      ...({} as Employee),
      ...(employeeData as any),
      id: employeeData.employeeId || `EMP${String(Date.now()).slice(-4)}`,
      name: `${employeeData.title} ${employeeData.firstName} ${employeeData.lastName}`,
      email: employeeData.workEmail,
      position: jobTitleLabel,
      department: departmentLabel,
      jobCategory: jobCategory?.label || employeeData.jobCategory,
      status: 'Active',
      avatar: photo || `https://placehold.co/40x40.png?text=${employeeData.firstName[0]}${employeeData.lastName[0]}`,
      internalExperience: [initialExperience],
    };
    setEmployees(prev => [...prev, newEmp]);
    setAddEmployeeDialogOpen(false);
  };
  
  const handleUpdateEmployee = (employeeData: FormEmployeeState, photo: string | null) => {
    if (!selectedEmployee) return;

    setEmployees(prev => 
        prev.map(emp => {
            if (emp.id === (selectedEmployee as any).id) {
                return {
                    ...(emp as any),
                    ...employeeData,
                    name: `${employeeData.title} ${employeeData.firstName} ${employeeData.lastName}`,
                    email: employeeData.workEmail,
                    position: masterData.jobTitles.find(j => j.value === employeeData.position)?.label || employeeData.position,
                    department: masterData.departments.find(d => d.value === employeeData.department)?.label || employeeData.department,
                    jobCategory: masterData.jobCategories.find(c => c.value === employeeData.jobCategory)?.label || employeeData.jobCategory,
                    avatar: photo || (emp as any).avatar,
                };
            }
            return emp;
        })
    );
    handleCloseEditDialog();
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
    (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.department || '').toLowerCase().includes(searchTerm.toLowerCase())
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
              <Button size="sm" onClick={() => setAddEmployeeDialogOpen(true)}>
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
                masterData={masterData}
                allEmployees={employees}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>
                Manage your employees and view their information.
              </CardDescription>
            </div>
             <div className="flex items-center gap-2">
                <Button variant={viewMode === 'table' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('table')}>
                    <List className="h-4 w-4" />
                    <span className="sr-only">Table View</span>
                </Button>
                <Button variant={viewMode === 'card' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('card')}>
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Card View</span>
                </Button>
            </div>
          </div>
          <div className="relative mt-4">
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
          {viewMode === 'table' ? (
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
                           <AvatarFallback>{(employee.name || '').split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
          ) : (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEmployees.map((employee) => (
                <Card 
                  key={employee.id} 
                  className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/employees/${employee.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar} alt="Avatar" data-ai-hint="person portrait" />
                        <AvatarFallback>{(employee.name || '').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
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
                    </div>
                     <CardTitle className="mt-4">{employee.name}</CardTitle>
                    <CardDescription>{employee.position}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="text-sm text-muted-foreground grid gap-2">
                        <p>{employee.department}</p>
                        <p>{employee.email}</p>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <Badge variant={employee.status === "Active" ? "secondary" : employee.status === 'On Leave' ? 'outline' : 'destructive'}>
                        {employee.status}
                      </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{filteredEmployees.length > 10 ? 10 : filteredEmployees.length}</strong> of <strong>{filteredEmployees.length}</strong> employees
          </div>
        </CardFooter>
      </Card>
      
       <Dialog open={isEditEmployeeDialogOpen} onOpenChange={handleCloseEditDialog}>
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
                    masterData={masterData}
                    allEmployees={employees}
                />
              )}
            </DialogContent>
          </Dialog>
    </div>
  )
}
