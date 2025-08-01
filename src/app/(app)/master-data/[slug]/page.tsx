
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { masterData as initialMasterData, setMasterData } from "@/lib/master-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search, Trash2, Edit, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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

type MasterDataCategoryKey = keyof typeof initialMasterData;

const dataCategoryDetails: { [key in MasterDataCategoryKey]?: { title: string } } = {
    departments: { title: 'Departments' },
    divisions: { title: 'Divisions / Units' },
    jobTitles: { title: 'Job Titles' },
    jobCategories: { title: 'Job Categories' },
    jobGrades: { title: 'Job Grades' },
    employmentTypes: { title: 'Employment Types' },
    regions: { title: 'Regions' },
    fieldsOfStudy: { title: 'Fields of Study' },
    institutions: { title: 'Institutions' },
    educationAwards: { title: 'Education Awards' },
    programTypes: { title: 'Program Types' },
};

export default function MasterDataManagementPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as MasterDataCategoryKey;

    const [masterData, setMasterDataState] = useState(initialMasterData);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ value: string; label: string } | null>(null);
    const [itemValue, setItemValue] = useState("");
    const [itemLabel, setItemLabel] = useState("");

    useEffect(() => {
        setMasterDataState(initialMasterData);
    }, []);

    const categoryData = masterData[slug] || [];
    const categoryInfo = dataCategoryDetails[slug] || { title: "Master Data" };

    const filteredData = categoryData.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        const updatedData = [...categoryData];
        if (editingItem) {
            // Edit
            const index = updatedData.findIndex(item => item.value === editingItem.value);
            if (index > -1) {
                updatedData[index] = { value: itemValue, label: itemLabel };
            }
        } else {
            // Add
            updatedData.push({ value: itemValue, label: itemLabel });
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
    
    const handleOpenDialog = (item: { value: string; label: string } | null = null) => {
        setEditingItem(item);
        if (item) {
            setItemValue(item.value);
            setItemLabel(item.label);
        } else {
            setItemValue("");
            setItemLabel("");
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingItem(null);
        setItemValue("");
        setItemLabel("");
    };


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
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingItem ? `Edit ${categoryInfo.title}` : `Add New ${categoryInfo.title}`}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="value">Value / ID</Label>
                                    <Input id="value" value={itemValue} onChange={(e) => setItemValue(e.target.value)} disabled={!!editingItem} />
                                </div>
                                <div className="grid gap-2">
                                     <Label htmlFor="label">Label / Name</Label>
                                    <Input id="label" value={itemLabel} onChange={(e) => setItemLabel(e.target.value)} />
                                </div>
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
                                <TableHead>Value / ID</TableHead>
                                <TableHead>Label / Name</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow key={item.value}>
                                    <TableCell className="font-mono">{item.value}</TableCell>
                                    <TableCell>{item.label}</TableCell>
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
