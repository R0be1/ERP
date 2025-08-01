import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye } from "lucide-react";

const payslips = [
  { id: "PS0724", period: "July 2024", date: "2024-07-31", amount: "$5,200.00", status: "Paid" },
  { id: "PS0624", period: "June 2024", date: "2024-06-30", amount: "$5,150.00", status: "Paid" },
  { id: "PS0524", period: "May 2024", date: "2024-05-31", amount: "$5,150.00", status: "Paid" },
  { id: "PS0424", period: "April 2024", date: "2024-04-30", amount: "$5,000.00", status: "Paid" },
];

export default function PayslipsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">My Payslips</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payslip History</CardTitle>
          <CardDescription>
            Access your past and current payslips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pay Period</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.map((slip) => (
                <TableRow key={slip.id}>
                  <TableCell className="font-medium">{slip.period}</TableCell>
                  <TableCell>{slip.date}</TableCell>
                  <TableCell>{slip.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{slip.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
