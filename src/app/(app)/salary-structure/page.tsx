
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
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

const SalaryStructurePage = () => {
    const [isClient, setIsClient] = useState(false);
    const [masterData, setMasterDataState] = useState(getMasterData());
    const [isStructureDialogOpen, setStructureDialogOpen] = useState(false);
    const [editingStructure, setEditingStructure] = useState<any | null>(null);
    const [formState, setFormState] = useState<any>({});
    
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        const data = getMasterData();
        setMasterDataState(data);
    }, []);

    const salaryStructures = useMemo(() => masterData.salaryStructures || [], [masterData]);

    const handleOpenStructureDialog = (structure: any | null = null) => {
        setEditingStructure(structure);
        if (structure) {
            setFormState(structure);
        } else {
            setFormState({
                status: 'active',
                steps: [{ step: '1', salary: '' }],
                allowances: []
            });
        }
        setStructureDialogOpen(true);
    };

    const handleCloseStructureDialog = () => {
        setStructureDialogOpen(false);
        setEditingStructure(null);
        setFormState({});
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

    const handleAllowanceChange = (index: number, key: string, value: any) => {
        const newAllowances = [...formState.allowances];
        newAllowances[index][key] = value;
        handleFormChange('allowances', newAllowances);
    };

    const addAllowance = () => {
        const newAllowances = [...(formState.allowances || [])];
        newAllowances.push({ allowanceType: '', basis: 'fixed', value: '', taxable: false, eligibilityRule: '' });
        handleFormChange('allowances', newAllowances);
    };

    const removeAllowance = (index: number) => {
        const newAllowances = formState.allowances.filter((_: any, i: number) => i !== index);
        handleFormChange('allowances', newAllowances);
    };

    const handleSaveStructure = () => {
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

    const getJobGradeLabel = (value: string) => masterData.jobGrades.find(g => g.value === value)?.label || value;
    const getAllowanceLabel = (value: string) => masterData.allowanceTypes.find(a => a.value === value)?.label || value;

    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Salary Structure Management</h1>
            <Tabs defaultValue="structures">
                <TabsList>
                    <TabsTrigger value="structures">Salary Structures</TabsTrigger>
                    <TabsTrigger value="allowances" onClick={() => router.push('/master-data/allowanceTypes')}>Allowance Setup</TabsTrigger>
                </TabsList>
                <TabsContent value="structures">
                    <Card>
                        <CardHeader>
                            <CardTitle>Defined Salary Structures</CardTitle>
                            <CardDescription>Manage base salary scales and associated allowances.</CardDescription>
                            <Button onClick={() => handleOpenStructureDialog()} className="ml-auto">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Structure
                            </Button>
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
                                                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onSelect={() => handleOpenStructureDialog(structure)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onSelect={() => handleDeleteStructure(structure.value)}>Delete</DropdownMenuItem>
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

            <Dialog open={isStructureDialogOpen} onOpenChange={setStructureDialogOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{editingStructure ? 'Edit' : 'Add'} Salary Structure</DialogTitle>
                        <DialogDescription>Define the base salary steps and allowances for a job grade.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Base Salary</CardTitle>
                            </CardHeader>
                            <CardContent className='grid md:grid-cols-2 gap-4'>
                                <div className="grid gap-2">
                                    <Label>Job Grade</Label>
                                    <Select value={formState.jobGrade} onValueChange={v => handleFormChange('jobGrade', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {masterData.jobGrades.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Effective From</Label>
                                    <Input type="date" value={formState.effectiveDate} onChange={e => handleFormChange('effectiveDate', e.target.value)} />
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
                                            <Input type="number" placeholder="Base Salary" value={step.salary} onChange={e => handleStepChange(index, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeStep(index)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={addStep}>Add Step</Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Allowances</CardTitle>
                            </CardHeader>
                            <CardContent className='grid gap-4'>
                                {formState.allowances?.map((allowance: any, index: number) => (
                                    <div key={index} className="p-4 border rounded-md grid md:grid-cols-3 gap-4 relative">
                                        <div className="grid gap-2">
                                            <Label>Allowance Type</Label>
                                            <Select value={allowance.allowanceType} onValueChange={v => handleAllowanceChange(index, 'allowanceType', v)}>
                                                <SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger>
                                                <SelectContent>
                                                    {masterData.allowanceTypes.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Basis</Label>
                                            <Select value={allowance.basis} onValueChange={v => handleAllowanceChange(index, 'basis', v)}>
                                                <SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                    <SelectItem value="percentage">% of Base Salary</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Value</Label>
                                            <Input type="number" value={allowance.value} onChange={e => handleAllowanceChange(index, 'value', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-3 grid gap-2">
                                            <Label>Eligibility Rule (Optional)</Label>
                                            <Input placeholder="e.g., Only for managers" value={allowance.eligibilityRule} onChange={e => handleAllowanceChange(index, 'eligibilityRule', e.target.value)} />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch checked={allowance.taxable} onCheckedChange={c => handleAllowanceChange(index, 'taxable', c)} />
                                            <Label>Taxable</Label>
                                        </div>
                                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeAllowance(index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addAllowance}>Add Allowance</Button>
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
        </div>
    );
};

export default SalaryStructurePage;
