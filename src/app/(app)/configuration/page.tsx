

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Settings, GitBranch, ScrollText, Building, Briefcase, Tag, Layers, School, 
    Landmark, Map, GraduationCap, BookUser, RadioTower, Library, User, MapPin, Building2, Star, Search, DollarSign, AlertTriangle, PencilRuler, FileSignature
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { masterData as initialMasterData } from "@/lib/master-data";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const configAreas = [
    {
        id: "system-settings",
        icon: Settings,
        title: "System Settings",
        description: "Manage themes, notifications, and integrations.",
        path: "/configuration/system-settings"
    },
    {
        id: "business-rules",
        icon: ScrollText,
        title: "Business Rules",
        description: "Define policies for leave, attendance, and compliance.",
        path: "/configuration/business-rules"
    },
    {
        id: "workflow-management",
        icon: GitBranch,
        title: "Workflow Management",
        description: "Configure approval workflows for HR processes.",
        path: "/configuration/workflow-management"
    },
    {
        id: "salary-structure",
        icon: DollarSign,
        title: "Salary Structure",
        description: "Define structured salary scales and related allowances.",
        path: "/salary-structure"
    },
    {
        id: "signature-stamp",
        icon: PencilRuler,
        title: "Signature & Stamp",
        description: "Manage rules for document signatories and stamps.",
        path: "/configuration/signature-stamp"
    },
    {
        id: "hr-templates",
        icon: FileSignature,
        title: "HR Templates",
        description: "Manage templates for memos and official documents.",
        path: "/configuration/hr-templates"
    }
];

const dataCategories = [
    { key: 'departments', title: 'Departments', description: 'Manage company departments.', icon: Building },
    { key: 'departmentTypes', title: 'Department Types', description: 'Manage types of departments.', icon: Building2 },
    { key: 'workLocations', title: 'Work Locations', description: 'Manage work locations.', icon: MapPin },
    { key: 'jobTitles', title: 'Job Titles', description: 'Manage job titles and codes.', icon: Briefcase },
    { key: 'jobCategories', title: 'Job Categories', description: 'Configure job types.', icon: Layers },
    { key: 'jobGrades', title: 'Job Grades', description: 'Define grading structure.', icon: Tag },
    { key: 'branchGrades', title: 'Branch Grades', description: 'Define branch grading.', icon: Star },
    { key: 'employmentTypes', title: 'Employment Types', description: 'Manage employment statuses.', icon: User },
    { key: 'regions', title: 'Regions/Zones/Woredas', description: 'Geographical classifications.', icon: Map },
    { key: 'fieldsOfStudy', title: 'Fields of Study', description: 'Manage education fields.', icon: Library },
    { key: 'institutions', title: 'Institutions', description: 'Manage universities, colleges, etc.', icon: School },
    { key: 'educationAwards', title: 'Award Types & Levels', description: 'Manage honors and certifications.', icon: GraduationCap },
    { key: 'programTypes', title: 'Program Types', description: 'Regular, Distance, Extension.', icon: RadioTower },
    { key: 'allowanceTypes', title: 'Allowance Types', description: 'Manage salary allowance types.', icon: DollarSign },
    { key: 'disciplinaryActionTypes', title: 'Disciplinary Action Types', description: 'Manage types of disciplinary actions.', icon: AlertTriangle },
];

type MasterDataCategoryKey = keyof typeof initialMasterData;

const MasterDataCard = ({ slug, title, description, icon: Icon, count }: { slug: string; title: string; description: string; icon: React.ElementType, count: number }) => {
    const router = useRouter();
    
    const handleManageClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click event from firing
        router.push(`/master-data/${slug}`);
    };

    return (
        <Card 
            className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/master-data/${slug}`)}
        >
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                <div className="bg-muted p-3 rounded-md">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">{count} Records</p>
                <Button variant="outline" size="sm" onClick={handleManageClick}>Manage</Button>
            </CardFooter>
        </Card>
    );
};

export default function ConfigurationPage() {
    const [masterData, setMasterData] = useState(initialMasterData);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    const loadMasterData = () => {
        const storedData = localStorage.getItem('masterData');
        if (storedData) {
            try {
                // Merge to ensure new categories from initialMasterData are included
                const parsedData = JSON.parse(storedData);
                const mergedData = { ...initialMasterData, ...parsedData };
                setMasterData(mergedData);
            } catch (e) {
                console.error("Failed to parse master data from localStorage", e);
            }
        }
    };

    useEffect(() => {
        setIsClient(true);
        loadMasterData();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'masterData') {
                loadMasterData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const getCount = (key: string) => {
        const data = masterData[key as MasterDataCategoryKey];
        return Array.isArray(data) ? data.length : 0;
    };

    const filteredConfigAreas = configAreas.filter(area => 
        area.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        area.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const filteredDataCategories = dataCategories.filter(cat => 
        cat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isClient) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Configuration</h1>
                 <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search configuration and master data..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Platform Configuration</CardTitle>
                    <CardDescription>
                        Centralized control over system-wide settings, rules, and workflows.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredConfigAreas.map((area) => (
                        <Card key={area.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(area.path)}>
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                               <area.icon className="h-8 w-8 text-primary" />
                               <div className="grid gap-1">
                                    <CardTitle>{area.title}</CardTitle>
                                    <CardDescription>{area.description}</CardDescription>
                               </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline">Configure</Button>
                            </CardContent>
                        </Card>
                    ))}
                     {filteredConfigAreas.length === 0 && (
                        <p className="text-muted-foreground col-span-full">No platform configurations match your search.</p>
                    )}
                </CardContent>
            </Card>

            <Separator />
            
            <Card>
                 <CardHeader>
                    <CardTitle>Master Data Management</CardTitle>
                    <CardDescription>
                        Manage the core data entities used across the HCM platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                     {filteredDataCategories.map((cat) => (
                        <MasterDataCard
                            key={cat.key}
                            slug={cat.key}
                            title={cat.title}
                            description={cat.description}
                            icon={cat.icon}
                            count={getCount(cat.key)}
                        />
                    ))}
                    {filteredDataCategories.length === 0 && (
                        <p className="text-muted-foreground col-span-full">No master data categories match your search.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
