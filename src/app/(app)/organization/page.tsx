import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sitemap } from "lucide-react";

export default function OrganizationPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Organization Chart</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Company Hierarchy</CardTitle>
          <CardDescription>
            Visualize reporting lines and team structures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/40 p-10 rounded-lg min-h-[400px]">
            <Sitemap className="h-16 w-16 mb-4" />
            <p className="text-lg font-medium">Organizational Chart Coming Soon</p>
            <p className="text-sm">This area will display an interactive chart of the company's structure.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
