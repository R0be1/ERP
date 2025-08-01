export const employees = [
  {
    id: "EMP001",
    name: "Alice Johnson",
    department: "Engineering",
    position: "Senior Software Engineer",
    status: "Active",
    email: "alice.j@example.com",
    avatar: "https://placehold.co/40x40.png",
  },
  {
    id: "EMP002",
    name: "Bob Williams",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    email: "bob.w@example.com",
    avatar: "https://placehold.co/40x40.png",
  },
  {
    id: "EMP003",
    name: "Charlie Brown",
    department: "Sales",
    position: "Sales Representative",
    status: "On Leave",
    email: "charlie.b@example.com",
    avatar: "https://placehold.co/40x40.png",
  },
  {
    id: "EMP004",
    name: "Diana Miller",
    department: "Human Resources",
    position: "HR Specialist",
    status: "Active",
    email: "diana.m@example.com",
    avatar: "https://placehold.co/40x40.png",
  },
  {
    id: "EMP005",
    name: "Ethan Davis",
    department: "Engineering",
    position: "Junior Developer",
    status: "Terminated",
    email: "ethan.d@example.com",
    avatar: "https://placehold.co/40x40.png",
  },
  {
    id: "EMP006",
    name: "Fiona Garcia",
    department: "Product",
    position: "Product Manager",
    status: "Active",
    email: "fiona.g@example.com",
    avatar: "https://placehold.co/40x40.png",
  },
];

export const teamMembers = employees.slice(0, 4);

export const headcountData = [
  { department: "Engineering", count: 12, fill: "var(--chart-1)" },
  { department: "Marketing", count: 6, fill: "var(--chart-2)" },
  { department: "Sales", count: 8, fill: "var(--chart-3)" },
  { department: "HR", count: 4, fill: "var(--chart-4)" },
  { department: "Product", count: 5, fill: "var(--chart-5)" },
];

export const vacancies = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    applicants: 12,
  },
  {
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "New York, NY",
    applicants: 5,
  },
  {
    title: "UI/UX Designer",
    department: "Product",
    location: "San Francisco, CA",
    applicants: 23,
  },
  {
    title: "Data Scientist",
    department: "Engineering",
    location: "Remote",
    applicants: 8,
  },
];

export const leaveRequests = [
  {
    id: "LR001",
    employee: "Charlie Brown",
    type: "Vacation",
    startDate: "2024-08-15",
    endDate: "2024-08-22",
    status: "Approved",
  },
  {
    id: "LR002",
    employee: "Alice Johnson",
    type: "Sick Leave",
    startDate: "2024-07-20",
    endDate: "2024-07-20",
    status: "Approved",
  },
  {
    id: "LR003",
    employee: "Bob Williams",
    type: "Personal Leave",
    startDate: "2024-09-01",
    endDate: "2024-09-02",
    status: "Pending",
  },
  {
    id: "LR004",
    employee: "Diana Miller",
    type: "Vacation",
    startDate: "2024-07-25",
    endDate: "2024-07-28",
    status: "Rejected",
  },
];
