

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
import { useToast } from "@/hooks/use-toast";

const actionDetails = {
    promotion: { title: "Promotion", fields: ['effectiveDate', 'newDepartment', 'newJobTitle', 'newSalary', 'justification'] },
    demotion: { title: "Demotion", fields: ['effectiveDate', 'newDepartment', 'newJobTitle', 'newSalary', 'justification'] },
    acting: { title: "Acting Assignment", fields: ['effectiveDate', 'newDepartment', 'actingJobTitle', 'startDate', 'endDate', 'specialDutyAllowance'] },
    transfer: { title: "Transfer", fields: ['effectiveDate', 'newDepartment', 'newManager', 'justification'] },
    lateral: { title: "Lateral Transfer", fields: ['effectiveDate', 'newJobTitle', 'newDepartment', 'newManager', 'justification'] },
    disciplinary: { title: "Disciplinary Case", fields: ['effectiveDate', 'caseType', 'incidentDate', 'description', 'actionTaken'] }
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
    const { toast } = useToast();
    const actionType = searchParams.get('type') as ActionType | null;
    const actionId = searchParams.get('edit');

    const [masterData, setMasterData] = useState(getMasterData());
    const [employees, setEmployees] = useState(initialEmployees);
    const [isClient, setIsClient] = useState(false);

    const [formState, setFormState] = useState<any>({
        employeeId: '',
    });

    const [currentEmployee, setCurrentEmployee] = useState<any | null>(null);

    useEffect(() => {
        setIsClient(true);
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) setEmployees(JSON.parse(storedEmployees));

        const storedMasterData = localStorage.getItem('masterData');
        if (storedMasterData) setMasterData(JSON.parse(storedMasterData));
        
        if (actionId) {
            const storedActions = localStorage.getItem('personnelActions');
            const personnelActions = storedActions ? JSON.parse(storedActions) : [];
            const actionToEdit = personnelActions.find((a:any) => a.id === actionId);
            if(actionToEdit) {
                setFormState({ ...actionToEdit.details, employeeId: actionToEdit.employeeId });
            }
        }
    }, [actionId]);

     useEffect(() => {
        if (formState.employeeId && employees.length > 0) {
            const employee = employees.find(e => e.id === formState.employeeId);
            setCurrentEmployee(employee || null);
        } else {
            setCurrentEmployee(null);
        }
    }, [formState.employeeId, employees]);

    const employeeOptions = useMemo(() => employees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.employeeId})`})), [employees]);
    
    const newJobTitleDetails = useMemo(() => {
        const fieldName = actionType === 'acting' ? 'actingJobTitle' : 'newJobTitle';
        if (!actionType || !formState[fieldName]) return null;
        return masterData.jobTitles.find(jt => jt.value === formState[fieldName]);
    }, [actionType, formState, masterData.jobTitles]);

    const newSalaryStructure = useMemo(() => {
        if (!newJobTitleDetails) return null;
        return masterData.salaryStructures.find(s => s.jobGrade === newJobTitleDetails.jobGrade && s.status === 'active');
    }, [newJobTitleDetails, masterData.salaryStructures]);

    const handleFormChange = (key: string, value: any) => {
        setFormState((prev: any) => {
            const newState = { ...prev, [key]: value };
            
            if ((actionType === 'transfer' || actionType === 'lateral') && key === 'newDepartment') {
                const departmentValue = value;
                const headOfDepartmentTitle = masterData.jobTitles.find(jt => 
                    jt.isHeadOfDepartment && 
                    (jt.managedDepartments || []).includes(departmentValue)
                );
                
                if (headOfDepartmentTitle) {
                    const manager = employees.find(emp => emp.position === headOfDepartmentTitle.label);
                    if (manager && manager.id !== newState.employeeId) {
                        newState.newManager = manager.id;
                    } else {
                        newState.newManager = '';
                    }
                } else {
                    newState.newManager = '';
                }
            }

            if ((actionType === 'demotion' || actionType === 'promotion' || actionType === 'lateral') && key === 'newJobTitle') {
                newState.newSalary = '';
            }

            return newState;
        });
    };

    const handleSubmit = () => {
        if (!actionType || !formState.employeeId || !formState.effectiveDate) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please select an employee and set an effective date.",
            });
            return;
        }

        const storedActions = localStorage.getItem('personnelActions');
        const personnelActions = storedActions ? JSON.parse(storedActions) : [];
        
        const selectedEmployee = employees.find(e => e.id === formState.employeeId);
        
        const details = { ...formState };
        delete details.employeeId;
        
        if (actionId) {
            // Editing existing action
             const updatedActions = personnelActions.map((action: any) => {
                if (action.id === actionId) {
                    return {
                        ...action,
                        employeeId: formState.employeeId,
                        employeeName: selectedEmployee?.name || 'Unknown',
                        effectiveDate: details.effectiveDate,
                        details: details,
                    }
                }
                return action;
             });
             localStorage.setItem('personnelActions', JSON.stringify(updatedActions));
             toast({
                title: "Action Updated",
                description: "The pending personnel action has been updated.",
            });

        } else {
             // Creating new action
            const newAction = {
                id: `PA${Date.now()}`,
                employeeId: formState.employeeId,
                employeeName: selectedEmployee?.name || 'Unknown',
                type: actionDetails[actionType as ActionType].title,
                effectiveDate: details.effectiveDate,
                status: 'Pending',
                details: details
            };

            const updatedActions = [...personnelActions, newAction];
            localStorage.setItem('personnelActions', JSON.stringify(updatedActions));
            
            toast({
                title: "Action Submitted",
                description: "The personnel action has been submitted and is pending approval.",
            });
        }

        router.push('/personnel-actions');
    };

    if (!isClient) return <div>Loading...</div>;
    if (!actionType || !actionDetails[actionType]) {
        return <div>Invalid action type. <button onClick={() => router.push('/personnel-actions')} className="text-primary underline">Go back</button></div>;
    }

    const { title, fields } = actionDetails[actionType];

    const renderField = (field: string) => {
        switch (field) {
            case 'effectiveDate':
                return (
                    <div className="grid gap-2">
                        <Label htmlFor={field}>Effective Date</Label>
                        <Input id={field} type="date" value={formState.effectiveDate || ''} onChange={e => handleFormChange('effectiveDate', e.target.value)} />
                    </div>
                );
            case 'newJobTitle':
            case 'actingJobTitle':
                const isDemotion = actionType === 'demotion';
                const isLateral = actionType === 'lateral';
                const isActing = actionType === 'acting';
                const isPromotion = actionType === 'promotion';
                return (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor={field}>{field === 'actingJobTitle' ? 'Acting Job Title' : 'New Job Title'}</Label>
                            <Combobox
                                items={masterData.jobTitles}
                                value={formState[field] || ''}
                                onChange={(value) => handleFormChange(field, value)}
                                placeholder="Select new job title..."
                            />
                        </div>
                        {(isLateral || isDemotion || isActing || isPromotion) && newJobTitleDetails && (
                            <>
                                <div className="grid gap-2">
                                    <Label>New Job Grade</Label>
                                    <Input value={masterData.jobGrades.find(g => g.value === newJobTitleDetails.jobGrade)?.label || ''} readOnly />
                                </div>
                                <div className="grid gap-2">
                                    <Label>New Job Category</Label>
                                    <Input value={masterData.jobCategories.find(c => c.value === newJobTitleDetails.jobCategory)?.label || ''} readOnly />
                                </div>
                            </>
                        )}
                    </>
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
                        <Select
                            name="newSalary"
                            onValueChange={(v) => handleFormChange('newSalary', v)}
                            value={formState.newSalary || ''}
                            disabled={!newSalaryStructure}
                        >
                            <SelectTrigger id="newSalary">
                                <SelectValue placeholder={!newSalaryStructure ? "Select job title first" : "Select salary step..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {newSalaryStructure?.steps.map((step: any) => (
                                    <SelectItem key={step.step} value={step.salary}>
                                        Step {step.step}: {Number(step.salary).toLocaleString()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            items={employeeOptions.filter(opt => opt.value !== formState.employeeId)}
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
                    <CardTitle>{actionId ? `Edit ${title} Action` : `New ${title} Action`}</CardTitle>
                    <CardDescription>Complete the form to {actionId ? 'update' : 'initiate'} the {title.toLowerCase()} process.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-lg">Core Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="employeeId">Employee</Label>
                                    <Combobox
                                        items={employeeOptions}
                                        value={formState.employeeId || ''}
                                        onChange={(value) => handleFormChange('employeeId', value)}
                                        placeholder="Select employee..."
                                    />
                                </div>
                                {currentEmployee && (
                                    <>
                                        {(actionType === 'transfer' || actionType === 'acting') && (
                                            <div className="grid gap-2">
                                                <Label>Current Department</Label>
                                                <Input value={currentEmployee.department || ''} readOnly />
                                            </div>
                                        )}
                                        {(actionType === 'lateral' || actionType === 'demotion' || actionType === 'acting' || actionType === 'promotion') && (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label>Current Job Title</Label>
                                                    <Input value={currentEmployee.position || ''} readOnly />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Current Job Grade</Label>
                                                    <Input value={currentEmployee.jobGrade || ''} readOnly />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Current Job Category</Label>
                                                    <Input value={currentEmployee.jobCategory || ''} readOnly />
                                                </div>
                                            </>
                                        )}
                                        {(actionType === 'demotion' || actionType === 'acting' || actionType === 'promotion') && (
                                             <div className="grid gap-2">
                                                <Label>Current Basic Salary</Label>
                                                <Input value={currentEmployee.basicSalary || ''} readOnly />
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                             <CardHeader>
                                <CardTitle className="text-lg">{title} Details</CardTitle>
                            </CardHeader>
                             <CardContent className="grid md:grid-cols-2 gap-4">
                                {fields.map(field => {
                                    const isFullWidth = ['justification', 'description', 'actionTaken'].includes(field);
                                    const isCombinedDetails = (actionType === 'lateral' || actionType === 'demotion' || actionType === 'acting' || actionType === 'promotion') && (field === 'newJobTitle' || field === 'actingJobTitle');

                                    return (
                                        <div key={field} className={cn(isFullWidth ? 'md:col-span-2' : '', isCombinedDetails ? 'md:col-span-2 grid md:grid-cols-3 gap-4' : '')}>
                                            {renderField(field)}
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                        
                    </div>
                     <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => router.push('/personnel-actions')}>Cancel</Button>
                        <Button onClick={handleSubmit}>Submit Action</Button>
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
