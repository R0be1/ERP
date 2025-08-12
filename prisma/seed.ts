
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Seed simple master data
  const regions = [
    { id: 'addis-ababa', name: 'Addis Ababa' },
    { id: 'afar', name: 'Afar' },
    { id: 'amhara', name: 'Amhara' },
    { id: 'benishangul-gumuz', name: 'Benishangul-Gumuz' },
    { id: 'dire-dawa', name: 'Dire Dawa' },
    { id: 'gambela', name: 'Gambela' },
    { id: 'harari', name: 'Harari' },
    { id: 'oromia', name: 'Oromia' },
    { id: 'somali', name: 'Somali' },
    { id: 'snnp', name: 'Southern Nations, Nationalities, and Peoples\'' },
    { id: 'tigray', name: 'Tigray' },
  ];
  await prisma.region.createMany({ data: regions, skipDuplicates: true });

  const departmentTypes = [
    { id: 'ceo-office', name: 'Office of Chief Executive Officer' },
    { id: 'co-office', name: 'Office of Chief Officer' },
    { id: 'dco-office', name: 'Office of Deputy Chief Officer' },
    { id: 'department', name: 'Department' },
    { id: 'division', name: 'Division' },
    { id: 'branch', name: 'Branch' },
    { id: 'district', name: 'District' },
  ];
  await prisma.departmentType.createMany({ data: departmentTypes, skipDuplicates: true });

  const workLocations = [
    { id: 'head-office', name: 'Head Office' },
    { id: 'district', name: 'District' },
    { id: 'city-branch', name: 'City Branch' },
    { id: 'outline-branch', name: 'Outline Branch' },
  ];
  await prisma.workLocation.createMany({ data: workLocations, skipDuplicates: true });
  
  const branchGrades = [
    { id: 'premium-branch', name: 'Premium Branch' },
    { id: 'special-branch', name: 'Special Branch' },
    { id: 'i', name: 'I' },
    { id: 'ii', name: 'II' },
    { id: 'iii', name: 'III' },
    { id: 'iv', name: 'IV' },
    { id: 'v', name: 'V' }
  ];
  await prisma.branchGrade.createMany({ data: branchGrades, skipDuplicates: true });

  const jobGradesData = Array.from({ length: 22 }, (_, i) => ({ id: `Grade ${i + 1}`, name: `Grade ${i + 1}` }));
  await prisma.jobGrade.createMany({ data: jobGradesData, skipDuplicates: true });

  const jobCategoriesData = [
    { id: 'managerial', name: 'Managerial' },
    { id: 'professional', name: 'Professional' },
    { id: 'clerical', name: 'Clerical' },
    { id: 'non-clerical', name: 'Non-Clerical' },
  ];
  await prisma.jobCategory.createMany({ data: jobCategoriesData, skipDuplicates: true });

  const employmentTypesData = [
    { id: 'permanent', name: 'Permanent' },
    { id: 'contract', name: 'Contract' },
    { id: 'temporary', name: 'Temporary' },
    { id: 'internship', name: 'Internship' },
  ];
  await prisma.employmentType.createMany({ data: employmentTypesData, skipDuplicates: true });

  const educationAwardsData = [
    { id: 'certificate', name: 'Certificate' },
    { id: 'diploma', name: 'Diploma' },
    { id: 'bachelors-degree', name: 'Bachelor\'s Degree' },
    { id: 'masters-degree', name: 'Master\'s Degree' },
    { id: 'phd', name: 'PhD' },
  ];
  await prisma.educationAward.createMany({ data: educationAwardsData, skipDuplicates: true });

  const fieldsOfStudyData = [
    { id: 'accounting', name: 'Accounting' },
    { id: 'management', name: 'Management' },
    { id: 'economics', name: 'Economics' },
    { id: 'law', name: 'Law' },
    { id: 'computer-science', name: 'Computer Science' },
    { id: 'business-administration', name: 'Business Administration' },
  ];
  await prisma.fieldOfStudy.createMany({ data: fieldsOfStudyData, skipDuplicates: true });

  const institutionsData = [
    { id: 'addis-ababa-university', name: 'Addis Ababa University', type: 'Government' },
    { id: 'mekelle-university', name: 'Mekelle University', type: 'Government' },
    { id: 'unity-university', name: 'Unity University', type: 'Private' },
    { id: 'admas-university', name: 'Admas University', type: 'Private' },
  ];
  await prisma.institution.createMany({ data: institutionsData, skipDuplicates: true });

  const programTypesData = [
    { id: 'regular', name: 'Regular' },
    { id: 'distance', name: 'Distance' },
    { id: 'extension', name: 'Extension' },
    { id: 'weekend', name: 'Weekend' },
  ];
  await prisma.programType.createMany({ data: programTypesData, skipDuplicates: true });

  const allowanceTypesData = [
    { id: 'housing-allowance', name: 'Housing Allowance', description: 'Allowance for housing expenses.', isTaxable: true },
    { id: 'transport-allowance', name: 'Transport Allowance', description: 'Allowance for commuting expenses.', isTaxable: false },
    { id: 'communication-allowance', name: 'Communication Allowance', description: 'Allowance for mobile and internet bills.', isTaxable: false },
    { id: 'representation-allowance', name: 'Representation Allowance', description: 'Allowance for representation duties.', isTaxable: true },
    { id: 'hardship-allowance', name: 'Hardship Allowance', description: 'Allowance for working in difficult locations.', isTaxable: false },
  ];
  await prisma.allowanceType.createMany({ data: allowanceTypesData, skipDuplicates: true });

  const disciplinaryActionTypesData = [
    { id: 'first-warning', name: 'First Warning' },
    { id: 'second-warning', name: 'Second Warning' },
    { id: 'final-warning', name: 'Final Warning' },
    { id: 'suspension', name: 'Suspension' },
  ];
  await prisma.disciplinaryActionType.createMany({ data: disciplinaryActionTypesData, skipDuplicates: true });

  // Seed departments (handle parent relationship)
  const departmentsData = [
      { id: '001', name: 'Engineering', departmentTypeId: 'department', parentId: null, capacity: 50, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '002', name: 'Marketing', departmentTypeId: 'department', parentId: null, capacity: 20, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '003', name: 'Sales', departmentTypeId: 'department', parentId: null, capacity: 30, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '004', name: 'Human Resources', departmentTypeId: 'department', parentId: null, capacity: 15, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '005', name: 'Product', departmentTypeId: 'department', parentId: null, capacity: 25, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '006', name: 'Finance', departmentTypeId: 'department', parentId: null, capacity: 10, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '007', name: 'Operations', departmentTypeId: 'department', parentId: null, capacity: 40, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
  ];
  for (const dept of departmentsData) {
      await prisma.department.upsert({
          where: { id: dept.id },
          update: {},
          create: dept,
      });
  }

  // Seed Job Titles
  const jobTitlesData = [
    { id: 'software-engineer', name: 'Software Engineer', jobCategoryId: 'professional', jobGradeId: 'Grade 10', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
    { id: 'senior-software-engineer', name: 'Senior Software Engineer', jobCategoryId: 'professional', jobGradeId: 'Grade 12', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
    { id: 'product-manager', name: 'Product Manager', jobCategoryId: 'managerial', jobGradeId: 'Grade 15', isHeadOfDepartment: true, managesDepartmentTypeId: null, managedDepartments: { connect: [{ id: '005' }] } },
    { id: 'marketing-manager', name: 'Marketing Manager', jobCategoryId: 'managerial', jobGradeId: 'Grade 14', isHeadOfDepartment: true, managesDepartmentTypeId: null, managedDepartments: { connect: [{ id: '002' }] } },
    { id: 'sales-representative', name: 'Sales Representative', jobCategoryId: 'clerical', jobGradeId: 'Grade 8', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
    { id: 'hr-specialist', name: 'HR Specialist', jobCategoryId: 'professional', jobGradeId: 'Grade 9', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
  ];
  for (const jt of jobTitlesData) {
    await prisma.jobTitle.upsert({
        where: { id: jt.id },
        update: {},
        create: jt,
    });
  }
  
  // Seed Salary Structures
  const salaryStructuresData = [
    { 
        id: 'SS001',
        jobGradeId: 'Grade 15', 
        effectiveDate: new Date('2024-01-01'),
        status: 'ACTIVE',
        steps: {
            create: [
                { step: 1, salary: 100000 },
                { step: 2, salary: 105000 },
                { step: 3, salary: 110000 },
            ],
        },
    },
    { 
        id: 'SS002', 
        jobGradeId: 'Grade 10', 
        effectiveDate: new Date('2024-01-01'),
        status: 'ACTIVE',
        steps: {
            create: [
                { step: 1, salary: 50000 },
                { step: 2, salary: 52500 },
            ],
        }
    }
  ];
  for(const ss of salaryStructuresData) {
      await prisma.salaryStructure.upsert({
          where: { id: ss.id },
          update: {},
          create: ss
      });
  }

  // Seed Employees
  const employeesData = [
      {
          id: 'EMP001',
          title: 'Woy',
          firstName: 'Alice',
          middleName: '',
          lastName: 'Johnson',
          fullName: 'Alice Johnson',
          avatar: 'https://placehold.co/40x40.png',
          dateOfBirth: new Date('1990-05-15'),
          gender: 'FEMALE',
          maritalStatus: 'MARRIED',
          spouseFullName: 'John Johnson',
          nationality: 'American',
          status: 'ACTIVE',
          joinDate: new Date('2020-01-15'),
          probationEndDate: new Date('2020-04-15'),
          employmentTypeId: 'permanent',
          departmentId: '001',
          jobTitleId: 'senior-software-engineer',
          managerId: null, // No manager for Alice initially
          contact: {
              create: {
                  workEmail: 'alice.j@example.com',
                  personalEmail: 'alice.j@personal.com',
                  mobileNumber: '123-456-7890',
              }
          },
          address: {
              create: {
                  country: 'Ethiopia',
                  regionId: 'addis-ababa',
                  city: 'Addis Ababa',
                  subcity: 'Bole',
                  woreda: '01',
                  kebele: '02',
                  houseNo: '123'
              }
          },
          financial: {
              create: {
                  contractStartDate: new Date('2020-01-15'),
                  basicSalary: 80000,
                  currency: 'ETB',
                  bankName: 'Commercial Bank',
                  accountNumber: '1000123456789',
                  taxId: 'TIN12345',
                  pensionNumber: 'PN98765',
              }
          },
          identification: {
              create: {
                  nationalId: '123456789',
                  kebeleId: 'K-123',
                  drivingLicense: 'DL-9876',
                  passportNo: 'P-54321',
              }
          }
      },
      // Manager for Alice and others
      {
          id: 'EMP006',
          fullName: 'Fiona Garcia',
          title: 'Woy',
          firstName: 'Fiona',
          lastName: 'Garcia',
          avatar: 'https://placehold.co/40x40.png',
          status: 'ACTIVE',
          departmentId: '005',
          jobTitleId: 'product-manager',
          contact: { create: { workEmail: 'fiona.g@example.com'}},
          joinDate: new Date('2019-01-01')
      },
  ];

  for(const emp of employeesData) {
      await prisma.employee.upsert({
          where: { id: emp.id },
          update: {},
          create: emp as any
      });
  }

  // Set Alice's manager
  await prisma.employee.update({
      where: { id: 'EMP001' },
      data: { managerId: 'EMP006' }
  });


  // Other employees with basic info
  const otherEmployees = [
    { id: "EMP002", fullName: "Bob Williams", departmentId: "002", jobTitleId: "marketing-manager", status: 'ACTIVE', contact: { create: { email: "bob.w@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
    { id: "EMP003", fullName: "Charlie Brown", departmentId: "003", jobTitleId: "sales-representative", status: 'ON_LEAVE', contact: { create: { email: "charlie.b@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
    { id: "EMP004", fullName: "Diana Miller", departmentId: "004", jobTitleId: "hr-specialist", status: 'ACTIVE', contact: { create: { email: "diana.m@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
    { id: "EMP005", fullName: "Ethan Davis", departmentId: "001", jobTitleId: "software-engineer", status: 'TERMINATED', contact: { create: { email: "ethan.d@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
  ];

  for (const emp of otherEmployees) {
       await prisma.employee.upsert({
          where: { id: emp.id },
          update: {},
          create: emp as any,
      });
  }
  
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
