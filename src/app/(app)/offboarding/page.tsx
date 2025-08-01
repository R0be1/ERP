import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, FileText, DollarSign, Repeat, UserCheck, MessageSquare } from "lucide-react";

const offboardingSteps = [
    {
        id: "knowledge-transfer",
        icon: Repeat,
        title: "Knowledge Transfer Documentation",
        description: "Document critical knowledge and responsibilities for a smooth handover.",
    },
    {
        id: "asset-return",
        icon: ClipboardCheck,
        title: "Asset Return",
        description: "Return all company assets like laptop, ID card, etc.",
    },
    {
        id: "account-deactivation",
        icon: UserCheck,
        title: "Account Deactivation",
        description: "Deactivate all company-related accounts and system access.",
    },
    {
        id: "final-settlement",
        icon: DollarSign,
        title: "Final Settlement",
        description: "Complete final pay, gratuity, and leave encashment calculations.",
    },
     {
        id: "exit-interview",
        icon: MessageSquare,
        title: "Exit Interview",
        description: "Schedule and provide feedback on your experience with the company.",
    },
    {
        id: "alumni-network",
        icon: FileText,
        title: "Alumni Network",
        description: "Join the alumni network for future opportunities and networking.",
    },
]

export default function OffboardingPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Exit and Offboarding</h1>
                <Button>Initiate Resignation</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Offboarding Checklist</CardTitle>
                    <CardDescription>
                        Follow these steps to ensure a smooth offboarding process.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {offboardingSteps.map((step) => (
                        <div key={step.id} className="flex items-start gap-4">
                            <Checkbox id={step.id} className="mt-1" />
                            <div className="grid gap-0.5">
                                <Label htmlFor={step.id} className="text-base font-medium">
                                    <div className="flex items-center gap-2">
                                        <step.icon className="h-5 w-5 text-primary" />
                                        {step.title}
                                    </div>
                                </Label>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Exit Interview Feedback</CardTitle>
                    <CardDescription>Your feedback is valuable for our improvement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Please share your thoughts on your time at the company, reasons for leaving, and any suggestions..." />
                     <Button className="mt-4">Submit Feedback</Button>
                </CardContent>
            </Card>
        </div>
    );
}
