

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreHorizontal, PlusCircle, Trash2, Edit, X, Check, ChevronsUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { getMasterData, setMasterData } from '@/lib/master-data';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const personnelActionTypes = [
    { value: "Promotion", label: "Promotion" },
    { value: "Demotion", label: "Demotion" },
    { value: "Acting Assignment", label: "Acting Assignment" },
    { value: "Transfer", label: "Transfer" },
    { value: "Lateral Transfer", label: "Lateral Transfer" },
    { value: "Disciplinary Case", label: "Disciplinary Case" },
];

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
                <div role="combobox" aria-expanded={open} className={cn("flex flex-wrap gap-1 items-center rounded-md border border-input min-h-10 p-1 w-full text-left bg-background", disabled ? "cursor-not-allowed opacity-50 bg-muted" : "cursor-pointer")} onClick={() => !disabled && setOpen(!open)}>
                    {selectedItems.map(item => (
                        <Badge key={item.value} variant="secondary" className="flex items-center gap-1">
                            {item.label}
                            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUnselect(item.value); }} onClick={(e) => { e.stopPropagation(); handleUnselect(item.value); }} className="rounded-full hover:bg-muted-foreground/20 focus:ring-2 focus:ring-ring">
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
                                <CommandItem key={item.value} onSelect={() => handleSelect(item.value)}>
                                    <Check className={cn("mr-2 h-4 w-4", selected.includes(item.value) ? "opacity-100" : "opacity-0")} />
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

const TemplateForm = ({ onSave, onCancel, initialData }: { onSave: (template: any) => void, onCancel: () => void, initialData: any | null }) => {
    const initialFormState = {
        id: '',
        name: '',
        actionType: '',
        content: '',
        status: 'active',
    };
    const [template, setTemplate] = useState(initialData ? { ...initialFormState, ...initialData } : initialFormState);

    const handleFieldChange = (field: string, value: any) => {
        setTemplate(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" value={template.name} onChange={e => handleFieldChange('name', e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="actionType">Action Type</Label>
                    <Select value={template.actionType} onValueChange={v => handleFieldChange('actionType', v)}>
                        <SelectTrigger id="actionType"><SelectValue placeholder="Select an action type..." /></SelectTrigger>
                        <SelectContent>
                            {personnelActionTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="content">Template Content</Label>
                    <Textarea id="content" value={template.content} onChange={e => handleFieldChange('content', e.target.value)} rows={12} />
                    <p className="text-xs text-muted-foreground">
                        Use placeholders like {'\'{{employeeName}}\''}, {'\'{{newPosition}}\''}, {'\'{{effectiveDate}}\''}, etc.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="status" checked={template.status === 'active'} onCheckedChange={c => handleFieldChange('status', c ? 'active' : 'inactive')} />
                    <Label htmlFor="status">{template.status === 'active' ? 'Active' : 'Inactive'}</Label>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button></DialogClose>
                <Button onClick={() => onSave(template)}>Save Template</Button>
            </DialogFooter>
        </>
    );
};

const CarbonCopyRuleForm = ({ masterData, onSave, onCancel, initialData }: { masterData: any, onSave: (rule: any) => void, onCancel: () => void, initialData: any | null }) => {
    const initialFormState = {
        id: '',
        name: '',
        actionTypes: [],
        jobCategories: [],
        jobTitles: [],
        ccDepartments: [],
        ccFreeText: '',
        status: 'active',
        startDate: '',
        endDate: '',
    };
    const [rule, setRule] = useState(initialData ? { ...initialFormState, ...initialData } : initialFormState);
    const { toast } = useToast();
    
    const handleFieldChange = (field: string, value: any) => {
        setRule(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!rule.name || rule.actionTypes.length === 0) {
             toast({ variant: "destructive", title: "Missing Fields", description: "Please provide a rule name and at least one action type." });
             return;
        }
        onSave(rule);
    }
    
    return (
        <>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Rule Name</Label>
                    <Input id="name" value={rule.name} onChange={e => handleFieldChange('name', e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label>Action Type(s)</Label>
                    <MultiSelectCombobox items={personnelActionTypes} selected={rule.actionTypes || []} onChange={v => handleFieldChange('actionTypes', v)} placeholder="Select action types..." />
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Job Category/Categories (Optional)</Label>
                        <MultiSelectCombobox items={masterData.jobCategories} selected={rule.jobCategories || []} onChange={v => handleFieldChange('jobCategories', v)} placeholder="Select job categories..." />
                    </div>
                     <div className="grid gap-2">
                        <Label>Job Title(s) (Optional)</Label>
                        <MultiSelectCombobox items={masterData.jobTitles} selected={rule.jobTitles || []} onChange={v => handleFieldChange('jobTitles', v)} placeholder="Select job titles..." />
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label>CC Departments</Label>
                    <MultiSelectCombobox items={masterData.departments} selected={rule.ccDepartments || []} onChange={v => handleFieldChange('ccDepartments', v)} placeholder="Select departments..." />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="ccFreeText">CC Free-Text (Optional)</Label>
                    <Input id="ccFreeText" value={rule.ccFreeText} onChange={e => handleFieldChange('ccFreeText', e.target.value)} placeholder="e.g., 'CEO Office', 'Legal Team'"/>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startDate">Effective Start Date</Label>
                        <Input id="startDate" type="date" value={rule.startDate} onChange={e => handleFieldChange('startDate', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="endDate">Effective End Date (Optional)</Label>
                        <Input id="endDate" type="date" value={rule.endDate} onChange={e => handleFieldChange('endDate', e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="status" checked={rule.status === 'active'} onCheckedChange={c => handleFieldChange('status', c ? 'active' : 'inactive')} />
                    <Label htmlFor="status">{rule.status === 'active' ? 'Active' : 'Inactive'}</Label>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button></DialogClose>
                <Button onClick={handleSubmit}>Save Rule</Button>
            </DialogFooter>
        </>
    );
};

export default function HRTemplatesPage() {
    const [isClient, setIsClient] = useState(false);
    const [masterData, setMasterDataState] = useState(getMasterData());
    
    // For Templates
    const [isTemplateDialogOpen, setTemplateDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

    // For CC Rules
    const [isCcRuleDialogOpen, setCcRuleDialogOpen] = useState(false);
    const [editingCcRule, setEditingCcRule] = useState<any | null>(null);

    useEffect(() => {
        setIsClient(true);
        const data = getMasterData();
        setMasterDataState(data);
    }, []);

    const hrTemplates = useMemo(() => masterData.hrTemplates || [], [masterData]);
    const carbonCopyRules = useMemo(() => masterData.carbonCopyRules || [], [masterData]);

    const handleOpenTemplateDialog = (template: any | null = null) => {
        setEditingTemplate(template);
        setTemplateDialogOpen(true);
    };

    const handleCloseTemplateDialog = () => {
        setTemplateDialogOpen(false);
        setEditingTemplate(null);
    };

    const handleSaveTemplate = (templateData: any) => {
        let updatedTemplates = [...hrTemplates];
        if (editingTemplate) {
            const index = updatedTemplates.findIndex(t => t.id === (editingTemplate as any).id);
            if (index > -1) updatedTemplates[index] = templateData;
        } else {
            updatedTemplates.push({ ...templateData, id: `HRT${Date.now()}` });
        }
        const newMasterData = { ...masterData, hrTemplates: updatedTemplates };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
        handleCloseTemplateDialog();
    };

    const handleDeleteTemplate = (id: string) => {
        const updatedTemplates = hrTemplates.filter((t: any) => t.id !== id);
        const newMasterData = { ...masterData, hrTemplates: updatedTemplates };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    };

    const handleOpenCcRuleDialog = (rule: any | null = null) => {
        setEditingCcRule(rule);
        setCcRuleDialogOpen(true);
    };

    const handleCloseCcRuleDialog = () => {
        setEditingCcRule(null);
        setCcRuleDialogOpen(false);
    };
    
    const handleSaveCcRule = (ruleData: any) => {
        let updatedRules = [...carbonCopyRules];
        if (editingCcRule) {
            const index = updatedRules.findIndex(r => r.id === (editingCcRule as any).id);
            if (index > -1) updatedRules[index] = ruleData;
        } else {
            updatedRules.push({ ...ruleData, id: `CCR${Date.now()}` });
        }
        const newMasterData = { ...masterData, carbonCopyRules: updatedRules };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
        handleCloseCcRuleDialog();
    };
    
    const handleDeleteCcRule = (id: string) => {
        const updatedRules = carbonCopyRules.filter((r: any) => r.id !== id);
        const newMasterData = { ...masterData, carbonCopyRules: updatedRules };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    };

    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">HR Document Management</h1>
            <Tabs defaultValue="templates">
                <TabsList>
                    <TabsTrigger value="templates">Memo Templates</TabsTrigger>
                    <TabsTrigger value="cc-rules">Carbon Copy Rules</TabsTrigger>
                </TabsList>
                <TabsContent value="templates">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Personnel Action Memo Templates</CardTitle>
                                    <CardDescription>Manage reusable templates for official HR communications.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenTemplateDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Template</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Template Name</TableHead>
                                        <TableHead>Action Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hrTemplates.map((template: any) => (
                                        <TableRow key={template.id}>
                                            <TableCell className="font-medium">{template.name}</TableCell>
                                            <TableCell>{template.actionType}</TableCell>
                                            <TableCell><Badge variant={template.status === 'active' ? 'secondary' : 'outline'}>{template.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => handleOpenTemplateDialog(template)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                                                <AlertDialogDescription>This will permanently delete this template.</AlertDialogDescription>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteTemplate(template.id)}>Delete</AlertDialogAction>
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
                <TabsContent value="cc-rules">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Memo Carbon Copy (CC) Rules</CardTitle>
                                    <CardDescription>Manage rules for who gets CC'd on personnel action memos.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenCcRuleDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add CC Rule</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Rule Name</TableHead>
                                        <TableHead>Action Type(s)</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {carbonCopyRules.map((rule: any) => (
                                        <TableRow key={rule.id}>
                                            <TableCell className="font-medium">{rule.name}</TableCell>
                                            <TableCell>{(rule.actionTypes || []).join(', ')}</TableCell>
                                            <TableCell><Badge variant={rule.status === 'active' ? 'secondary' : 'outline'}>{rule.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => handleOpenCcRuleDialog(rule)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild><DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                                                <AlertDialogDescription>This will permanently delete this CC rule.</AlertDialogDescription>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteCcRule(rule.id)}>Delete</AlertDialogAction>
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
            

            <Dialog open={isTemplateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingTemplate ? 'Edit' : 'Create'} Memo Template</DialogTitle>
                        <DialogDescription>Design the content for this HR memo. Use placeholders for dynamic data.</DialogDescription>
                    </DialogHeader>
                    <TemplateForm
                        onSave={handleSaveTemplate}
                        onCancel={handleCloseTemplateDialog}
                        initialData={editingTemplate}
                    />
                </DialogContent>
            </Dialog>

             <Dialog open={isCcRuleDialogOpen} onOpenChange={handleCloseCcRuleDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingCcRule ? 'Edit' : 'Create'} Carbon Copy Rule</DialogTitle>
                        <DialogDescription>Define the conditions and recipients for this CC rule.</DialogDescription>
                    </DialogHeader>
                    <CarbonCopyRuleForm
                        masterData={masterData}
                        onSave={handleSaveCcRule}
                        onCancel={handleCloseCcRuleDialog}
                        initialData={editingCcRule}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
