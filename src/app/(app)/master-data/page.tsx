
"use client";

import { useState, useEffect } from "react";
import {
    Building, Briefcase, Tag, Layers, School, Landmark, Map,
    GraduationCap, BookUser, RadioTower, Library
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { masterData as initialMasterData } from "@/lib/master-data";
import { useRouter } from "next/navigation";

const dataCategories = [
    {
        key: 'departments',
        title: 'Departments',
        description: 'Manage company departments.',
        icon: Building,
    },
    {
        key: 'divisions',
        title: 'Divisions / Units',
        description: 'Define units under departments.',
        icon: Landmark,
    },
    {
        key: 'jobTitles',
        title: 'Job Titles',
        description: 'Manage job titles and codes.',
        icon: Briefcase,
    },
    {
        key: 'jobCategories',
        title: 'Job Categories',
        description: 'Configure job types.',
        icon: Layers,
    },
    {
        key: 'jobGrades',
        title: 'Job Grades',
        description: 'Define grading structure.',
        icon: Tag,
    },
    {
        key: 'employmentTypes',
        title: 'Employment Types',
        description: 'Manage employment statuses.',
        icon: User,
    },
    {
        key: 'regions',
        title: 'Regions/Zones/Woredas',
        description: 'Geographical classifications.',
        icon: Map,
    },
    {
        key: 'fieldsOfStudy',
        title: 'Fields of Study',
        description: 'Manage education fields.',
        icon: Library,
    },
    {
        key: 'institutions',
        title: 'Institutions',
        description: 'Manage universities, colleges, etc.',
        icon: School,
    },
    {
        key: 'educationAwards',
        title: 'Award Types & Levels',
        description: 'Manage honors and certifications.',
        icon: GraduationCap,
    },
    {
        key: 'programTypes',
        title: 'Program Types',
        description: 'Regular, Distance, Extension.',
        icon: RadioTower,
    },
];

type MasterDataCategoryKey = keyof typeof initialMasterData;

const MasterDataCard = ({ title, description, icon: Icon, count }: { title: string; description: string; icon: React.ElementType, count: number }) => {
    const router = useRouter();

    const handleClick = () => {
        // In a real app, this would navigate to a detailed management page
        // For now, it can just log to console or do nothing.
        console.log(`Navigating to manage ${title}`);
    };

    return (
        <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="bg-muted p-3 rounded-md">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">{count} Records</p>
                <Button variant="outline" size="sm" className="ml-auto">Manage</Button>
            </CardFooter>
        </Card>
    );
};


export default function MasterDataPage() {
    const [masterData, setMasterData] = useState(initialMasterData);

    useEffect(() => {
        const storedData = localStorage.getItem('masterData');
        if (storedData) {
            try {
                setMasterData(JSON.parse(storedData));
            } catch (e) {
                console.error("Failed to parse master data from localStorage", e);
            }
        }
    }, []);

    const getCount = (key: string) => {
        const data = masterData[key as MasterDataCategoryKey];
        return Array.isArray(data) ? data.length : 0;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Master Data Management</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dataCategories.map((cat) => (
                    <MasterDataCard
                        key={cat.key}
                        title={cat.title}
                        description={cat.description}
                        icon={cat.icon}
                        count={getCount(cat.key)}
                    />
                ))}
            </div>
        </div>
    );
}
