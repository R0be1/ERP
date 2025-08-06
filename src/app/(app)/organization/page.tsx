
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMasterData } from "@/lib/master-data";
import { employees as initialEmployees } from "@/lib/data";
import { OrgChartNode } from '@/components/org-chart-node';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import './org-chart.css';

type Department = {
    value: string;
    label: string;
    parent: string;
    children?: Department[];
    [key: string]: any;
};

// Function to recursively filter the tree
const filterTree = (nodes: Department[], searchTerm: string): Department[] => {
    if (!searchTerm) return nodes;

    const lowercasedTerm = searchTerm.toLowerCase();

    const filter = (node: Department): Department | null => {
        const isMatch = node.label.toLowerCase().includes(lowercasedTerm);
        
        let children: Department[] = [];
        if (node.children) {
            children = node.children
                .map(filter)
                .filter(child => child !== null) as Department[];
        }

        if (isMatch || children.length > 0) {
            return { 
                ...node, 
                children: children,
                isMatch: isMatch // Add a flag to indicate a direct match
            };
        }

        return null;
    };

    return nodes.map(filter).filter(node => node !== null) as Department[];
};


export default function OrganizationPage() {
    const [masterData, setMasterData] = useState(getMasterData());
    const [employees, setEmployees] = useState(initialEmployees);
    const [tree, setTree] = useState<Department[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const loadData = () => {
        const storedMasterData = localStorage.getItem('masterData');
        if (storedMasterData) {
            try {
                setMasterData(JSON.parse(storedMasterData));
            } catch (e) {
                console.error("Failed to parse master data from localStorage", e);
            }
        }
        const storedEmployees = localStorage.getItem('employees');
        if (storedEmployees) {
            try {
                setEmployees(JSON.parse(storedEmployees));
            } catch(e) {
                console.error("Failed to parse employees from localStorage", e);
            }
        }
    };

    useEffect(() => {
        setIsClient(true);
        loadData();

        const handleStorageChange = () => {
            loadData();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (masterData.departments && masterData.departments.length > 0) {
            const departments = JSON.parse(JSON.stringify(masterData.departments)) as Department[];
            const departmentsById: { [key: string]: Department } = {};

            departments.forEach(dept => {
                dept.children = [];
                departmentsById[dept.value] = dept;
            });

            const rootNodes: Department[] = [];
            departments.forEach(dept => {
                if (dept.parent && departmentsById[dept.parent]) {
                    departmentsById[dept.parent].children?.push(dept);
                } else {
                    rootNodes.push(dept);
                }
            });
            setTree(rootNodes);
        }
    }, [masterData.departments]);
    
    const filteredTree = filterTree(tree, searchTerm);

    if (!isClient) {
        return <div>Loading...</div>;
    }
    
    const getDepartmentHead = (departmentId: string) => {
        const headJobTitle = masterData.jobTitles.find(
            (jt: any) => jt.isHeadOfDepartment && (jt.managedDepartments?.includes(departmentId) || jt.managesDepartmentType === masterData.departments.find(d => d.value === departmentId)?.type)
        );
        if (headJobTitle) {
            return employees.find(emp => emp.position === headJobTitle.label);
        }
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Organization Chart</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Company Hierarchy</CardTitle>
                    <CardDescription>
                        An interactive visualization of the company's reporting structure. Search for departments below.
                    </CardDescription>
                    <div className="relative pt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search departments..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="w-full overflow-x-auto p-6">
                    {filteredTree.length > 0 ? (
                         <div className="org-chart">
                            {filteredTree.map(node => (
                                <OrgChartNode 
                                    key={node.value} 
                                    node={node} 
                                    getDepartmentHead={getDepartmentHead} 
                                    allDepartments={masterData.departments}
                                    searchTerm={searchTerm}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No matching departments found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
