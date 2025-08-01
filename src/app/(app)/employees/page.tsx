

"use client"

import { MoreHorizontal, PlusCircle, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { employees as initialEmployees } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const initialNewEmployeeState = {
  // Profile
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  gender: '',
  maritalStatus: '',
  nationality: '',
  // Job
  department: '',
  position: '', // Job Title
  manager: '',
  employmentType: '',
  jobGrade: '',
  joinDate: '',
  probationEndDate: '',
  // Contact
  workEmail: '',
  personalEmail: '',
  mobileNumber: '',
  address: { region: '', city: '', subcity: '', woreda: '', kebele: '', houseNo: '' },
  emergencyContacts: [{ name: '', relationship: '', phone: '' }],
  // Financial
  contractStartDate: '',
  contractEndDate: '',
  basicSalary: '',
  currency: '',
  bankName: '',
  accountNumber: '',
  taxId: '',
  pensionNumber: '',
  // History & Development
  dependents: [{ name: '', relationship: '', dob: '' }],
  internalExperience: [{ title: '', department: '', startDate: '', endDate: '' }],
  externalExperience: [{ company: '', title: '', startDate: '', endDate: '' }],
  education: [{ degree: '', institution: '', field: '', completionDate: '' }],
  training: [{ name: '', provider: '', completionDate: '' }],
};


export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState(initialNewEmployeeState);
  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee(prevState => ({ ...prevState, [name]: value }));
  };

  const handleNestedInputChange = (section: keyof typeof newEmployee, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const list = newEmployee[section] as any[];
    const updatedList = [...list];
    updatedList[index] = { ...updatedList[index], [name]: value };
    setNewEmployee(prevState => ({ ...prevState, [section]: updatedList }));
  };

  const addEmergencyContact = () => {
    setNewEmployee(prevState => ({
      ...prevState,
      emergencyContacts: [...prevState.emergencyContacts, { name: '', relationship: '', phone: '' }]
    }));
  };

  const removeEmergencyContact = (index: number) => {
    const updatedContacts = newEmployee.emergencyContacts.filter((_, i) => i !== index);
    setNewEmployee(prevState => ({ ...prevState, emergencyContacts: updatedContacts }));
  };

  const addDependent = () => {
    setNewEmployee(prevState => ({
      ...prevState,
      dependents: [...prevState.dependents, { name: '', relationship: '', dob: '' }]
    }));
  };

  const removeDependent = (index: number) => {
    const updatedDependents = newEmployee.dependents.filter((_, i) => i !== index);
    setNewEmployee(prevState => ({ ...prevState, dependents: updatedDependents }));
  };
  
  const handleAddEmployee = () => {
    const newEmp = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: `${newEmployee.firstName} ${newEmployee.lastName}`,
      email: newEmployee.workEmail,
      position: newEmployee.position,
      department: newEmployee.department,
      status: 'Active',
      avatar: 'https://placehold.co/40x40.png',
    };
    setEmployees([...employees, newEmp]);
    setNewEmployee(initialNewEmployeeState);
    setAddEmployeeDialogOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };
  
  const exportToCsv = () => {
    const headers = ["ID", "Name", "Email", "Position", "Department", "Status"];
    const rows = employees.map(emp => [emp.id, emp.name, emp.email, emp.position, emp.department, emp.status].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Employees</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={exportToCsv}>
            Export
          </Button>
          <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setAddEmployeeDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the details for the new employee across the different sections.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="personal-job">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal-job">Personal & Job</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-job" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                    <div className="grid gap-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-4">
                               <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" value={newEmployee.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="middleName">Middle Name</Label>
                                    <Input id="middleName" name="middleName" value={newEmployee.middleName} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" value={newEmployee.lastName} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" name="dob" type="date" value={newEmployee.dob} onChange={handleInputChange} />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" onValueChange={(v) => handleSelectChange('gender', v)} value={newEmployee.gender}>
                                        <SelectTrigger id="gender"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="marital-status">Marital Status</Label>
                                    <Select name="maritalStatus" onValueChange={(v) => handleSelectChange('maritalStatus', v)} value={newEmployee.maritalStatus}>
                                        <SelectTrigger id="marital-status"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input id="nationality" name="nationality" value={newEmployee.nationality} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2 md:col-span-3">
                                    <Label htmlFor="photo">Photo</Label>
                                    <Input id="photo" type="file" />
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle>Job Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" name="department" value={newEmployee.department} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="position">Job Title</Label>
                                    <Input id="position" name="position" value={newEmployee.position} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="manager">Manager</Label>
                                    <Input id="manager" name="manager" value={newEmployee.manager} onChange={handleInputChange} />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="employment-type">Employment Type</Label>
                                     <Select name="employmentType" onValueChange={(v) => handleSelectChange('employmentType', v)} value={newEmployee.employmentType}>
                                        <SelectTrigger id="employment-type"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="permanent">Permanent</SelectItem>
                                            <SelectItem value="contract">Contract</SelectItem>
                                            <SelectItem value="intern">Intern</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="jobGrade">Job Grade</Label>
                                    <Input id="jobGrade" name="jobGrade" value={newEmployee.jobGrade} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="joinDate">Join Date</Label>
                                    <Input id="joinDate" name="joinDate" type="date" value={newEmployee.joinDate} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="probationEndDate">Probation End Date</Label>
                                    <Input id="probationEndDate" name="probationEndDate" type="date" value={newEmployee.probationEndDate} onChange={handleInputChange} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                 <TabsContent value="contact" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="workEmail">Work Email</Label>
                                    <Input id="workEmail" name="workEmail" type="email" value={newEmployee.workEmail} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="personalEmail">Personal Email</Label>
                                    <Input id="personalEmail" name="personalEmail" type="email" value={newEmployee.personalEmail} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                                    <Input id="mobileNumber" name="mobileNumber" type="tel" value={newEmployee.mobileNumber} onChange={handleInputChange} />
                                </div>
                            </div>
                             <Separator />
                            <p className="font-medium text-sm">Address</p>
                             {/* Address fields here - simplified for brevity */}
                             <div className="grid md:grid-cols-3 gap-4">
                               <div className="grid gap-2">
                                    <Label htmlFor="region">Region</Label>
                                    <Input id="region" name="address.region" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="address.city" />
                                </div>
                                 <div className="grid gap-2">
                                    <Label htmlFor="subcity">Subcity</Label>
                                    <Input id="subcity" name="address.subcity" />
                                </div>
                             </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">Emergency Contacts</p>
                                <Button size="sm" variant="outline" type="button" onClick={addEmergencyContact}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Contact
                                </Button>
                            </div>
                            <div className="grid gap-4">
                                {newEmployee.emergencyContacts.map((contact, index) => (
                                    <div key={index} className="grid md:grid-cols-4 items-end gap-4 p-4 border rounded-md relative">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ec-name-${index}`}>Full Name</Label>
                                            <Input id={`ec-name-${index}`} name="name" value={contact.name} onChange={(e) => handleNestedInputChange('emergencyContacts', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ec-relationship-${index}`}>Relationship</Label>
                                            <Input id={`ec-relationship-${index}`} name="relationship" value={contact.relationship} onChange={(e) => handleNestedInputChange('emergencyContacts', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`ec-phone-${index}`}>Phone Number</Label>
                                            <Input id={`ec-phone-${index}`} name="phone" value={contact.phone} onChange={(e) => handleNestedInputChange('emergencyContacts', index, e)} />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeEmergencyContact(index)}
                                            className="h-9 w-9"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="financial" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                     <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contract & Salary</CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="contractStartDate">Contract Start Date</Label>
                                    <Input id="contractStartDate" name="contractStartDate" type="date" value={newEmployee.contractStartDate} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contractEndDate">Contract End Date</Label>
                                    <Input id="contractEndDate" name="contractEndDate" type="date" value={newEmployee.contractEndDate} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="basicSalary">Basic Salary</Label>
                                    <Input id="basicSalary" name="basicSalary" value={newEmployee.basicSalary} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select name="currency" onValueChange={(v) => handleSelectChange('currency', v)} value={newEmployee.currency}>
                                        <SelectTrigger id="currency"><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ETB">ETB</SelectItem>
                                            <SelectItem value="USD">USD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Bank Details</CardTitle>
                            </CardHeader>
                             <CardContent className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Input id="bankName" name="bankName" value={newEmployee.bankName} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="accountNumber">Account Number</Label>
                                    <Input id="accountNumber" name="accountNumber" value={newEmployee.accountNumber} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="taxId">Tax ID</Label>
                                    <Input id="taxId" name="taxId" value={newEmployee.taxId} onChange={handleInputChange} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pensionNumber">Pension Number</Label>
                                    <Input id="pensionNumber" name="pensionNumber" value={newEmployee.pensionNumber} onChange={handleInputChange} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                 </TabsContent>
                 
                <TabsContent value="history" className="mt-4 max-h-[60vh] overflow-y-auto p-1">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="grid gap-1">
                                    <CardTitle>Dependents</CardTitle>
                                    <CardDescription>Manage dependent information.</CardDescription>
                                </div>
                                <Button size="sm" variant="outline" type="button" onClick={addDependent}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Dependent
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                {newEmployee.dependents.map((dependent, index) => (
                                    <div key={index} className="grid md:grid-cols-4 items-end gap-4 p-4 border rounded-md relative">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`dep-name-${index}`}>Full Name</Label>
                                            <Input id={`dep-name-${index}`} name="name" value={dependent.name} onChange={(e) => handleNestedInputChange('dependents', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`dep-relationship-${index}`}>Relationship</Label>
                                            <Input id={`dep-relationship-${index}`} name="relationship" value={dependent.relationship} onChange={(e) => handleNestedInputChange('dependents', index, e)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={`dep-dob-${index}`}>Date of Birth</Label>
                                            <Input id={`dep-dob-${index}`} name="dob" type="date" value={dependent.dob} onChange={(e) => handleNestedInputChange('dependents', index, e)} />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeDependent(index)}
                                            className="h-9 w-9"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Work Experience</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Experience fields here */}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Education</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Education fields here */}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleAddEmployee}>Add Employee</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Manage your employees and view their information.
          </CardDescription>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search employees..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                         <AvatarImage src={employee.avatar} alt="Avatar" data-ai-hint="person portrait" />
                         <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "Active" ? "secondary" : employee.status === 'On Leave' ? 'outline' : 'destructive'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the employee record.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{filteredEmployees.length > 10 ? 10 : filteredEmployees.length}</strong> of <strong>{filteredEmployees.length}</strong> employees
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

    
