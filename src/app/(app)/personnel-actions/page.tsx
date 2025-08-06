

"use client"

import { useState, useEffect, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, UserCheck, Shuffle, Copy, AlertTriangle, MoreHorizontal, Check, X, Trash2, View, Edit, Search, Download, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog";
import { getMasterData } from '@/lib/master-data';
import { useToast } from "@/hooks/use-toast";
import { employees as initialEmployeesList } from "@/lib/data";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import jsPDF from "jspdf";
import { format, subDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const actionTypes = [
    {
        title: "Promotion",
        description: "Promote an employee to a higher position.",
        icon: ArrowUpRight,
        action: "promotion"
    },
    {
        title: "Demotion",
        description: "Demote an employee to a lower position.",
        icon: ArrowDownRight,
        action: "demotion"
    },
    {
        title: "Acting Assignment",
        description: "Assign an employee to an acting role.",
        icon: UserCheck,
        action: "acting"
    },
    {
        title: "Transfer",
        description: "Transfer an employee to a new department.",
        icon: Shuffle,
        action: "transfer"
    },
    {
        title: "Lateral Transfer",
        description: "Change an employee's job position laterally.",
        icon: Copy,
        action: "lateral"
    },
    {
        title: "Disciplinary Case",
        description: "Manage a disciplinary action for an employee.",
        icon: AlertTriangle,
        action: "disciplinary"
    }
];

const initialActions = [
    { id: "PA001", employeeId: "EMP001", employeeName: "Alice Johnson", type: "Promotion", effectiveDate: "2024-08-01", status: "Completed", details: { newJobTitle: 'senior-software-engineer', newSalary: '95000' } },
    { id: "PA002", employeeId: "EMP002", employeeName: "Bob Williams", type: "Transfer", effectiveDate: "2024-07-25", status: "Completed", details: { newDepartment: '005', newManager: 'Fiona Garcia' } },
    { id: "PA003", employeeId: "EMP003", employeeName: "Charlie Brown", type: "Disciplinary Case", effectiveDate: "2024-07-20", status: "Completed", details: { caseType: 'written_warning' } },
    { id: "PA004", employeeId: "EMP004", employeeName: "Diana Miller", type: "Acting Assignment", effectiveDate: "2024-09-01", status: "Pending", details: { actingJobTitle: 'hr-manager' } },
];

const InfoItem = ({ label, value }: { label: string, value: React.ReactNode }) => {
    if (!value && typeof value !== 'number' && typeof value !== 'boolean') return null;
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{String(value)}</p>
        </div>
    );
};


export default function PersonnelActionsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [personnelActions, setPersonnelActions] = useState(initialActions);
    const [employees, setEmployees] = useState(initialEmployeesList);
    const [isClient, setIsClient] = useState(false);
    const [selectedAction, setSelectedAction] = useState<any | null>(null);
    const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMemoDialogOpen, setMemoDialogOpen] = useState(false);
    const [memoContent, setMemoContent] = useState('');
    
    const masterData = useMemo(() => getMasterData(), []);

    useEffect(() => {
        setIsClient(true);
        const storedActions = localStorage.getItem('personnelActions');
        const storedEmployees = localStorage.getItem('employees');

        if (storedActions) {
            try {
                setPersonnelActions(JSON.parse(storedActions));
            } catch (e) {
                console.error("Failed to parse actions from localStorage", e);
                localStorage.setItem('personnelActions', JSON.stringify(initialActions));
            }
        } else {
             localStorage.setItem('personnelActions', JSON.stringify(initialActions));
        }

        if (storedEmployees) {
            try {
                setEmployees(JSON.parse(storedEmployees));
            } catch(e) {
                console.error("Failed to parse employees from localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('personnelActions', JSON.stringify(personnelActions));
        }
    }, [personnelActions, isClient]);

    const handleActionClick = (action: string) => {
        router.push(`/personnel-actions/new?type=${action}`);
    };
    
    const applyAction = (action: any) => {
        let allEmployees = [...employees];
        const employeeIndex = allEmployees.findIndex((emp: any) => emp.id === action.employeeId);

        if (employeeIndex === -1) {
            toast({ variant: "destructive", title: "Error", description: "Employee not found." });
            return;
        }
        
        let updatedEmployee = { ...allEmployees[employeeIndex] };
        const { details, type, effectiveDate } = action;

        if (!Array.isArray(updatedEmployee.internalExperience)) {
            updatedEmployee.internalExperience = [];
        }

        const actionsThatChangeRole = ['Promotion', 'Demotion', 'Lateral Transfer', 'Acting Assignment'];
        if (actionsThatChangeRole.includes(type)) {
            const currentExperienceIndex = updatedEmployee.internalExperience.findIndex((exp: any) => !exp.endDate || exp.endDate === 'Present' || exp.endDate === '');
            if (currentExperienceIndex > -1) {
                updatedEmployee.internalExperience[currentExperienceIndex].endDate = format(subDays(new Date(effectiveDate), 1), 'yyyy-MM-dd');
            }

            const jobTitleValue = details.newJobTitle || details.actingJobTitle;
            const jobTitle = masterData.jobTitles.find((jt:any) => jt.value === jobTitleValue);
            const departmentValue = details.newDepartment || updatedEmployee.departmentValue;
            const department = masterData.departments.find((d:any) => d.value === departmentValue);

            const baseTitle = jobTitle?.label || 'N/A';
            const finalTitle = type === 'Acting Assignment' ? `Acting ${baseTitle}` : baseTitle;

            const newExperience = {
                title: finalTitle,
                department: department?.label || updatedEmployee.department,
                startDate: effectiveDate,
                endDate: '',
                managerialRole: jobTitle?.jobCategory === 'managerial' || jobTitle?.isHeadOfDepartment
            };
            if (type === 'Acting Assignment' && details.endDate) {
                newExperience.endDate = details.endDate;
            }
            updatedEmployee.internalExperience.push(newExperience);
        }

        switch (type) {
            case 'Promotion':
            case 'Demotion':
            case 'Lateral Transfer':
                if (details.newJobTitle) {
                    const jobTitle = masterData.jobTitles.find((jt:any) => jt.value === details.newJobTitle);
                    if(jobTitle) {
                        updatedEmployee.position = jobTitle.label;
                        updatedEmployee.jobGrade = masterData.jobGrades.find((jg:any) => jg.value === jobTitle.jobGrade)?.label || jobTitle.jobGrade;
                        updatedEmployee.jobCategory = masterData.jobCategories.find((jc:any) => jc.value === jobTitle.jobCategory)?.label || jobTitle.jobCategory;
                    }
                }
                if (details.newSalary) updatedEmployee.basicSalary = details.newSalary;
                if (details.newDepartment) {
                    const department = masterData.departments.find((d:any) => d.value === details.newDepartment);
                    if(department) updatedEmployee.department = department.label;
                }
                 if (details.newManager) {
                    const manager = employees.find((e:any) => e.id === details.newManager);
                    if(manager) updatedEmployee.manager = manager.name;
                }
                break;
            case 'Transfer':
                if (details.newDepartment) {
                    const department = masterData.departments.find((d:any) => d.value === details.newDepartment);
                     if(department) updatedEmployee.department = department.label;
                }
                if (details.newManager) {
                    const manager = employees.find((e:any) => e.id === details.newManager);
                    if(manager) updatedEmployee.manager = manager.name;
                }
                break;
            case 'Acting Assignment':
                 if (details.actingJobTitle) {
                    const jobTitle = masterData.jobTitles.find((jt: any) => jt.value === details.actingJobTitle);
                    if (jobTitle) {
                        updatedEmployee.position = `Acting ${jobTitle.label}`;
                        // For acting roles, we might not want to change grade and category permanently.
                    }
                }
                if (details.newDepartment) {
                    const department = masterData.departments.find((d:any) => d.value === details.newDepartment);
                    if(department) updatedEmployee.department = department.label;
                }
                 if (details.newManager) {
                    const manager = employees.find((e:any) => e.id === details.newManager);
                    if(manager) updatedEmployee.manager = manager.name;
                }
                break;
        }
        
        allEmployees[employeeIndex] = updatedEmployee;
        setEmployees(allEmployees);
        localStorage.setItem('employees', JSON.stringify(allEmployees));
    };

    const handleApprove = (actionId: string) => {
        const actionToUpdate = personnelActions.find(a => a.id === actionId);
        if (!actionToUpdate) return;

        applyAction(actionToUpdate);
        
        const updatedActions = personnelActions.map(action =>
            action.id === actionId ? { ...action, status: "Completed" } : action
        );
        
        setPersonnelActions(updatedActions);
        
        if (selectedAction && selectedAction.id === actionId) {
            setSelectedAction({ ...selectedAction, status: "Completed" });
        }

        toast({ title: "Success", description: "Action approved and employee record updated." });
    };
    
    const handleReject = (actionId: string) => {
        setPersonnelActions(prevActions =>
            prevActions.map(action =>
                action.id === actionId ? { ...action, status: "Rejected" } : action
            )
        );
         toast({ title: "Action Rejected", description: "The personnel action has been marked as rejected." });
         setDetailsDialogOpen(false);
    };
    
    const handleDelete = (actionId: string) => {
        setPersonnelActions(prevActions => prevActions.filter(action => action.id !== actionId));
        toast({ title: "Action Deleted", description: "The personnel action has been removed." });
        setDetailsDialogOpen(false);
    };

    const handleOpenDetails = (action: any) => {
        setSelectedAction(action);
        setDetailsDialogOpen(true);
    }

    const handleEdit = (action: any) => {
        const actionTypeMachineReadable = action.type.toLowerCase().replace(/ /g, '-');
        router.push(`/personnel-actions/new?type=${actionTypeMachineReadable}&edit=${action.id}`);
    }
    
    const currentEmployeeRecord = useMemo(() => {
        if (!selectedAction) return null;
        return employees.find(e => e.id === selectedAction.employeeId);
    }, [selectedAction, employees]);
    
    const getChangeDetails = (action: any) => {
        const { details, type } = action;
        const proposed: {label: string, value: any}[] = [];
        const newJobTitleDetails = masterData.jobTitles.find((jt:any) => jt.value === (details.newJobTitle || details.actingJobTitle));

        if (details.newDepartment) proposed.push({ label: 'New Department', value: masterData.departments.find((d:any) => d.value === details.newDepartment)?.label });
        
        if (details.newJobTitle || details.actingJobTitle) {
            const label = type === 'Acting Assignment' ? 'Acting Job Title' : 'New Job Title';
            proposed.push({ label, value: newJobTitleDetails?.label });
            if (newJobTitleDetails) {
              proposed.push({ label: 'New Job Grade', value: masterData.jobGrades.find((g:any) => g.value === newJobTitleDetails.jobGrade)?.label || '' });
              proposed.push({ label: 'New Job Category', value: masterData.jobCategories.find((c:any) => c.value === newJobTitleDetails.jobCategory)?.label || '' });
            }
        }
        
        if (details.newSalary) proposed.push({ label: 'New Salary', value: details.newSalary });
        if (details.specialDutyAllowance) proposed.push({ label: 'Special Duty Allowance', value: details.specialDutyAllowance });
        if (details.startDate) proposed.push({ label: 'Start Date', value: details.startDate });
        if (details.endDate) proposed.push({ label: 'End Date', value: details.endDate });
        if (details.newManager) proposed.push({ label: 'New Manager', value: employees.find(e => e.id === details.newManager)?.name });
        
        if (details.caseType) proposed.push({ label: 'Action Taken', value: masterData.disciplinaryActionTypes.find((d:any) => d.value === details.caseType)?.label });
        if (details.incidentDate) proposed.push({ label: 'Incident Date', value: details.incidentDate });
        if (details.salaryPenalty) proposed.push({ label: 'Salary Penalty (%)', value: `${details.salaryPenalty}%` });
        if (details.penaltyAmount) proposed.push({ label: 'Penalty Amount', value: `${details.penaltyAmount} ETB` });
        
        if (details.justification || details.description) {
            proposed.push({ label: 'Justification/Description', value: details.justification || details.description });
        }
        
        return proposed;
    };
    
    const handleGenerateMemoContent = () => {
        if (!selectedAction || !currentEmployeeRecord) return;

        if (selectedAction.memoContent) {
            setMemoContent(selectedAction.memoContent);
            setMemoDialogOpen(true);
            return;
        }

        const { details, type } = selectedAction;
        const effectiveDate = format(new Date(selectedAction.effectiveDate), "MMMM dd, yyyy");
        const today = format(new Date(), "MMMM dd, yyyy");
        let body = '';
        
        switch (type) {
            case 'Promotion':
                const newPosition = masterData.jobTitles.find((jt: any) => jt.value === details.newJobTitle)?.label || 'N/A';
                const newDepartment = masterData.departments.find((d: any) => d.value === details.newDepartment)?.label || currentEmployeeRecord.department;
                const newSalary = details.newSalary ? `Your new basic salary will be ${Number(details.newSalary).toLocaleString()} ETB.` : '';

                body = `To: ${currentEmployeeRecord.name}
From: Human Resources Department
Date: ${today}
Subject: Notification of Promotion

This memo is to formally congratulate you on your promotion to the position of ${newPosition} within the ${newDepartment} department, effective ${effectiveDate}.

This promotion is in recognition of your hard work, dedication, and significant contributions to the company. ${newSalary}

We are confident that you will continue to excel and wish you the best in your new role.

Sincerely,
The Management`;
                break;
            case 'Transfer':
            case 'Lateral Transfer':
                const transferNewDepartment = masterData.departments.find((d: any) => d.value === details.newDepartment)?.label || 'N/A';
                const oldDepartment = currentEmployeeRecord.department;
                const newManager = employees.find(e => e.id === details.newManager)?.name || 'N/A';
                const oldManager = currentEmployeeRecord.manager || 'N/A';
                let transferNewPosition = currentEmployeeRecord.position;
                if (type === 'Lateral Transfer' && details.newJobTitle) {
                    transferNewPosition = masterData.jobTitles.find((jt: any) => jt.value === details.newJobTitle)?.label || currentEmployeeRecord.position;
                }
                body = `To: ${currentEmployeeRecord.name}
From: Human Resources Department
Date: ${today}
Subject: Official Transfer Notification

This memo is to formally confirm your transfer, effective ${effectiveDate}. Please review the details of your new assignment below:

Employee ID: ${currentEmployeeRecord.employeeId}

Previous Department: ${oldDepartment}
New Department: ${transferNewDepartment}

Position: ${transferNewPosition}

Previous Supervisor: ${oldManager}
New Supervisor: ${newManager}

We are confident that your skills and experience will be a valuable asset to your new team. Please coordinate with both your current and new supervisors to ensure a smooth transition of your duties and responsibilities.

We wish you the best of luck in your new role.

Sincerely,
The Management`;
                break;
            
            case 'Demotion':
                const demotionPosition = masterData.jobTitles.find((jt: any) => jt.value === details.newJobTitle)?.label || 'N/A';
                const demotionDepartment = masterData.departments.find((d: any) => d.value === details.newDepartment)?.label || currentEmployeeRecord.department;
                body = `To: ${currentEmployeeRecord.name}
From: Human Resources Department
Date: ${today}
Subject: Notification of Position Change

This memo is to inform you of a change in your position, effective ${effectiveDate}.

Your new position will be ${demotionPosition} in the ${demotionDepartment} department. This decision was made based on [Refer to official reason/performance review - e.g., the recent performance evaluation cycle, organizational restructuring].

Further details regarding this transition will be discussed with you by your supervisor.

Sincerely,
The Management`;
                break;

            case 'Acting Assignment':
                const actingPosition = masterData.jobTitles.find((jt: any) => jt.value === details.actingJobTitle)?.label || 'N/A';
                const actingDepartment = masterData.departments.find((d: any) => d.value === details.newDepartment)?.label || currentEmployeeRecord.department;
                const startDate = details.startDate ? format(new Date(details.startDate), "MMMM dd, yyyy") : 'N/A';
                const endDate = details.endDate ? format(new Date(details.endDate), "MMMM dd, yyyy") : 'N/A';
                const allowance = details.specialDutyAllowance ? `You will be entitled to a special duty allowance of ${details.specialDutyAllowance} ETB for the duration of this assignment.` : '';

                body = `To: ${currentEmployeeRecord.name}
From: Human Resources Department
Date: ${today}
Subject: Acting Assignment Notification

This memo is to confirm your assignment to an acting position, effective from ${startDate} to ${endDate}.

You will be assuming the responsibilities of ${actingPosition} in the ${actingDepartment} department. 
${allowance}

Upon completion of this period, you will return to your substantive post. We are confident in your ability to handle these additional responsibilities.

Sincerely,
The Management`;
                break;
        }

        setMemoContent(body);
        setMemoDialogOpen(true);
    };

    const handleSaveMemo = () => {
        if (!selectedAction) return;

        const updatedActions = personnelActions.map(action => 
            action.id === selectedAction.id ? { ...action, memoContent: memoContent } : action
        );
        setPersonnelActions(updatedActions);
        
        setSelectedAction(prev => ({...prev, memoContent: memoContent }));

        toast({ title: "Memo Saved", description: "The memo content has been saved with this action." });
    };

    const downloadMemoPdf = () => {
        const doc = new jsPDF();
        const employeeName = currentEmployeeRecord?.name || 'employee';
        
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Inter-Office Memorandum", 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        doc.text(memoContent, 20, 40, { maxWidth: 170 });

        doc.save(`Memo_${selectedAction?.type.replace(' ','_')}_${employeeName.replace(/ /g, '_')}.pdf`);
        setMemoDialogOpen(false);
    };

    const filteredPersonnelActions = useMemo(() => {
        const sortedActions = [...personnelActions].sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
        if (!searchTerm) return sortedActions;
        
        return sortedActions.filter(action =>
            (action.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (action.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (action.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [personnelActions, searchTerm]);


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Personnel Actions</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Initiate New Action</CardTitle>
                    <CardDescription>Select a personnel action to begin a new transaction.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {actionTypes.map((action) => (
                        <Card 
                            key={action.action}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleActionClick(action.action)}
                        >
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="p-3 rounded-md bg-muted">
                                    <action.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">{action.title}</CardTitle>
                                    <CardDescription className="text-xs">{action.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Action History & Approvals</CardTitle>
                    <CardDescription>An overview of all submitted personnel actions.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by ID, employee name, or action type..." 
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
                                <TableHead>Action ID</TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead>Action Type</TableHead>
                                <TableHead>Effective Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPersonnelActions.map((action) => (
                                <TableRow key={action.id}>
                                    <TableCell>{action.id}</TableCell>
                                    <TableCell>{action.employeeName}</TableCell>
                                    <TableCell>{action.type}</TableCell>
                                    <TableCell>{action.effectiveDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            action.status === 'Completed' ? 'secondary' :
                                            action.status === 'Pending' ? 'default' :
                                            action.status === 'In Progress' ? 'outline' : 'destructive'
                                        }>{action.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleOpenDetails(action)}>
                                                    <View className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                {action.status === 'Pending' && (
                                                    <>
                                                        <DropdownMenuItem onSelect={() => handleEdit(action)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onSelect={() => handleApprove(action.id)}>
                                                            <Check className="mr-2 h-4 w-4" /> Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => handleReject(action.id)}>
                                                            <X className="mr-2 h-4 w-4" /> Reject
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Dialog open={isDetailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                <DialogContent className="sm:max-w-2xl grid-rows-[auto_1fr_auto]">
                    <DialogHeader>
                        <DialogTitle>Action Details: {selectedAction?.type}</DialogTitle>
                        <DialogDescription>
                            Review the details below before taking an action.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[60vh] pr-4">
                        {selectedAction && currentEmployeeRecord && (
                            <div className="grid gap-6 py-4">
                                <Card className="border-none shadow-none">
                                    <CardHeader className="p-0 pb-4">
                                        <CardTitle className="text-md">Current Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 grid grid-cols-2 gap-4">
                                        <InfoItem label="Employee" value={currentEmployeeRecord.name} />
                                        <InfoItem label="Department" value={currentEmployeeRecord.department} />
                                        <InfoItem label="Job Title" value={currentEmployeeRecord.position} />
                                        <InfoItem label="Job Grade" value={currentEmployeeRecord.jobGrade} />
                                        <InfoItem label="Job Category" value={currentEmployeeRecord.jobCategory} />
                                        <InfoItem label="Basic Salary" value={currentEmployeeRecord.basicSalary} />
                                    </CardContent>
                                </Card>

                                <Separator />
                                
                                <Card className="border-none shadow-none">
                                    <CardHeader className="p-0 pb-4">
                                        <CardTitle className="text-md">Proposed Changes</CardTitle>
                                        <CardDescription>Effective from: {selectedAction.details.effectiveDate}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 grid grid-cols-2 gap-4">
                                    {getChangeDetails(selectedAction).map(change => (
                                        <InfoItem key={change.label} label={change.label} value={change.value} />
                                    ))}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 border-t">
                         <div className="flex items-center gap-2">
                            {(['Promotion', 'Transfer', 'Lateral Transfer', 'Demotion', 'Acting Assignment'].includes(selectedAction?.type)) && (
                                <Button variant="secondary" size="sm" onClick={handleGenerateMemoContent}>
                                    {selectedAction.memoContent ? <FileText className="mr-2 h-4 w-4 text-green-500" /> : <Download className="mr-2 h-4 w-4" />}
                                    {selectedAction.memoContent ? 'Edit Memo' : 'Generate Memo'}
                                </Button>
                            )}
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will permanently delete this action record.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => selectedAction && handleDelete(selectedAction.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                            {selectedAction?.status === 'Pending' ? (
                                <>
                                    <Button variant="outline" onClick={() => selectedAction && handleReject(selectedAction.id)}>
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button onClick={() => selectedAction && handleApprove(selectedAction.id)}>
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                </>
                            ) : (
                               <DialogClose asChild>
                                 <Button variant="outline">Close</Button>
                               </DialogClose>
                            )}
                         </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <Dialog open={isMemoDialogOpen} onOpenChange={setMemoDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit and Finalize Memo</DialogTitle>
                        <DialogDescription>
                            Make any necessary edits to the memo content before downloading.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="memo-content">Memo Content</Label>
                            <Textarea
                                id="memo-content"
                                value={memoContent}
                                onChange={(e) => setMemoContent(e.target.value)}
                                rows={15}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button variant="outline" onClick={handleSaveMemo}>Save Memo</Button>
                        <Button onClick={downloadMemoPdf}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

    
    
