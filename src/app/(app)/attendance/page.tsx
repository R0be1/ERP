"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function AttendancePage() {
  const [time, setTime] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
  };
  
  const handleCheckOut = () => {
    setIsCheckedIn(false);
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Web Attendance</CardTitle>
          <CardDescription>Clock in and out from here.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-5xl font-semibold text-primary">
            <Clock className="h-12 w-12" />
            <span>{time || "..."}</span>
          </div>
           <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </CardContent>
        <CardFooter className="flex justify-around">
            <Button size="lg" disabled={isCheckedIn} onClick={handleCheckIn}>
              <LogIn className="mr-2 h-4 w-4" /> Check In
            </Button>
            <Button size="lg" variant="destructive" disabled={!isCheckedIn} onClick={handleCheckOut}>
              <LogOut className="mr-2 h-4 w-4" /> Check Out
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
