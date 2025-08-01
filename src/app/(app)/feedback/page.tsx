import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Training Feedback</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>
            We value your opinion. Please share your feedback on the recent training session.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="training-select">Training Session</Label>
            <Select>
              <SelectTrigger id="training-select">
                <SelectValue placeholder="Select a training session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comm-skills">Communication Skills Workshop</SelectItem>
                <SelectItem value="leadership">Leadership Development Program</SelectItem>
                <SelectItem value="tech-stack">New Tech Stack Introduction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Overall, how would you rate the training?</Label>
             <RadioGroup defaultValue="satisfied" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-satisfied" id="r1" />
                <Label htmlFor="r1">Very Satisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="satisfied" id="r2" />
                <Label htmlFor="r2">Satisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="r3" />
                <Label htmlFor="r3">Neutral</Label>
              </div>
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="dissatisfied" id="r4" />
                <Label htmlFor="r4">Dissatisfied</Label>
              </div>
            </RadioGroup>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="comments">Comments & Suggestions</Label>
            <Textarea id="comments" placeholder="What did you like? What can be improved?" />
          </div>
          <Button className="w-fit">Submit Feedback</Button>
        </CardContent>
      </Card>
    </>
  );
}
