import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Stethoscope } from "lucide-react";

const benefits = [
  {
    id: "health",
    icon: Stethoscope,
    title: "Premium Health Insurance",
    description: "Comprehensive health coverage for you and your family.",
  },
  {
    id: "dental",
    icon: Heart,
    title: "Dental & Vision Plan",
    description: "Keep your smile bright and vision sharp.",
  },
  {
    id: "wellness",
    icon: Shield,
    title: "Wellness Program",
    description: "Access to gym memberships, mental health support, and more.",
  },
];

export default function BenefitsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Benefits Enrollment</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <Card key={benefit.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <benefit.icon className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle>{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox id={benefit.id} />
                <Label htmlFor={benefit.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Enroll in this benefit
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       <div className="flex justify-end mt-4">
        <Button>Submit Enrollment</Button>
      </div>
    </>
  );
}
