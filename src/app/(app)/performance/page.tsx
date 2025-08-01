import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Users } from "lucide-react";

export default function PerformancePage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Performance Reviews</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Q3-2024 Review</CardTitle>
            <CardDescription>Status of your current performance review cycle.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Self-Assessment</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <Progress value={100} aria-label="Self-Assessment completed" />
            </div>
             <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Peer Feedback</p>
                <p className="text-sm text-muted-foreground">3 of 4 received</p>
              </div>
              <Progress value={75} aria-label="Peer feedback 75% complete" />
            </div>
             <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Manager Review</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <Progress value={0} aria-label="Manager review pending" />
            </div>
            <Separator />
            <Button>Go to My Review</Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Team Reviews</CardTitle>
            <CardDescription>Status of your team's performance reviews.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-center text-center text-muted-foreground p-6 rounded-lg bg-muted/40">
              <div className="grid gap-2">
                <Users className="h-12 w-12 mx-auto" />
                <p className="text-lg font-bold">5 / 8 Completed</p>
                <p className="text-sm">Team review cycle is currently in progress.</p>
              </div>
            </div>
            <Separator />
            <Button>Go to Team Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
