
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Mail, Phone, Users, PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

type Department = {
    value: string;
    label: string;
    parent: string;
    children?: Department[];
    isMatch?: boolean; // Flag for search match
    [key: string]: any;
};

type Employee = {
    id: string;
    name: string;
    position: string;
    avatar: string;
};

interface OrgChartNodeProps {
    node: Department;
    getDepartmentHead: (departmentId: string) => Employee | null | undefined;
    allDepartments: Department[];
    searchTerm: string;
}

export function OrgChartNode({ node, getDepartmentHead, allDepartments, searchTerm }: OrgChartNodeProps) {
    // Expand all nodes when a search is active to show the results
    const [isExpanded, setIsExpanded] = useState(true);
    
    useEffect(() => {
        setIsExpanded(!!searchTerm);
    }, [searchTerm]);

    const departmentHead = getDepartmentHead(node.value);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const directChildrenCount = node.children?.length || 0;
    const allSubDepartments = (node: Department): Department[] => {
        let depts = node.children ? [...node.children] : [];
        if(node.children){
            node.children.forEach(child => {
                depts = [...depts, ...allSubDepartments(child)];
            });
        }
        return depts;
    };
    const totalSubDepartments = allSubDepartments(node).length;

    return (
        <li>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <div className="node-content relative">
                            <Card className={cn(
                                "text-left shadow-md hover:shadow-xl transition-shadow min-w-64",
                                node.isMatch && "ring-2 ring-primary"
                                )}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Building className="h-6 w-6 text-primary" />
                                        <CardTitle className="text-base">{node.label}</CardTitle>
                                    </div>
                                </CardHeader>
                               {departmentHead && (
                                     <CardContent>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={departmentHead.avatar} data-ai-hint="person portrait" />
                                                <AvatarFallback>{departmentHead.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-sm">{departmentHead.name}</p>
                                                <p className="text-xs text-muted-foreground">{departmentHead.position}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                               )}
                               {node.children && node.children.length > 0 && (
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-6 w-6 rounded-full"
                                            onClick={handleToggle}
                                        >
                                            {isExpanded ? <MinusCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                                            <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold">{node.label}</p>
                        <p>Sub-departments: {directChildrenCount}</p>
                        <p>Total reports in hierarchy: {totalSubDepartments}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {isExpanded && node.children && node.children.length > 0 && (
                <ul>
                    {node.children.map(childNode => (
                        <OrgChartNode 
                            key={childNode.value} 
                            node={childNode} 
                            getDepartmentHead={getDepartmentHead}
                            allDepartments={allDepartments}
                            searchTerm={searchTerm} 
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}
