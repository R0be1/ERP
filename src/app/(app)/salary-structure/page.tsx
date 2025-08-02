

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { MoreHorizontal, PlusCircle, Trash2, Edit, X } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMasterData, setMasterData } from '@/lib/master-data';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const MultiSelectCombobox = ({ items, selected, onChange, placeholder, disabled = false }: { items: {value: string, label: string}[], selected: string[], onChange: (selected: string[]) => void, placeholder: string, disabled?: boolean }) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
        onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
    };
    
    const handleUnselect = (value: string) => {
        onChange(selected.filter(v => v !== value));
    };

    const selectedItems = items.filter(item => selected.includes(item.value));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                 <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex flex-wrap gap-1 items-center rounded-md border border-input min-h-10 p-1 w-full text-left bg-background",
                        disabled ? "cursor-not-allowed opacity-50 bg-muted" : "cursor-pointer"
                    )}
                    onClick={() => !disabled && setOpen(!open)}
                >
                    {selectedItems.map(item => (
                        <Badge key={item.value} variant="secondary" className="flex items-center gap-1">
                            {item.label}
                            <div
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUnselect(item.value); }}
                                onClick={(e) => { e.stopPropagation(); handleUnselect(item.value); }}
                                className="rounded-full hover:bg-muted-foreground/20 focus:ring-2 focus:ring-ring"
                            >
                                <X className="h-3 w-3" />
                            </div>
                        </Badge>
                    ))}
                    {selectedItems.length === 0 && <span className="text-muted-foreground text-sm flex-1 ml-1">{placeholder}</span>}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    onSelect={() => handleSelect(item.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(item.value) ? "opacity-100" : "opacity-0"
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
    );
};


