
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, UserCheck, Shuffle, Copy, AlertTriangle, MoreHorizontal, Check, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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


export default function PersonnelActionsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [personnelActions, setPersonnelActions] = useState(initialActions);
    const [isClient, setIsClient] = useState(false);
    const masterData = useMemo(() => getMasterData(), []);

    useEffect(() => {
        setIsClient(true);
        const storedActions = localStorage.getItem('personnelActions');
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
        const storedEmployees = localStorage.getItem('employees');
        if (!storedEmployees) {
            toast({ variant: "destructive", title: "Error", description: "Employee data not found." });
            return;
        }

        let employees = JSON.parse(storedEmployees);
        const employeeIndex = employees.findIndex((emp: any) => emp.id === action.employeeId);

        if (employeeIndex === -1) {
            toast({ variant: "destructive", title: "Error", description: "Employee not found." });
            return;
        }
        
        const updatedEmployee = { ...employees[employeeIndex] };

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
                if (action.details.newDepartment) updatedEmployee.department = masterData.departments.find(d => d.value === action.details.newDepartment)?.label;
                break;
            case 'Transfer':
                if (action.details.newDepartment) updatedEmployee.department = masterData.departments.find(d => d.value === action.details.newDepartment)?.label;
                if (action.details.newManager) updatedEmployee.manager = employees.find((e:any) => e.id === action.details.newManager)?.name;
                break;
            // Acting and Disciplinary cases might not change the core employee record in this simple implementation
            // but could trigger other workflows.
        }
        
        employees[employeeIndex] = updatedEmployee;
        localStorage.setItem('employees', JSON.stringify(employees));
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
    };
    
    const handleReject = (actionId: string) => {
        setPersonnelActions(prevActions =>
            prevActions.map(action =>
                action.id === actionId ? { ...action, status: "Rejected" } : action
            )
        );
         toast({ title: "Action Rejected", description: "The personnel action has been marked as rejected." });
    };
    
    const handleDelete = (actionId: string) => {
        setPersonnelActions(prevActions => prevActions.filter(action => action.id !== actionId));
        toast({ title: "Action Deleted", description: "The personnel action has been removed." });
    };

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
                            {personnelActions.map((action) => (
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
                                                {action.status === 'Pending' && (
                                                    <>
                                                        <DropdownMenuItem onSelect={() => handleApprove(action.id)}>
                                                            <Check className="mr-2 h-4 w-4" /> Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => handleReject(action.id)}>
                                                            <X className="mr-2 h-4 w-4" /> Reject
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                       <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                                                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                       </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                      <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                          This action cannot be undone. This will permanently delete this action record.
                                                        </AlertDialogDescription>
                                                      </AlertDialogHeader>
                                                      <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(action.id)}>Delete</AlertDialogAction>
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
            </Card>
        </div>
    )
}
