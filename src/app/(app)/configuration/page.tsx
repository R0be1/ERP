

"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, GitBranch, ScrollText, Settings, PlusCircle, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { masterData, setMasterData } from "@/lib/master-data";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const configAreas = [
    {
        id: "system-settings",
        icon: Settings,
        title: "System Settings",
        description: "Manage global configurations like themes, notifications, and integrations.",
        action: "Go to Settings",
    },
    {
        id: "business-rules",
        icon: ScrollText,
        title: "Business Rules",
        description: "Define and manage rules for leave policies, attendance, and compliance.",
        action: "Manage Rules",
    },
    {
        id: "workflow-management",
        icon: GitBranch,
        title: "Workflow Management",
        description: "Configure approval workflows for various HR processes.",
        action: "Configure Workflows",
    },
];

type MasterDataCategory = keyof typeof masterData;
type DataItem = { value: string; label: string };

const EditItemDialog = ({
  item,
  category,
  onSave,
  onClose,
}: {
  item: DataItem;
  category: MasterDataCategory;
  onSave: (category: MasterDataCategory, oldItem: DataItem, newItem: DataItem) => void;
  onClose: () => void;
}) => {
  const [label, setLabel] = useState(item.label);

  const handleSave = () => {
    if (label.trim()) {
      onSave(category, item, { ...item, label });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the label for this master data item.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-value" className="text-right">
              Value
            </Label>
            <Input id="item-value" value={item.value} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-label" className="text-right">
              Label
            </Label>
            <Input
              id="item-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const MasterDataSection = () => {
    const { toast } = useToast();
    const [data, setData] = useState(masterData);
    const [newItem, setNewItem] = useState<{ [key in MasterDataCategory]?: string }>({});
    const [editingItem, setEditingItem] = useState<{ category: MasterDataCategory; item: DataItem } | null>(null);

    const updateMasterData = (newData: typeof masterData) => {
        setMasterData(newData);
        setData(newData);
    };
    
    const handleAddItem = (category: MasterDataCategory) => {
        const label = newItem[category];
        if (label && label.trim()) {
            const value = label.trim().toLowerCase().replace(/\s+/g, '-');
            const currentCategoryData = data[category] as DataItem[];
            if (currentCategoryData.some(item => item.value === value)) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "This item value already exists.",
                });
                return;
            }
            const newData = { ...data, [category]: [...currentCategoryData, { value, label }] };
            updateMasterData(newData);
            setNewItem({ ...newItem, [category]: '' });
        }
    };

    const handleRemoveItem = (category: MasterDataCategory, itemToRemove: DataItem) => {
        const currentCategoryData = data[category] as DataItem[];
        const newData = { ...data, [category]: currentCategoryData.filter(item => item.value !== itemToRemove.value) };
        updateMasterData(newData);
    };
    
    const handleUpdateItem = (category: MasterDataCategory, oldItem: DataItem, updatedItem: DataItem) => {
        const currentCategoryData = data[category] as DataItem[];
        const newData = { ...data, [category]: currentCategoryData.map(item => item.value === oldItem.value ? updatedItem : item) };
        updateMasterData(newData);
        setEditingItem(null);
    };

    const handleNewItemChange = (category: MasterDataCategory, value: string) => {
        setNewItem({ ...newItem, [category]: value });
    };

    const dataCategories: { key: MasterDataCategory; title: string }[] = [
        { key: "departments", title: "Departments" },
        { key: "jobTitles", title: "Job Titles" },
        { key: "jobGrades", title: "Job Grades" },
        { key: "jobCategories", title: "Job Categories" },
        { key: "educationAwards", title: "Education Awards" },
        { key: "fieldsOfStudy", title: "Fields of Study" },
        { key: "institutions", title: "Institutions" },
        { key: "regions", title: "Regions" },
    ];
    
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-start gap-4 space-y-0">
                   <Database className="h-8 w-8 text-primary" />
                   <div className="grid gap-1">
                        <CardTitle>Master Data Management</CardTitle>
                        <CardDescription>Manage core HCM data like departments, job titles, and locations.</CardDescription>
                   </div>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {dataCategories.map(({ key, title }) => (
                         <AccordionItem value={key} key={key}>
                            <AccordionTrigger>{title}</AccordionTrigger>
                            <AccordionContent>
                                 <div className="flex flex-col gap-4 p-4 border rounded-lg">
                                    <div className="flex gap-2">
                                        <Input 
                                            placeholder={`New ${title.slice(0, -1)}...`} 
                                            value={newItem[key] || ''}
                                            onChange={(e) => handleNewItemChange(key, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(key)}
                                        />
                                        <Button size="icon" onClick={() => handleAddItem(key)}><PlusCircle className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto pr-2 flex flex-col gap-2">
                                        {(data[key] as DataItem[]).map((item) => (
                                            <div key={item.value} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                                                <span className="text-sm font-medium">{item.label}</span>
                                                <div className="flex items-center">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingItem({ category: key, item })}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemoveItem(key, item)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
            {editingItem && (
              <EditItemDialog
                item={editingItem.item}
                category={editingItem.category}
                onSave={handleUpdateItem}
                onClose={() => setEditingItem(null)}
              />
            )}
        </Card>
    );
};


export default function ConfigurationPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Configuration Module</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Platform Configuration</CardTitle>
                    <CardDescription>
                        Centralized control over system-wide settings, rules, and data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    {configAreas.map((area) => (
                        <Card key={area.id}>
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                               <area.icon className="h-8 w-8 text-primary" />
                               <div className="grid gap-1">
                                    <CardTitle>{area.title}</CardTitle>
                                    <CardDescription>{area.description}</CardDescription>
                               </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline">{area.action}</Button>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <MasterDataSection />
        </div>
    );
}
