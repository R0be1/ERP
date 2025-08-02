
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { masterData as initialMasterData, setMasterData, getMasterData } from "@/lib/master-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search, Trash2, Edit, ArrowLeft, ChevronsUpDown, Check } from "lucide-react";
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

type MasterDataCategoryKey = keyof typeof initialMasterData;

const dataCategoryDetails: { [key: string]: { title: string, fields: { key: string, label: string, type: 'text' | 'number' | 'select' | 'hardcoded-select', options?: MasterDataCategoryKey | {value: string, label: string}[] }[] } } = {
    departments: { title: 'Departments', fields: [
        { key: 'label', label: 'Department Name', type: 'text' },
        { key: 'type', label: 'Department Type', type: 'select', options: 'departmentTypes' },
        { key: 'branchGrade', label: 'Branch Grade', type: 'select', options: 'branchGrades' },
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
        setMasterDataState(getMasterData());
    }, []);

    const categoryInfo = dataCategoryDetails[slug] || { title: "Master Data", fields: [{ key: 'label', label: 'Name', type: 'text' }] };
    const categoryData = useMemo(() => masterData[slug] || [], [masterData, slug]);

    const filteredData = categoryData.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFormChange = (key: string, value: string) => {
        setFormState((prev: any) => ({ ...prev, [key]: value }));
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
            const newId = String(Date.now()); // Using timestamp for unique ID
            updatedData.push({ ...formState, value: newId });
        }
        
        const newMasterData = { ...masterData, [slug]: updatedData };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
        
        handleCloseDialog();
    };

    const handleDelete = (value: string) => {
        const updatedData = categoryData.filter(item => item.value !== value);
        const newMasterData = { ...masterData, [slug]: updatedData };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    };
    
    const handleOpenDialog = (item: any | null = null) => {
        setEditingItem(item);
        if (item) {
            setFormState(item);
        } else {
            const newId = String(categoryData.length + 1).padStart(3, '0');
            const initialFormState = categoryInfo.fields.reduce((acc, field) => {
                acc[field.key] = '';
                return acc;
            }, { value: newId });
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
        const field = categoryInfo.fields.find(f => f.key === fieldKey);
        if (field?.type === 'select' && field.options && typeof field.options === 'string') {
            const optionSet = masterData[field.options as MasterDataCategoryKey] || [];
            const option = optionSet.find(o => o.value === item[fieldKey]);
            return option ? option.label : item[fieldKey];
        }
        return item[fieldKey];
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

    if (!slug || !categoryData) {
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
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? `Edit ${categoryInfo.title}` : `Add New ${categoryInfo.title}`}</DialogTitle>
                            </DialogHeader>
                            <div className="grid md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                                {categoryInfo.fields.map(field => {
                                    if (slug === 'departments' && field.key === 'branchGrade' && formState.type !== 'branch') {
                                        return null;
                                    }
                                    return (
                                    <div className="grid gap-2" key={field.key}>
                                        <Label htmlFor={field.key}>{field.label}</Label>
                                        {field.type === 'text' && (
                                            <Input id={field.key} value={formState[field.key] || ''} onChange={(e) => handleFormChange(field.key, e.target.value)} />
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
                                    </div>
                                )})}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost" onClick={handleCloseDialog}>Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleSave}>Save</Button>
                            </DialogFooter>
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
                                <TableHead>ID</TableHead>
                                {categoryInfo.fields.map(field => (
                                    <TableHead key={field.key}>{field.label}</TableHead>
                                ))}
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow key={item.value}>
                                    <TableCell className="font-mono">{item.value}</TableCell>
                                    {categoryInfo.fields.map(field => (
                                        <TableCell key={field.key}>{getDisplayValue(item, field.key)}</TableCell>
                                    ))}
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