const AllowanceRuleForm = ({ masterData, onSave, onCancel, initialData }: any) => {
    const initialFormState = {
        id: '',
        ruleType: 'grade',
        allowanceType: '',
        basis: 'fixed',
        value: '',
        isTaxable: false,
        effectiveDate: '',
        description: '',
        jobGrade: '',
        departments: [],
        jobTitles: [],
        positions: []
    };
    const [rule, setRule] = useState(initialData || initialFormState);

    useEffect(() => {
        const data = initialData || initialFormState;
        setRule({
            ...data,
            jobTitles: data.jobTitles || [],
            positions: data.positions || [],
        });
    }, [initialData]);

    const handleFieldChange = (field: string, value: any) => {
        setRule((prev: any) => {
            const newState = { ...prev, [field]: value };
            
            if (field === 'ruleType') {
                 newState.jobGrade = '';
                 newState.departments = [];
                 newState.jobTitles = [];
                 newState.positions = [];
            }
            
            if (field === 'jobGrade') {
                 // Reset job titles and positions when grade changes
                 newState.jobTitles = [];
                 newState.positions = [];
            }
            
            if (field === 'jobTitles') {
                 newState.positions = (value || []).map((jtValue: string) => {
                    const existingPos = (prev.positions || []).find((p: any) => p.jobTitle === jtValue);
                    return { jobTitle: jtValue, value: existingPos?.value || prev.value || '' }
                 });
            }


            return newState;
        });
    };

    const handlePositionValueChange = (jobTitle: string, value: string) => {
        setRule((prev: any) => {
            const updatedPositions = (prev.positions || []).map((p: any) => 
                p.jobTitle === jobTitle ? { ...p, value } : p
            );
            return { ...prev, positions: updatedPositions };
        });
    };
    
    const jobTitlesForDepartmentRule = useMemo(() => {
        return masterData.jobTitles; 
    }, [masterData.jobTitles]);

    const jobTitlesForGradeRule = useMemo(() => {
        if (rule.ruleType !== 'grade' || !rule.jobGrade) return [];
        return masterData.jobTitles.filter((jt: any) => jt.jobGrade === rule.jobGrade);
    }, [rule.ruleType, rule.jobGrade, masterData.jobTitles]);

    return (
        <>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid md:grid-cols-2 gap-4">
                     <div className="grid gap-2">
                        <Label>Rule Type</Label>
                        <Select value={rule.ruleType || ''} onValueChange={v => handleFieldChange('ruleType', v)} disabled={!!initialData?.id}>
                            <SelectTrigger><SelectValue placeholder="Select rule type..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="grade">Job Grade Based</SelectItem>
                                <SelectItem value="department">Department Names Based</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label>Allowance Type</Label>
                        <Select value={rule.allowanceType || ''} onValueChange={v => handleFieldChange('allowanceType', v)}>
                            <SelectTrigger><SelectValue placeholder="Select allowance..." /></SelectTrigger>
                            <SelectContent>
                                {masterData.allowanceTypes.map((a: any) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {rule.ruleType === 'grade' && (
                     <div className="grid gap-4">
                         <div className="grid gap-2">
                            <Label>Job Grade</Label>
                            <Select value={rule.jobGrade || ''} onValueChange={v => handleFieldChange('jobGrade', v)}>
                                <SelectTrigger><SelectValue placeholder="Select job grade..." /></SelectTrigger>
                                <SelectContent>
                                    {masterData.jobGrades.map((g: any) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {rule.jobGrade && (
                             <div className="grid gap-2">
                                <Label>Job Titles (Optional)</Label>
                                <p className="text-xs text-muted-foreground">If no titles are selected, the rule applies to the entire grade.</p>
                                 <MultiSelectCombobox 
                                    items={jobTitlesForGradeRule} 
                                    selected={rule.jobTitles || []}
                                    onChange={v => handleFieldChange('jobTitles', v)}
                                    placeholder="Select job titles to target specifically..."
                                />
                            </div>
                        )}
                    </div>
                )}

                {rule.ruleType === 'department' && (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Department Names</Label>
                            <MultiSelectCombobox 
                                items={masterData.departments} 
                                selected={rule.departments || []}
                                onChange={v => handleFieldChange('departments', v)}
                                placeholder="Select departments..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Job Titles</Label>
                             <MultiSelectCombobox 
                                items={jobTitlesForDepartmentRule} 
                                selected={rule.jobTitles || []}
                                onChange={v => handleFieldChange('jobTitles', v)}
                                placeholder="Select job titles..."
                            />
                        </div>
                    </div>
                )}

                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label>Basis</Label>
                        <Select value={rule.basis || ''} onValueChange={v => handleFieldChange('basis', v)}>
                            <SelectTrigger><SelectValue placeholder="Select basis..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                <SelectItem value="quantity">Quantity-Based</SelectItem>
                                <SelectItem value="percentage">% of Salary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label>Value</Label>
                        <Input 
                            type="number" 
                            placeholder={rule.basis === 'percentage' ? '%' : rule.basis === 'quantity' ? 'Qty' : 'Amount'}
                            value={rule.value || ''}
                            onChange={e => handleFieldChange('value', e.target.value)}
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label>Effective Date</Label>
                        <Input type="date" value={rule.effectiveDate || ''} onChange={e => handleFieldChange('effectiveDate', e.target.value)} />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="description">Rule Description</Label>
                    <Textarea id="description" value={rule.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} />
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="isTaxable" checked={rule.isTaxable || false} onCheckedChange={c => handleFieldChange('isTaxable', c)} />
                    <Label htmlFor="isTaxable">Is Taxable</Label>
                </div>
                
                {(rule.positions?.length > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Allowance Values per Position</CardTitle>
                            <CardDescription>
                                Set values for each selected job title. These will override the default value.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {rule.positions.map((pos: any, index: number) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Label className="flex-1">{masterData.jobTitles.find((jt:any) => jt.value === pos.jobTitle)?.label}</Label>
                                    <Input 
                                        type="number" 
                                        placeholder={rule.basis === 'percentage' ? '%' : rule.basis === 'quantity' ? 'Qty' : 'Amount'}
                                        value={pos.value || ''}
                                        onChange={(e) => handlePositionValueChange(pos.jobTitle, e.target.value)}
                                        className="w-40"
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button></DialogClose>
                <Button onClick={() => onSave(rule)}>Save Rule</Button>
            </DialogFooter>
        </>
    )
}

const SalaryStructurePage = () => {
    const [isClient, setIsClient] = useState(false);
    const [masterData, setMasterDataState] = useState(getMasterData());
    const [isStructureDialogOpen, setStructureDialogOpen] = useState(false);
    const [editingStructure, setEditingStructure] = useState<any | null>(null);
    const [isConflictAlertOpen, setConflictAlertOpen] = useState(false);
    const [formState, setFormState] = useState<any>({
        effectiveDate: '',
        jobGrade: '',
        status: 'active',
        steps: [{ step: '1', salary: '' }],
    });
    
    const [isAllowanceRuleDialogOpen, setAllowanceRuleDialogOpen] = useState(false);
    const [editingAllowanceRule, setEditingAllowanceRule] = useState<any | null>(null);

    useEffect(() => {
        setIsClient(true);
        const data = getMasterData();
        setMasterDataState(data);
    }, []);

    const salaryStructures = useMemo(() => masterData.salaryStructures || [], [masterData]);
    const allowanceRules = useMemo(() => masterData.allowanceRules || [], [masterData]);

    const handleOpenStructureDialog = (structure: any | null = null) => {
        setEditingStructure(structure);
        if (structure) {
            setFormState(structure);
        } else {
            setFormState({
                jobGrade: '',
                effectiveDate: '',
                status: 'active',
                steps: [{ step: '1', salary: '' }],
            });
        }
        setStructureDialogOpen(true);
    };

    const handleCloseStructureDialog = () => {
        setStructureDialogOpen(false);
        setEditingStructure(null);
        setFormState({
            effectiveDate: '',
            jobGrade: '',
            status: 'active',
            steps: [{ step: '1', salary: '' }],
        });
    };

    const handleFormChange = (key: string, value: any) => {
        setFormState((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...formState.steps];
        newSteps[index].salary = value;
        handleFormChange('steps', newSteps);
    };

    const addStep = () => {
        const newSteps = [...(formState.steps || [])];
        newSteps.push({ step: String(newSteps.length + 1), salary: '' });
        handleFormChange('steps', newSteps);
    };

    const removeStep = (index: number) => {
        const newSteps = formState.steps.filter((_: any, i: number) => i !== index);
        handleFormChange('steps', newSteps);
    };
    
    const handleSaveStructure = () => {
        if (!formState.jobGrade || !formState.effectiveDate) {
            // Basic validation
            alert("Job Grade and Effective Date are required.");
            return;
        }

        const isConflict = salaryStructures.some(s => 
            s.jobGrade === formState.jobGrade &&
            s.status === 'active' &&
            s.effectiveDate === formState.effectiveDate &&
            (!editingStructure || s.value !== editingStructure.value)
        );

        if (isConflict) {
            setConflictAlertOpen(true);
            return;
        }
        
        let updatedStructures = [...salaryStructures];
        if (editingStructure) {
            const index = updatedStructures.findIndex(s => s.value === editingStructure.value);
            updatedStructures[index] = { ...formState, label: `${getJobGradeLabel(formState.jobGrade)} Structure` };
        } else {
            const newId = `SS${String(Date.now()).slice(-4)}`;
            updatedStructures.push({ ...formState, value: newId, label: `${getJobGradeLabel(formState.jobGrade)} Structure` });
        }
        const newMasterData = { ...masterData, salaryStructures: updatedStructures };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
        handleCloseStructureDialog();
    };

    const handleDeleteStructure = (value: string) => {
        const updatedStructures = salaryStructures.filter((s:any) => s.value !== value);
        const newMasterData = { ...masterData, salaryStructures: updatedStructures };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    };

    const handleOpenAllowanceRuleDialog = (rule: any | null = null) => {
        setEditingAllowanceRule(rule);
        setAllowanceRuleDialogOpen(true);
    };
    
    const handleCloseAllowanceRuleDialog = () => {
        setEditingAllowanceRule(null);
        setAllowanceRuleDialogOpen(false);
    };

    const handleSaveAllowanceRule = (ruleData: any) => {
        let updatedRules = [...allowanceRules];
        if (editingAllowanceRule) {
             const index = updatedRules.findIndex(r => r.id === (editingAllowanceRule as any).id);
             if (index > -1) {
                updatedRules[index] = ruleData;
             }
        } else {
            updatedRules.push({ ...ruleData, id: `AR${Date.now()}` });
        }
        const newMasterData = { ...masterData, allowanceRules: updatedRules };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
        handleCloseAllowanceRuleDialog();
    };
    
    const handleDeleteAllowanceRule = (id: string) => {
        const updatedRules = allowanceRules.filter((r: any) => r.id !== id);
        const newMasterData = { ...masterData, allowanceRules: updatedRules };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    }

    const getJobGradeLabel = (value: string) => masterData.jobGrades.find((g:any) => g.value === value)?.label || value;
    const getAllowanceTypeLabel = (value: string) => masterData.allowanceTypes.find((a:any) => a.value === value)?.label || value;
    const getDepartmentLabels = (values: string[] = []) => {
        if (values.length > 2) return `${values.length} departments`;
        return values.map(v => masterData.departments.find((d:any) => d.value === v)?.label).filter(Boolean).join(', ');
    };
    const getJobTitleLabels = (values: string[] = []) => {
        if (!values || values.length === 0) return '';
        if (values.length > 2) return `${values.length} job titles`;
        return values.map(v => masterData.jobTitles.find((jt:any) => jt.value === v)?.label).filter(Boolean).join(', ');
    };

    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Salary & Allowance Management</h1>
            <Tabs defaultValue="structures">
                <TabsList>
                    <TabsTrigger value="structures">Salary Structures</TabsTrigger>
                    <TabsTrigger value="allowances">Allowance Rules</TabsTrigger>
                </TabsList>
                <TabsContent value="structures">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Base Salary Structures</CardTitle>
                                    <CardDescription>Manage base salary scales for each job grade.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenStructureDialog()} className="ml-auto">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Structure
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job Grade</TableHead>
                                        <TableHead>Effective Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salaryStructures.map((structure: any) => (
                                        <TableRow key={structure.value}>
                                            <TableCell>{getJobGradeLabel(structure.jobGrade)}</TableCell>
                                            <TableCell>{structure.effectiveDate}</TableCell>
                                            <TableCell><Badge variant={structure.status === 'active' ? 'secondary' : 'outline'}>{structure.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => handleOpenStructureDialog(structure)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                        <AlertDialog>
                                                          <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                          </AlertDialogTrigger>
                                                          <AlertDialogContent>
                                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete the structure.</AlertDialogDescription>
                                                            <AlertDialogFooter>
                                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                              <AlertDialogAction onClick={() => handleDeleteStructure(structure.value)}>Delete</AlertDialogAction>
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
                </TabsContent>
                <TabsContent value="allowances">
                    <Card>
                         <CardHeader>
                             <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Allowance Entitlement Rules</CardTitle>
                                    <CardDescription>Configure rules to assign allowances based on job grade or department.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenAllowanceRuleDialog(null)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Allowance Type</TableHead>
                                        <TableHead>Rule Type</TableHead>
                                        <TableHead>Target</TableHead>
                                        <TableHead>Effective Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allowanceRules.map((rule: any) => (
                                        <TableRow key={rule.id}>
                                            <TableCell>{getAllowanceTypeLabel(rule.allowanceType)}</TableCell>
                                            <TableCell>{rule.ruleType === 'grade' ? 'Job Grade' : 'Department'}</TableCell>
                                            <TableCell>
                                                {rule.ruleType === 'grade' 
                                                    ? `${getJobGradeLabel(rule.jobGrade)} / ${rule.jobTitles?.length > 0 ? getJobTitleLabels(rule.jobTitles) : `All Titles in ${getJobGradeLabel(rule.jobGrade)}`}`
                                                    : `${getDepartmentLabels(rule.departments)} / ${getJobTitleLabels(rule.jobTitles)}`
                                                }
                                            </TableCell>
                                            <TableCell>{rule.effectiveDate}</TableCell>
                                             <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => handleOpenAllowanceRuleDialog(rule)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                          <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                              <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                              <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                                              <AlertDialogDescription>This action cannot be undone. This will permanently delete the rule.</AlertDialogDescription>
                                                              <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteAllowanceRule(rule.id)}>Delete</AlertDialogAction>
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
                </TabsContent>
            </Tabs>

            <Dialog open={isStructureDialogOpen} onOpenChange={handleCloseStructureDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingStructure ? 'Edit' : 'Add'} Salary Structure</DialogTitle>
                        <DialogDescription>Define the base salary steps for a job grade.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Base Salary</CardTitle>
                            </CardHeader>
                            <CardContent className='grid md:grid-cols-2 gap-4'>
                                <div className="grid gap-2">
                                    <Label>Job Grade</Label>
                                    <Select value={formState.jobGrade || ''} onValueChange={v => handleFormChange('jobGrade', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {masterData.jobGrades.map((g: any) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Effective From</Label>
                                    <Input type="date" value={formState.effectiveDate || ''} onChange={e => handleFormChange('effectiveDate', e.target.value)} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="status" checked={formState.status === 'active'} onCheckedChange={c => handleFormChange('status', c ? 'active' : 'inactive')} />
                                    <Label htmlFor="status">Active</Label>
                                </div>
                                <div className="md:col-span-2 grid gap-4">
                                    <Label>Salary Steps</Label>
                                    {formState.steps?.map((step: any, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Label className="w-16">Step {step.step}</Label>
                                            <Input type="number" placeholder="Base Salary" value={step.salary || ''} onChange={e => handleStepChange(index, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeStep(index)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={addStep}>Add Step</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost" onClick={handleCloseStructureDialog}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveStructure}>Save Structure</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isAllowanceRuleDialogOpen} onOpenChange={handleCloseAllowanceRuleDialog}>
                 <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingAllowanceRule ? 'Edit' : 'Create'} Allowance Rule</DialogTitle>
                    </DialogHeader>
                    <AllowanceRuleForm 
                        masterData={masterData} 
                        onSave={handleSaveAllowanceRule}
                        onCancel={handleCloseAllowanceRuleDialog}
                        initialData={editingAllowanceRule} 
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isConflictAlertOpen} onOpenChange={setConflictAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Conflict Detected</AlertDialogTitle>
                    <AlertDialogDescription>
                        An active salary structure for this job grade and effective date already exists. Please set the existing one to inactive or choose a different job grade/date to avoid conflicts.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setConflictAlertOpen(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SalaryStructurePage;

    


    


