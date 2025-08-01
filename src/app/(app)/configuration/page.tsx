import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, GitBranch, ScrollText, Settings } from "lucide-react";

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
    {
        id: "master-data",
        icon: Database,
        title: "Master Data Management",
        description: "Manage core HCM data like departments, job titles, and locations.",
        action: "Manage Data",
    },
]

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
        </div>
    );
}
