
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMasterData } from "@/lib/master-data";
import { employees as initialEmployees } from "@/lib/data";
import { OrgChartNode } from '@/components/org-chart-node';
import './org-chart.css';

type Department = {
    value: string;
    label: string;
    parent: string;
    children?: Department[];
    [key: string]: any;
};

export default function OrganizationPage() {
    const [masterData, setMasterData] = useState(getMasterData());
    const [employees, setEmployees] = useState(initialEmployees);
    const [tree, setTree] = useState<Department[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
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
                        An interactive visualization of the company's reporting structure.
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full overflow-x-auto p-6">
                    {tree.length > 0 ? (
                         <div className="org-chart">
                            {tree.map(node => (
                                <OrgChartNode 
                                    key={node.value} 
                                    node={node} 
                                    getDepartmentHead={getDepartmentHead} 
                                    allDepartments={masterData.departments}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No organizational data to display.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
