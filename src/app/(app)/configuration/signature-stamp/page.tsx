

"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const actionTypesForMemo = [
    { value: "Promotion", label: "Promotion" },
    { value: "Demotion", label: "Demotion" },
    { value: "Acting Assignment", label: "Acting Assignment" },
    { value: "Transfer", label: "Transfer" },
    { value: "Lateral Transfer", label: "Lateral Transfer" },
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

const SignatureRuleForm = ({ masterData, onSave, onCancel, initialData, documentType }: any) => {
    const initialFormState = {
        id: '',
        documentType: documentType,
        actionTypes: [],
        jobCategories: [],
        signatoryName: '',
        signatoryTitle: '',
        signatureImage: null,
        stampImage: null,
        status: 'active',
        startDate: '',
        endDate: '',
    };
    const [rule, setRule] = useState(initialData ? { ...initialFormState, ...initialData } : initialFormState);
    const { toast } = useToast();

    const handleFieldChange = (field: string, value: any) => {
        setRule((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (field: 'signatureImage' | 'stampImage', e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({ variant: "destructive", title: "File too large", description: "Image size should not exceed 2MB." });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                handleFieldChange(field, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if ((documentType === 'memo' && rule.actionTypes.length === 0) || rule.jobCategories.length === 0 || !rule.signatoryName || !rule.signatoryTitle) {
             toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all required fields." });
             return;
        }
        onSave(rule);
    }

    return (
        <>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                {documentType === 'memo' && (
                    <div className="grid gap-2">
                        <Label>Action Type(s)</Label>
                        <MultiSelectCombobox items={actionTypesForMemo} selected={rule.actionTypes || []} onChange={v => handleFieldChange('actionTypes', v)} placeholder="Select action types..." />
                    </div>
                )}
                <div className="grid gap-2">
                    <Label>Job Category/Categories</Label>
                    <MultiSelectCombobox items={masterData.jobCategories} selected={rule.jobCategories || []} onChange={v => handleFieldChange('jobCategories', v)} placeholder="Select job categories..." />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="signatoryName">Signatory Name</Label>
                        <Input id="signatoryName" value={rule.signatoryName} onChange={e => handleFieldChange('signatoryName', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="signatoryTitle">Signatory Title/Designation</Label>
                        <Input id="signatoryTitle" value={rule.signatoryTitle} onChange={e => handleFieldChange('signatoryTitle', e.target.value)} />
                    </div>
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
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="signatureImage">Signature Image</Label>
                        <div className="flex items-center gap-4">
                            <Input id="signatureImage" type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload('signatureImage', e)} className="max-w-xs" />
                            {rule.signatureImage && <Avatar><AvatarImage src={rule.signatureImage} alt="Signature Preview" /></Avatar>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="stampImage">Stamp Image</Label>
                         <div className="flex items-center gap-4">
                            <Input id="stampImage" type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload('stampImage', e)} className="max-w-xs" />
                            {rule.stampImage && <Avatar><AvatarImage src={rule.stampImage} alt="Stamp Preview" /></Avatar>}
                        </div>
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

const RulesTable = ({ rules, masterData, onEdit, onDelete, documentType }: { rules: any[], masterData: any, onEdit: (rule: any) => void, onDelete: (id: string) => void, documentType: 'memo' | 'letter' }) => {
    
    const getJobCategoryLabels = (values: string[] = []) => {
        if (values.length > 2) return `${values.length} job categories`;
        return values.map(v => masterData.jobCategories.find((jc: any) => jc.value === v)?.label).filter(Boolean).join(', ');
    };
    
    const getActionTypeLabels = (values: string[] = []) => {
        if (values.length > 2) return `${values.length} action types`;
        return values.join(', ');
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {documentType === 'memo' && <TableHead>Action Type(s)</TableHead>}
                    <TableHead>Job Category/Categories</TableHead>
                    <TableHead>Signatory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rules.map((rule: any) => (
                    <TableRow key={rule.id}>
                        {documentType === 'memo' && <TableCell>{getActionTypeLabels(rule.actionTypes)}</TableCell>}
                        <TableCell>{getJobCategoryLabels(rule.jobCategories)}</TableCell>
                        <TableCell>
                            <div className="font-medium">{rule.signatoryName}</div>
                            <div className="text-xs text-muted-foreground">{rule.signatoryTitle}</div>
                        </TableCell>
                        <TableCell><Badge variant={rule.status === 'active' ? 'secondary' : 'outline'}>{rule.status}</Badge></TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => onEdit(rule)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                            <AlertDialogDescription>This will permanently delete this rule.</AlertDialogDescription>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => onDelete(rule.id)}>Delete</AlertDialogAction>
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
    );
};

export default function SignatureStampPage() {
    const [isClient, setIsClient] = useState(false);
    const [masterData, setMasterDataState] = useState(getMasterData());
    const [isRuleDialogOpen, setRuleDialogOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'memo' | 'letter'>('memo');

    useEffect(() => {
        setIsClient(true);
        const data = getMasterData();
        setMasterDataState(data);
    }, []);

    const signatureRules = useMemo(() => masterData.signatureRules || [], [masterData]);

    const handleOpenRuleDialog = (rule: any | null = null) => {
        setEditingRule(rule);
        setRuleDialogOpen(true);
    };

    const handleCloseRuleDialog = () => {
        setRuleDialogOpen(false);
        setEditingRule(null);
    };

    const handleSaveRule = (ruleData: any) => {
        let updatedRules = [...signatureRules];
        if (editingRule) {
            const index = updatedRules.findIndex(r => r.id === (editingRule as any).id);
            if (index > -1) updatedRules[index] = ruleData;
        } else {
            updatedRules.push({ ...ruleData, id: `SR${Date.now()}` });
        }
        const newMasterData = { ...masterData, signatureRules: updatedRules };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
        handleCloseRuleDialog();
    };

    const handleDeleteRule = (id: string) => {
        const updatedRules = signatureRules.filter((r: any) => r.id !== id);
        const newMasterData = { ...masterData, signatureRules: updatedRules };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    };
    
    const memoRules = useMemo(() => signatureRules.filter(r => r.documentType === 'memo'), [signatureRules]);
    const letterRules = useMemo(() => signatureRules.filter(r => r.documentType === 'letter'), [signatureRules]);

    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Signature & Stamp Management</h1>
            <Tabs defaultValue="memo" onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList>
                    <TabsTrigger value="memo">Personnel Action Memos</TabsTrigger>
                    <TabsTrigger value="letter">Work Experience Letters</TabsTrigger>
                </TabsList>
                <TabsContent value="memo">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Memo Signature Rules</CardTitle>
                                    <CardDescription>Rules for applying signatures/stamps to memos based on action type and job category.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenRuleDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Rule</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <RulesTable rules={memoRules} masterData={masterData} onEdit={handleOpenRuleDialog} onDelete={handleDeleteRule} documentType="memo" />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="letter">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Letter Signature Rules</CardTitle>
                                    <CardDescription>Rules for applying signatures/stamps to experience letters based on job category.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenRuleDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Rule</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <RulesTable rules={letterRules} masterData={masterData} onEdit={handleOpenRuleDialog} onDelete={handleDeleteRule} documentType="letter" />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isRuleDialogOpen} onOpenChange={handleCloseRuleDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{editingRule ? 'Edit' : 'Create'} Signature & Stamp Rule</DialogTitle>
                        <DialogDescription>Define the conditions and signatory details for this rule.</DialogDescription>
                    </DialogHeader>
                    <SignatureRuleForm
                        masterData={masterData}
                        onSave={handleSaveRule}
                        onCancel={handleCloseRuleDialog}
                        initialData={editingRule}
                        documentType={activeTab}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};
