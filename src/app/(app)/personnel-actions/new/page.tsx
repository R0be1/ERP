
"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useMemo } from "react";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getMasterData } from "@/lib/master-data";
import { employees as initialEmployees } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const actionDetails = {
    promotion: { title: "Promotion", fields: ['newJobTitle', 'newDepartment', 'newSalary', 'justification'] },
    demotion: { title: "Demotion", fields: ['newJobTitle', 'newDepartment', 'newSalary', 'justification'] },
    acting: { title: "Acting Assignment", fields: ['actingJobTitle', 'startDate', 'endDate', 'specialDutyAllowance'] },
    transfer: { title: "Transfer", fields: ['newDepartment', 'newManager', 'justification'] },
    lateral: { title: "Lateral Transfer", fields: ['newJobTitle', 'justification'] },
    disciplinary: { title: "Disciplinary Case", fields: ['caseType', 'incidentDate', 'description', 'actionTaken'] }
};

type ActionType = keyof typeof actionDetails;

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


const PersonnelActionForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const actionType = searchParams.get('type') as ActionType | null;

    const [masterData, setMasterData] = useState(getMasterData());
    const [employees, setEmployees] = useState(initialEmployees);
    const [isClient, setIsClient] = useState(false);

    const [formState, setFormState] = useState<any>({
        employeeId: '',
        effectiveDate: ''
    });

    useEffect(() => {
        setIsClient(true);
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) setEmployees(JSON.parse(storedEmployees));

        const storedMasterData = localStorage.getItem('masterData');
        if (storedMasterData) setMasterData(JSON.parse(storedMasterData));
    }, []);

    const employeeOptions = useMemo(() => employees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.employeeId})`})), [employees]);

    const handleFormChange = (key: string, value: any) => {
        setFormState((prev: any) => ({ ...prev, [key]: value }));
    };

    if (!isClient) return <div>Loading...</div>;
    if (!actionType || !actionDetails[actionType]) {
        return <div>Invalid action type. <Link href="/personnel-actions" className="text-primary underline">Go back</Link></div>;
    }

    const { title, fields } = actionDetails[actionType];

    const renderField = (field: string) => {
        switch (field) {
            case 'newJobTitle':
            case 'actingJobTitle':
                return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>New Job Title</Label>
                        <Combobox
                            items={masterData.jobTitles}
                            value={formState[field] || ''}
                            onChange={(value) => handleFormChange(field, value)}
                            placeholder="Select new job title..."
                        />
                    </div>
                );
            case 'newDepartment':
                 return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>New Department</Label>
                         <Combobox
                            items={masterData.departments}
                            value={formState[field] || ''}
                            onChange={(value) => handleFormChange(field, value)}
                            placeholder="Select new department..."
                        />
                    </div>
                );
            case 'newSalary':
                 return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>New Basic Salary</Label>
                        <Input id={field} type="number" value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
            case 'justification':
                return (
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor={field}>Justification / Reason</Label>
                        <Textarea id={field} value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
            case 'startDate':
                 return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>Start Date</Label>
                        <Input id={field} type="date" value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
            case 'endDate':
                 return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>End Date</Label>
                        <Input id={field} type="date" value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
            case 'specialDutyAllowance':
                return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>Special Duty Allowance</Label>
                        <Input id={field} type="number" value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
             case 'newManager':
                return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>New Manager</Label>
                         <Combobox
                            items={employeeOptions}
                            value={formState[field] || ''}
                            onChange={(value) => handleFormChange(field, value)}
                            placeholder="Select new manager..."
                        />
                    </div>
                );
            case 'caseType':
                return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>Case Type</Label>
                         <Select onValueChange={(value) => handleFormChange(field, value)} value={formState[field] || ''}>
                            <SelectTrigger id={field}><SelectValue placeholder="Select case type..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="verbal_warning">Verbal Warning</SelectItem>
                                <SelectItem value="written_warning">Written Warning</SelectItem>
                                <SelectItem value="suspension">Suspension</SelectItem>
                                <SelectItem value="termination">Termination</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                );
            case 'incidentDate':
                 return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>Incident Date</Label>
                        <Input id={field} type="date" value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
            case 'description':
                 return (
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor={field}>Description of Incident</Label>
                        <Textarea id={field} value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
            case 'actionTaken':
                 return (
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor={field}>Action Taken</Label>
                        <Textarea id={field} value={formState[field] || ''} onChange={(e) => handleFormChange(field, e.target.value)} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
         <div className="flex flex-col gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/personnel-actions')} className="w-fit">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Personnel Actions
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>New {title} Action</CardTitle>
                    <CardDescription>Complete the form to initiate the {title.toLowerCase()} process.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg">Core Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="employeeId">Employee</Label>
                                    <Combobox
                                        items={employeeOptions}
                                        value={formState.employeeId || ''}
                                        onChange={(value) => handleFormChange('employeeId', value)}
                                        placeholder="Select employee..."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="effectiveDate">Effective Date</Label>
                                    <Input id="effectiveDate" type="date" value={formState.effectiveDate} onChange={e => handleFormChange('effectiveDate', e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                             <CardHeader>
                                <CardTitle className="text-lg">{title} Details</CardTitle>
                            </CardHeader>
                             <CardContent className="grid md:grid-cols-2 gap-4">
                                {fields.map(field => (
                                    <div key={field} className={['justification', 'description', 'actionTaken'].includes(field) ? 'md:col-span-2' : ''}>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        
                    </div>
                     <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => router.push('/personnel-actions')}>Cancel</Button>
                        <Button>Submit Action</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function NewPersonnelActionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PersonnelActionForm />
        </Suspense>
    )
}
