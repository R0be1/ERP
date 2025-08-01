import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { vacancies } from "@/lib/data";
import { Briefcase, MapPin, PlusCircle, Search, Users } from "lucide-react";

export default function RecruitmentPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Recruitment</h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vacancies..." className="pl-8" />
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Post Vacancy
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vacancies.map((vacancy, index) => (
          <Card key={index}>
            <CardHeader className="pb-4">
              <Briefcase className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>{vacancy.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{vacancy.department} Department</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{vacancy.location}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm font-semibold">{vacancy.applicants} Applicants</div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
