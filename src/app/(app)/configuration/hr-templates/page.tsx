

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

const personnelActionTypes = [
    { value: "Promotion", label: "Promotion" },
    { value: "Demotion", label: "Demotion" },
    { value: "Acting Assignment", label: "Acting Assignment" },
    { value: "Transfer", label: "Transfer" },
    { value: "Lateral Transfer", label: "Lateral Transfer" },
    { value: "Disciplinary Case", label: "Disciplinary Case" },
];

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

export default function HRTemplatesPage() {
    const [isClient, setIsClient] = useState(false);
    const [masterData, setMasterDataState] = useState(getMasterData());
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

    useEffect(() => {
        setIsClient(true);
        const data = getMasterData();
        setMasterDataState(data);
    }, []);

    const hrTemplates = useMemo(() => masterData.hrTemplates || [], [masterData]);

    const handleOpenDialog = (template: any | null = null) => {
        setEditingTemplate(template);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
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
        handleCloseDialog();
    };

    const handleDeleteTemplate = (id: string) => {
        const updatedTemplates = hrTemplates.filter((t: any) => t.id !== id);
        const newMasterData = { ...masterData, hrTemplates: updatedTemplates };
        setMasterData(newMasterData);
        setMasterDataState(newMasterData);
    };

    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">HR Template Management</h1>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Personnel Action Memo Templates</CardTitle>
                            <CardDescription>Manage reusable templates for official HR communications.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Template</Button>
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
                                                <DropdownMenuItem onSelect={() => handleOpenDialog(template)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
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

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingTemplate ? 'Edit' : 'Create'} Memo Template</DialogTitle>
                        <DialogDescription>Design the content for this HR memo. Use placeholders for dynamic data.</DialogDescription>
                    </DialogHeader>
                    <TemplateForm
                        onSave={handleSaveTemplate}
                        onCancel={handleCloseDialog}
                        initialData={editingTemplate}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
