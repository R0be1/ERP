

"use client"

import { useState, useEffect, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, UserCheck, Shuffle, Copy, AlertTriangle, MoreHorizontal, Check, X, Trash2, View, Edit, Search } from "lucide-react";
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
        
        const updatedEmployee = { ...allEmployees[employeeIndex] };

        // Apply changes based on action type
        switch (action.type) {
            case 'Promotion':
            case 'Demotion':
            case 'Lateral Transfer':
                if (action.details.newJobTitle) {
                    const jobTitle = masterData.jobTitles.find(jt => jt.value === action.details.newJobTitle);
                    if(jobTitle) {
                        updatedEmployee.position = jobTitle.label;
                        updatedEmployee.jobGrade = jobTitle.jobGrade;
                        updatedEmployee.jobCategory = jobTitle.jobCategory;
                    }
                }
                if (action.details.newSalary) updatedEmployee.basicSalary = action.details.newSalary;
                if (action.details.newDepartment) updatedEmployee.department = masterData.departments.find((d:any) => d.value === action.details.newDepartment)?.label;
                break;
            case 'Transfer':
                if (action.details.newDepartment) updatedEmployee.department = masterData.departments.find((d:any) => d.value === action.details.newDepartment)?.label;
                if (action.details.newManager) updatedEmployee.manager = employees.find((e:any) => e.id === action.details.newManager)?.name;
                break;
            // Acting and Disciplinary cases might not change the core employee record in this simple implementation
            // but could trigger other workflows.
        }
        
        allEmployees[employeeIndex] = updatedEmployee;
        setEmployees(allEmployees);
        localStorage.setItem('employees', JSON.stringify(allEmployees));
    };

    const handleApprove = (actionId: string) => {
        const actionToUpdate = personnelActions.find(a => a.id === actionId);
        if (!actionToUpdate) return;

        applyAction(actionToUpdate);
        
        setPersonnelActions(prevActions =>
            prevActions.map(action =>
                action.id === actionId ? { ...action, status: "Completed" } : action
            )
        );
        toast({ title: "Success", description: "Action approved and employee record updated." });
        setDetailsDialogOpen(false);
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
        const newJobTitleDetails = masterData.jobTitles.find(jt => jt.value === (details.newJobTitle || details.actingJobTitle));

        if (details.newDepartment) proposed.push({ label: 'New Department', value: masterData.departments.find(d => d.value === details.newDepartment)?.label });
        
        if (details.newJobTitle || details.actingJobTitle) {
            const label = type === 'Acting Assignment' ? 'Acting Job Title' : 'New Job Title';
            proposed.push({ label, value: newJobTitleDetails?.label });
            proposed.push({ label: 'New Job Grade', value: newJobTitleDetails ? masterData.jobGrades.find(g => g.value === newJobTitleDetails.jobGrade)?.label : '' });
            proposed.push({ label: 'New Job Category', value: newJobTitleDetails ? masterData.jobCategories.find(c => c.value === newJobTitleDetails.jobCategory)?.label : '' });
        }
        
        if (details.newSalary) proposed.push({ label: 'New Salary', value: details.newSalary });
        if (details.specialDutyAllowance) proposed.push({ label: 'Special Duty Allowance', value: details.specialDutyAllowance });
        if (details.startDate) proposed.push({ label: 'Start Date', value: details.startDate });
        if (details.endDate) proposed.push({ label: 'End Date', value: details.endDate });
        if (details.newManager) proposed.push({ label: 'New Manager', value: employees.find(e => e.id === details.newManager)?.name });
        
        if (details.caseType) proposed.push({ label: 'Action Taken', value: masterData.disciplinaryActionTypes.find(d => d.value === details.caseType)?.label });
        if (details.incidentDate) proposed.push({ label: 'Incident Date', value: details.incidentDate });
        if (details.salaryPenalty) proposed.push({ label: 'Salary Penalty (%)', value: `${details.salaryPenalty}%` });
        if (details.penaltyAmount) proposed.push({ label: 'Penalty Amount', value: `${details.penaltyAmount} ETB` });
        
        if (details.justification || details.description) {
            proposed.push({ label: 'Justification/Description', value: details.justification || details.description });
        }
        
        return proposed;
    };

    const filteredPersonnelActions = useMemo(() => {
        if (!searchTerm) return personnelActions;
        return personnelActions.filter(action =>
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Action Details: {selectedAction?.type}</DialogTitle>
                        <DialogDescription>
                            Review the details below before taking an action.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedAction && currentEmployeeRecord && (
                        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto p-1 pr-2">
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
                    <DialogFooter className="sm:justify-between gap-2 pt-4 border-t">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full sm:w-auto">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Action
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

                        {selectedAction?.status === 'Pending' && (
                            <div className="flex flex-col-reverse sm:flex-row gap-2">
                                <Button variant="outline" onClick={() => selectedAction && handleReject(selectedAction.id)}>
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                                <Button onClick={() => selectedAction && handleApprove(selectedAction.id)}>
                                    <Check className="mr-2 h-4 w-4" /> Approve
                                </Button>
                            </div>
                        )}
                         {selectedAction?.status !== 'Pending' && (
                           <DialogClose asChild>
                             <Button variant="outline">Close</Button>
                           </DialogClose>
                         )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
