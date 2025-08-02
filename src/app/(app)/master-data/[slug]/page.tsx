
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { masterData as initialMasterData, setMasterData, getMasterData } from "@/lib/master-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search, Trash2, Edit, ArrowLeft, ChevronsUpDown, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type MasterDataCategoryKey = keyof typeof initialMasterData;

const dataCategoryDetails: { [key: string]: { title: string, fields: { key: string, label: string, type: 'text' | 'number' | 'select' | 'hardcoded-select' | 'checkbox' | 'multi-select' | 'textarea', options?: MasterDataCategoryKey | {value: string, label: string}[], dependsOn?: string, dependsValue?: any }[] } } = {
    departments: { title: 'Departments', fields: [
        { key: 'label', label: 'Department Name', type: 'text' },
        { key: 'type', label: 'Department Type', type: 'select', options: 'departmentTypes' },
        { key: 'branchGrade', label: 'Branch Grade', type: 'select', options: 'branchGrades', dependsOn: 'type', dependsValue: 'branch' },
        { key: 'parent', label: 'Parent Department', type: 'select', options: 'departments' },
        { key: 'capacity', label: 'Max Staff Capacity', type: 'number' },
        { key: 'region', label: 'Region', type: 'select', options: 'regions' },
        { key: 'location', label: 'Work Location', type: 'select', options: 'workLocations' },
    ]},
    departmentTypes: { title: 'Department Types', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    workLocations: { title: 'Work Locations', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    jobTitles: { title: 'Job Titles', fields: [
        { key: 'label', label: 'Name', type: 'text' },
        { key: 'jobCategory', label: 'Job Category', type: 'select', options: 'jobCategories' },
        { key: 'jobGrade', label: 'Job Grade', type: 'select', options: 'jobGrades' },
        { key: 'isHeadOfDepartment', label: 'Head of Department', type: 'checkbox', dependsOn: 'jobCategory', dependsValue: 'managerial'},
        { key: 'managesDepartmentType', label: 'Assign by Department Type', type: 'select', options: 'departmentTypes', dependsOn: 'isHeadOfDepartment', dependsValue: true},
        { key: 'managedDepartments', label: 'Manages Specific Departments', type: 'multi-select', options: 'departments', dependsOn: 'isHeadOfDepartment', dependsValue: true },
    ]},
    jobCategories: { title: 'Job Categories', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    jobGrades: { title: 'Job Grades', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    branchGrades: { title: 'Branch Grades', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    employmentTypes: { title: 'Employment Types', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    regions: { title: 'Regions', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    fieldsOfStudy: { title: 'Fields of Study', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    institutions: { title: 'Institutions', fields: [
        { key: 'label', label: 'Name', type: 'text' },
        { key: 'institutionType', label: 'Institution Type', type: 'hardcoded-select', options: [{value: 'Government', label: 'Government'}, {value: 'Private', label: 'Private'}] }
    ]},
    educationAwards: { title: 'Education Awards', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    programTypes: { title: 'Program Types', fields: [{ key: 'label', label: 'Name', type: 'text' }] },
    allowanceTypes: { title: 'Allowance Types', fields: [
        { key: 'label', label: 'Allowance Name', type: 'text'},
        { key: 'description', label: 'Description', type: 'textarea'},
        { key: 'isTaxable', label: 'Is Taxable', type: 'checkbox'},
    ]},
};

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

const MultiSelectCombobox = ({ items, selected, onChange, placeholder, disabled = false }: { items: {value: string, label: string}[], selected: string[], onChange: (selected: string[]) => void, placeholder: string, disabled?: boolean }) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

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
                <div className={cn("flex flex-wrap gap-1 items-center rounded-md border border-input min-h-10 p-1 cursor-text", disabled && "cursor-not-allowed opacity-50 bg-muted")}>
                    {selectedItems.map(item => (
                        <Badge key={item.value} variant="secondary" className="flex items-center gap-1">
                            {item.label}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnselect(item.value);
                                }}
                                className="rounded-full hover:bg-muted-foreground/20"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    <span className="text-muted-foreground text-sm flex-1 ml-1">
                        {selectedItems.length === 0 ? placeholder : ''}
                    </span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput 
                        placeholder="Search..." 
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
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


const AllowanceEntitlementForm = ({ masterData, onSave, onCancel, initialData, isEditMode }: any) => {
    const defaultRule = { isEnabled: false, basis: 'fixed', value: '0', appliesTo: [] };
    const getInitialFormState = () => {
        if (initialData && initialData.value) { // Check if it's an existing item
            return {
                label: initialData.label || '',
                description: initialData.description || '',
                isTaxable: initialData.isTaxable || false,
                jobTitleRule: initialData.jobTitleRule || defaultRule,
                jobGradeRule: initialData.jobGradeRule || defaultRule,
                jobCategoryRule: initialData.jobCategoryRule || defaultRule,
                departmentTypeRule: initialData.departmentTypeRule || defaultRule,
            };
        }
        // For new items
        return {
            label: '',
            description: '',
            isTaxable: false,
            jobTitleRule: defaultRule,
            jobGradeRule: defaultRule,
            jobCategoryRule: defaultRule,
            departmentTypeRule: defaultRule,
        };
    };

    const [formState, setFormState] = useState(getInitialFormState);
    
    useEffect(() => {
        setFormState(getInitialFormState());
    }, [initialData]);

    const handleRuleChange = (ruleName: string, field: string, value: any) => {
        setFormState((prev: any) => ({
            ...prev,
            [ruleName]: { ...prev[ruleName], [field]: value }
        }));
    };

    const getRuleConfig = (ruleName: string) => {
        switch(ruleName) {
            case 'jobTitleRule': return { label: 'Job Title Based', options: masterData.jobTitles };
            case 'jobGradeRule': return { label: 'Job Grade Based', options: masterData.jobGrades };
            case 'jobCategoryRule': return { label: 'Job Category Based', options: masterData.jobCategories };
            case 'departmentTypeRule': return { label: 'Department Type Based', options: masterData.departmentTypes };
            default: return { label: 'Rule', options: [] };
        }
    };
    
    return (
        <>
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Allowance Name</Label>
                        <Input value={formState.label || ''} onChange={(e) => setFormState({...formState, label: e.target.value})} disabled={isEditMode}/>
                    </div>
                    <div className="grid gap-2">
                         <Label>Description</Label>
                        <Input value={formState.description || ''} onChange={(e) => setFormState({...formState, description: e.target.value})} />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Switch id="isTaxable" checked={formState.isTaxable || false} onCheckedChange={(c) => setFormState({...formState, isTaxable: c})} />
                        <Label htmlFor="isTaxable">Is Taxable</Label>
                    </div>
                </div>
                
                {['jobTitleRule', 'jobGradeRule', 'jobCategoryRule', 'departmentTypeRule'].map(ruleName => {
                    const ruleConfig = getRuleConfig(ruleName);
                    const ruleData = formState[ruleName] || defaultRule;

                    return (
                        <Card key={ruleName}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {ruleConfig.label}
                                    <Switch
                                        checked={ruleData.isEnabled}
                                        onCheckedChange={(c) => handleRuleChange(ruleName, 'isEnabled', c)}
                                    />
                                </CardTitle>
                            </CardHeader>
                            {ruleData.isEnabled && (
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label>Applies To</Label>
                                        <MultiSelectCombobox
                                            items={ruleConfig.options}
                                            selected={ruleData.appliesTo || []}
                                            onChange={(v) => handleRuleChange(ruleName, 'appliesTo', v)}
                                            placeholder={`Select ${ruleConfig.label.replace(' Based', 's')}...`}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>Basis</Label>
                                            <Select value={ruleData.basis} onValueChange={v => handleRuleChange(ruleName, 'basis', v)}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                    <SelectItem value="percentage">% of Basic Salary</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Value</Label>
                                            <Input type="number" value={ruleData.value} onChange={e => handleRuleChange(ruleName, 'value', e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                </DialogClose>
                <Button onClick={() => onSave(formState)}>Save</Button>
            </DialogFooter>
        </>
    );
};


export default function MasterDataManagementPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as MasterDataCategoryKey;

    const [masterData, setMasterDataState] = useState(initialMasterData);
    const [isClient, setIsClient] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formState, setFormState] = useState<any>({});

    useEffect(() => {
        setIsClient(true);
        const data = getMasterData();
        setMasterDataState(data);
    }, []);

    const categoryInfo = dataCategoryDetails[slug] || { title: "Master Data", fields: [{ key: 'label', label: 'Name', type: 'text' }] };
    const categoryData = useMemo(() => masterData[slug] || [], [masterData, slug]);

    const filteredData = categoryData.filter((item: any) =>
        item.label && item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
     
    useEffect(() => {
        if (slug === 'jobTitles' && formState.managesDepartmentType) {
            const departmentsToSelect = masterData.departments
                .filter(d => d.type === formState.managesDepartmentType)
                .map(d => d.value);
            setFormState((prev: any) => ({ ...prev, managedDepartments: departmentsToSelect }));
        }
    }, [formState.managesDepartmentType, masterData.departments, slug]);

    const handleFormChange = (key: string, value: any) => {
        setFormState((prev: any) => ({ ...prev, [key]: value }));
        
        if (key === 'managesDepartmentType') {
            if (value) {
                const departmentsToSelect = masterData.departments
                    .filter(d => d.type === value)
                    .map(d => d.value);
                setFormState((prev: any) => ({ ...prev, managedDepartments: departmentsToSelect }));
            } else {
                 setFormState((prev: any) => ({ ...prev, managedDepartments: [] }));
            }
        }
    };

    const handleSave = () => {
        let updatedData = [...categoryData];
        if (editingItem) {
            // Edit
            const index = updatedData.findIndex(item => item.value === editingItem.value);
            if (index > -1) {
                updatedData[index] = { ...updatedData[index], ...formState };
            }
        } else {
            // Add
            const existingValues = updatedData.map(item => parseInt(item.value, 10)).filter(v => !isNaN(v));
            const newId = existingValues.length > 0 ? String(Math.max(...existingValues) + 1).padStart(3, '0') : '001';
            const newValue = slug === 'allowanceTypes' ? formState.label.toLowerCase().replace(/\s/g, '-') : newId;
            updatedData.push({ ...formState, value: newValue });
        }
        
        const newMasterData = { ...masterData, [slug]: updatedData };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
        
        handleCloseDialog();
    };

    const handleDelete = (value: string) => {
        const updatedData = categoryData.filter((item: any) => item.value !== value);
        const newMasterData = { ...masterData, [slug]: updatedData };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    };
    
    const handleOpenDialog = (item: any | null = null) => {
        setEditingItem(item);
        if (item) {
            setFormState(item);
        } else {
            const initialFormState = categoryInfo.fields.reduce((acc: any, field) => {
                if (field.type === 'checkbox') {
                    acc[field.key] = false;
                } else if (field.type === 'multi-select'){
                    acc[field.key] = [];
                } else {
                    acc[field.key] = '';
                }
                return acc;
            }, {});
             if (slug === 'allowanceTypes') {
                initialFormState.jobTitleRule = { isEnabled: false, basis: 'fixed', value: '0', appliesTo: [] };
                initialFormState.jobGradeRule = { isEnabled: false, basis: 'fixed', value: '0', appliesTo: [] };
                initialFormState.jobCategoryRule = { isEnabled: false, basis: 'fixed', value: '0', appliesTo: [] };
                initialFormState.departmentTypeRule = { isEnabled: false, basis: 'fixed', value: '0', appliesTo: [] };
            }
            setFormState(initialFormState);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingItem(null);
        setFormState({});
    };

    const getDisplayValue = (item: any, fieldKey: string) => {
        if (!item) return '';
        const field = categoryInfo.fields.find(f => f.key === fieldKey);

        const value = item[fieldKey];

        if (field?.type === 'select' && field.options && typeof field.options === 'string') {
            const optionSet = masterData[field.options as MasterDataCategoryKey] || [];
            const option = optionSet.find((o: any) => o.value === value);
            return option ? option.label : value;
        }
        if (field?.type === 'multi-select' && field.options && typeof field.options === 'string') {
            const optionSet = masterData[field.options as MasterDataCategoryKey] || [];
            const selectedOptions = value || [];
            if (selectedOptions.length > 2) {
                return `${selectedOptions.length} departments selected`;
            }
            return selectedOptions.map((val: string) => optionSet.find((o:any) => o.value === val)?.label).filter(Boolean).join(', ');
        }
        if (field?.type === 'checkbox') {
            return value ? 'Yes' : 'No';
        }
        if(field?.type === 'hardcoded-select' && Array.isArray(field.options)) {
            const option = field.options.find(o => o.value === value);
            return option ? option.label : value;
        }
        return value;
    }

    if (!isClient) {
        return (
             <div className="flex flex-col gap-4">
                 <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2 w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Configuration
                </Button>
                <div>Loading...</div>
             </div>
        )
    }

    if (!slug || !categoryInfo) {
        return (
             <div className="flex flex-col gap-4">
                 <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2 w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Configuration
                </Button>
                <div>Loading or invalid category...</div>
             </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
             <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2 w-fit -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Configuration
            </Button>
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Manage {categoryInfo.title}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                           <Button size="sm" onClick={() => handleOpenDialog()}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? `Edit ${categoryInfo.title}` : `Add New ${categoryInfo.title}`}</DialogTitle>
                            </DialogHeader>
                            {slug === 'allowanceTypes' ? (
                                <AllowanceEntitlementForm 
                                    masterData={masterData}
                                    onSave={handleSave}
                                    onCancel={handleCloseDialog}
                                    initialData={formState}
                                    isEditMode={!!editingItem}
                                />
                            ) : (
                                <>
                                <div className="grid md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                                    {categoryInfo.fields.map(field => {
                                        const { dependsOn, dependsValue } = field;
                                        if (dependsOn && formState[dependsOn] !== dependsValue) {
                                            return null;
                                        }
                                        
                                        const isDisabled = field.dependsOn && slug === 'jobTitles' && field.key === 'isHeadOfDepartment' && formState[field.dependsOn] !== 'managerial';
                                        
                                        return (
                                        <div className={cn("grid gap-2", (field.type === 'checkbox' || field.type === 'textarea' || (field.key === 'managedDepartments') || (field.key === 'managesDepartmentType') ) ? 'md:col-span-2' : '')} key={field.key}>
                                            <Label htmlFor={field.key}>{field.label}</Label>
                                            {field.type === 'text' && (
                                                <Input id={field.key} value={formState[field.key] || ''} onChange={(e) => handleFormChange(field.key, e.target.value)} />
                                            )}
                                            {field.type === 'textarea' && (
                                                <Textarea id={field.key} value={formState[field.key] || ''} onChange={(e) => handleFormChange(field.key, e.target.value)} />
                                            )}
                                            {field.type === 'number' && (
                                                <Input id={field.key} type="number" value={formState[field.key] || ''} onChange={(e) => handleFormChange(field.key, e.target.value)} />
                                            )}
                                            {field.type === 'select' && field.options && typeof field.options === 'string' && (
                                                <Combobox 
                                                    items={masterData[field.options as MasterDataCategoryKey] || []}
                                                    value={formState[field.key] || ''}
                                                    onChange={(value) => handleFormChange(field.key, value)}
                                                    placeholder={`Select ${field.label}...`}
                                                />
                                            )}
                                            {field.type === 'multi-select' && field.options && typeof field.options === 'string' && (
                                                <MultiSelectCombobox
                                                    items={masterData[field.options as MasterDataCategoryKey] || []}
                                                    selected={formState[field.key] || []}
                                                    onChange={(value) => handleFormChange(field.key, value)}
                                                    placeholder={`Select ${field.label}...`}
                                                    disabled={!!formState['managesDepartmentType']}
                                                />
                                            )}
                                            {field.type === 'hardcoded-select' && Array.isArray(field.options) && (
                                                 <Select onValueChange={(value) => handleFormChange(field.key, value)} value={formState[field.key] || ''}>
                                                    <SelectTrigger><SelectValue placeholder={`Select ${field.label}...`} /></SelectTrigger>
                                                    <SelectContent>
                                                        {(field.options as {value: string, label: string}[]).map(opt => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {field.type === 'checkbox' && (
                                                 <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={field.key}
                                                        checked={formState[field.key] || false}
                                                        onCheckedChange={(checked) => handleFormChange(field.key, !!checked)}
                                                        disabled={isDisabled}
                                                    />
                                                    <label
                                                        htmlFor={field.key}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {field.label}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )})}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="ghost" onClick={handleCloseDialog}>Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleSave}>Save</Button>
                                </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${categoryInfo.title}...`}
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
                                {slug !== 'allowanceTypes' && <TableHead>ID</TableHead>}
                                {categoryInfo.fields.map(field => {
                                     if (field.type === 'multi-select') return <TableHead key={field.key}>{field.label}</TableHead>;
                                     if (field.type === 'checkbox' && slug === 'jobTitles' && field.key === 'isHeadOfDepartment') return null; // Hide checkbox column
                                     return <TableHead key={field.key}>{field.label}</TableHead>
                                })}
                                {slug === 'allowanceTypes' && <TableHead>Active Rules</TableHead>}
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow key={item.value}>
                                    {slug !== 'allowanceTypes' && <TableCell className="font-mono text-xs">{item.value}</TableCell>}
                                    {categoryInfo.fields.map(field => {
                                         if (field.type === 'checkbox' && slug === 'jobTitles' && field.key === 'isHeadOfDepartment') return null;
                                        return <TableCell key={field.key}>{getDisplayValue(item, field.key)}</TableCell>
                                    })}
                                    {slug === 'allowanceTypes' && (
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {item.jobTitleRule?.isEnabled && <Badge variant="outline">Job Title</Badge>}
                                                {item.jobGradeRule?.isEnabled && <Badge variant="outline">Job Grade</Badge>}
                                                {item.jobCategoryRule?.isEnabled && <Badge variant="outline">Job Category</Badge>}
                                                {item.departmentTypeRule?.isEnabled && <Badge variant="outline">Department</Badge>}
                                            </div>
                                        </TableCell>
                                    )}
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
                                                <DropdownMenuItem onSelect={() => handleOpenDialog(item)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem 
                                                          className="text-red-600"
                                                          onSelect={(e) => e.preventDefault()}
                                                        >
                                                           <Trash2 className="mr-2 h-4 w-4" />
                                                           Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the record.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(item.value)}>
                                                                Continue
                                                            </AlertDialogAction>
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
    );
}

    

    