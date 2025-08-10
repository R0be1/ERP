

"use client"

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import 'jspdf-autotable';
import { format, subDays } from 'date-fns';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RichTextEditor } from '@/components/rich-text-editor';

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

// Function to convert number to words
const numberToWords = (num: number): string => {
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if (isNaN(num) || num === null) return '';
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
    const [memoCcList, setMemoCcList] = useState('');
    
    const masterData = useMemo(() => getMasterData(), []);

    const loadData = useCallback(() => {
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
        setIsClient(true);
        loadData();
         const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'personnelActions' || event.key === 'employees') {
                loadData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [loadData]);

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
        
        const actionsThatChangeRole = ['Promotion', 'Demotion', 'Lateral Transfer', 'Acting Assignment', 'Transfer'];
        if (actionsThatChangeRole.includes(type)) {
            const currentExperienceIndex = updatedEmployee.internalExperience.findIndex((exp: any) => !exp.endDate || exp.endDate === 'Present' || exp.endDate === '');
            if (currentExperienceIndex > -1) {
                updatedEmployee.internalExperience[currentExperienceIndex].endDate = format(subDays(new Date(effectiveDate), 1), 'yyyy-MM-dd');
            }

            const jobTitleValue = details.newJobTitle || details.actingJobTitle;
            const jobTitle = jobTitleValue ? masterData.jobTitles.find((jt:any) => jt.value === jobTitleValue) : null;
            
            const departmentValue = details.newDepartment;
            const department = departmentValue ? masterData.departments.find((d:any) => d.value === departmentValue) : null;

            const baseTitle = jobTitle?.label || updatedEmployee.position;
            const finalTitle = type === 'Acting Assignment' ? `Acting ${baseTitle}` : baseTitle;

            const newExperience = {
                title: finalTitle,
                department: department?.label || updatedEmployee.department,
                startDate: effectiveDate,
                endDate: '',
                managerialRole: jobTitle?.jobCategory === 'managerial' || jobTitle?.isHeadOfDepartment || false
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
            setMemoCcList(selectedAction.memoCcList || '');
            setMemoDialogOpen(true);
            return;
        }

        const template = (masterData.hrTemplates || []).find(
            (t: any) => t.actionType === selectedAction.type && t.status === 'active'
        );

        if (!template) {
            toast({
                variant: 'destructive',
                title: 'No Template Found',
                description: `An active memo template for "${selectedAction.type}" could not be found. Please configure it in HR Templates.`,
            });
            return;
        }
        
        let content = template.content;
        const { details } = selectedAction;
        const newJobTitleDetails = masterData.jobTitles.find((jt: any) => jt.value === (details.newJobTitle || details.actingJobTitle));
        const newPosition = newJobTitleDetails?.label || 'N/A';
        const newJobGrade = masterData.jobGrades.find((jg: any) => jg.value === newJobTitleDetails?.jobGrade)?.label || '';
        const newDepartment = masterData.departments.find((d: any) => d.value === details.newDepartment);
        const newDepartmentLabel = newDepartment?.label || currentEmployeeRecord.department;
        const oldDepartment = masterData.departments.find((d: any) => d.label === currentEmployeeRecord.department);
        const oldDepartmentLabel = oldDepartment?.label || currentEmployeeRecord.department;
        
        const getParentDeptLabel = (dept: any) => dept && dept.parent ? masterData.departments.find((p: any) => p.value === dept.parent)?.label || '' : '';
        
        const newParentDeptLabel = getParentDeptLabel(newDepartment);
        const oldParentDeptLabel = getParentDeptLabel(oldDepartment);

        const newManager = employees.find(e => e.id === details.newManager)?.name || 'N/A';
        const newSalaryInFigures = details.newSalary ? `${Number(details.newSalary).toLocaleString()} ETB` : '';
        const newSalaryInWords = details.newSalary ? numberToWords(Number(details.newSalary)) + ' ETB' : '';

        const placeholders: { [key: string]: string } = {
            '{{employeeName}}': currentEmployeeRecord.name,
            '{{firstName}}': currentEmployeeRecord.firstName,
            '{{employeeId}}': currentEmployeeRecord.employeeId,
            '{{effectiveDate}}': format(new Date(selectedAction.effectiveDate), "MMMM dd, yyyy"),
            '{{today}}': format(new Date(), "MMMM dd, yyyy"),
            '{{newPosition}}': newPosition,
            '{{newJobGrade}}': newJobGrade,
            '{{newDepartment}}': newDepartmentLabel,
            '{{newParentDepartment}}': newParentDeptLabel,
            '{{oldPosition}}': currentEmployeeRecord.position,
            '{{oldDepartment}}': oldDepartmentLabel,
            '{{oldParentDepartment}}': oldParentDeptLabel,
            '{{newManager}}': newManager,
            '{{oldManager}}': currentEmployeeRecord.manager || 'N/A',
            '{{newSalaryInFigures}}': newSalaryInFigures,
            '{{newSalaryInWords}}': newSalaryInWords,
            '{{actingPosition}}': newPosition,
            '{{actingStartDate}}': details.startDate ? format(new Date(details.startDate), "MMMM dd, yyyy") : 'N/A',
            '{{actingEndDate}}': details.endDate ? format(new Date(details.endDate), "MMMM dd, yyyy") : 'N/A',
            '{{specialDutyAllowance}}': details.specialDutyAllowance ? `${details.specialDutyAllowance} ETB` : '',
            '{{justification}}': details.justification || '',
        };

        for (const [key, value] of Object.entries(placeholders)) {
            content = content.replace(new RegExp(key, 'g'), value);
        }
        
        const employeeJobCategoryValue = masterData.jobCategories.find(jc => jc.label === currentEmployeeRecord.jobCategory)?.value || '';
        const employeeJobTitleValue = masterData.jobTitles.find(jt => jt.label === currentEmployeeRecord.position)?.value || '';

        // Handle CC
        const ccRule = (masterData.carbonCopyRules || []).find((r: any) => 
            r.status === 'active' &&
            r.actionTypes.includes(selectedAction.type) &&
            (!r.jobCategories.length || r.jobCategories.includes(employeeJobCategoryValue)) &&
            (!r.jobTitles.length || r.jobTitles.includes(employeeJobTitleValue))
        );

        let ruleRecipients: string[] = [];
        if (ccRule) {
            const deptLabels = (ccRule.ccDepartments || []).map((deptValue: string) => masterData.departments.find((d: any) => d.value === deptValue)?.label).filter(Boolean);
            ruleRecipients.push(...deptLabels);
            if (ccRule.ccFreeText) {
                ruleRecipients.push(...ccRule.ccFreeText.split(',').map((s: string) => s.trim()));
            }
        }
        
        // Add related departments to CC list
        const relatedDepartments = new Set<string>();
        if(oldDepartmentLabel) relatedDepartments.add(oldDepartmentLabel);
        if(oldParentDeptLabel) relatedDepartments.add(oldParentDeptLabel);
        if(newDepartmentLabel) relatedDepartments.add(newDepartmentLabel);
        if(newParentDeptLabel) relatedDepartments.add(newParentDeptLabel);

        const allCcRecipients = [...new Set([...Array.from(relatedDepartments), ...ruleRecipients])];
        
        const getDeptLevel = (deptLabel: string): number => {
            const allDepts = masterData.departments;
            let level = 0;
            let current = allDepts.find(d => d.label === deptLabel);
            while(current && current.parent) {
                level++;
                current = allDepts.find(d => d.value === current.parent);
            }
            return level;
        };

        const sortedDepts = allCcRecipients
            .filter(r => masterData.departments.some(d => d.label === r))
            .sort((a,b) => getDeptLevel(a) - getDeptLevel(b));
        
        const freeTextRecipients = allCcRecipients.filter(r => !masterData.departments.some(d => d.label === r));

        const sortedCcList = [...sortedDepts, ...freeTextRecipients];
        
        let ccListHtml = '';
        if (sortedCcList.length > 0) {
            ccListHtml = "<br/><br/><p><strong>CC:</strong></p><ul>";
            sortedCcList.forEach(recipient => {
                ccListHtml += `<li>${recipient}</li>`;
            });
            ccListHtml += "</ul>";
        }
        
        setMemoContent(content);
        setMemoCcList(ccListHtml);

        // Find and attach the signature rule automatically
        const signatureRules = masterData.signatureRules || [];
        const today = new Date();
        
        const signatureRule = signatureRules.find((r: any) =>
            r.documentType === 'memo' &&
            r.status === 'active' &&
            r.actionTypes.includes(selectedAction.type) &&
            r.jobCategories.includes(employeeJobCategoryValue) &&
            new Date(r.startDate) <= today &&
            (!r.endDate || new Date(r.endDate) >= today)
        );

        let updatedActionData: any = { memoContent: content, memoCcList: ccListHtml };

        if (signatureRule) {
            updatedActionData.signature = signatureRule;
             toast({ title: "Memo Generated", description: "Signature rule found and applied." });
        } else {
             toast({ variant: "destructive", title: "No Signature Rule Found", description: "A valid signature rule for this action could not be found." });
        }
        
        const updatedActions = personnelActions.map(action => 
            action.id === selectedAction.id ? { ...action, ...updatedActionData } : action
        );
        setPersonnelActions(updatedActions);
        setSelectedAction(prev => ({...prev, ...updatedActionData }));

        setMemoDialogOpen(true);
    };

    const handleSaveMemo = () => {
        if (!selectedAction) return;

        const updatedActions = personnelActions.map(action => 
            action.id === selectedAction.id ? { ...action, memoContent: memoContent } : action
        );
        setPersonnelActions(updatedActions);
        
        setSelectedAction(prev => ({...prev, memoContent: memoContent }));

        toast({ title: "Memo Saved", description: "The memo content has been updated." });
    };

    const downloadMemoPdf = () => {
        if (!selectedAction || !memoContent) return;

        const doc = new jsPDF();
        const employeeName = currentEmployeeRecord?.name || 'employee';

        const signatureBlockHtml = selectedAction.signature 
            ? `
                <div style="margin-top: 20px; position: relative;">
                    ${selectedAction.signature.signatureImage ? `<img src="${selectedAction.signature.signatureImage}" style="width: 150px; height: auto;" />` : ''}
                    ${selectedAction.signature.stampImage ? `<img src="${selectedAction.signature.stampImage}" style="width: 120px; height: 120px; position: absolute; left: 120px; top: -10px; opacity: 0.8;" />` : ''}
                    <p style="margin: 0; font-weight: bold;">${selectedAction.signature.signatoryName || ''}</p>
                    <p style="margin: 0;">${selectedAction.signature.signatoryTitle || ''}</p>
                </div>`
            : '<p style="margin-top: 20px;">Nib International Bank</p>';
        
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
            .ql-editor .ql-line-height-1 { line-height: 1; }
            .ql-editor .ql-line-height-1-5 { line-height: 1.5; }
            .ql-editor .ql-line-height-2 { line-height: 2; }
            .ql-editor .ql-line-height-2-5 { line-height: 2.5; }
            .ql-editor .ql-line-height-3 { line-height: 3; }
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
                          <div class="ql-editor">
                           ${memoContent}
                          </div>
                        </div>
                        ${signatureBlockHtml}
                        <div class="ql-container ql-snow" style="border: none;">
                          <div class="ql-editor">
                           ${selectedAction.memoCcList || ''}
                          </div>
                        </div>
                    </div>
                </body>
            </html>
        `;

        doc.html(finalHtml, {
            autoPaging: 'text',
            callback: function (doc) {
                doc.save(`Memo_${selectedAction?.type.replace(' ','_')}_${employeeName.replace(/ /g, '_')}.pdf`);
            },
            x: 0,
            y: 0,
            width: 210, // A4 width in mm
            windowWidth: 800 // an arbitrary width for the browser rendering context
        });
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
                    <ScrollArea className="max-h-[60vh] pr-4">
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
                                        <CardDescription>Effective from: {selectedAction.effectiveDate}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 grid grid-cols-2 gap-4">
                                    {getChangeDetails(selectedAction).map(change => (
                                        <InfoItem key={change.label} label={change.label} value={change.value} />
                                    ))}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </ScrollArea>
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
                                 <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
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
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="memo-content">Memo Content</Label>
                             <RichTextEditor
                                value={memoContent}
                                onChange={setMemoContent}
                            />
                        </div>
                        {memoCcList && (
                             <div className="mt-4">
                                <Label>CC List (Read-only)</Label>
                                <div className="p-4 border rounded-md mt-2 text-sm bg-muted text-muted-foreground" dangerouslySetInnerHTML={{ __html: memoCcList }} />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setMemoDialogOpen(false)}>Cancel</Button>
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

    
    










