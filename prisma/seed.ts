
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Seed simple master data
  const regions = [
    { id: 'addis-ababa', label: 'Addis Ababa' },
    { id: 'afar', label: 'Afar' },
    { id: 'amhara', label: 'Amhara' },
    { id: 'benishangul-gumuz', label: 'Benishangul-Gumuz' },
    { id: 'dire-dawa', label: 'Dire Dawa' },
    { id: 'gambela', label: 'Gambela' },
    { id: 'harari', label: 'Harari' },
    { id: 'oromia', label: 'Oromia' },
    { id: 'somali', label: 'Somali' },
    { id: 'snnp', label: 'Southern Nations, Nationalities, and Peoples\'' },
    { id: 'tigray', label: 'Tigray' },
  ];
  for (const region of regions) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {},
      create: region,
    });
  }

  const departmentTypes = [
    { id: 'ceo-office', label: 'Office of Chief Executive Officer' },
    { id: 'co-office', label: 'Office of Chief Officer' },
    { id: 'dco-office', label: 'Office of Deputy Chief Officer' },
    { id: 'department', label: 'Department' },
    { id: 'division', label: 'Division' },
    { id: 'branch', label: 'Branch' },
    { id: 'district', label: 'District' },
  ];
  for (const type of departmentTypes) {
    await prisma.departmentType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  const workLocations = [
    { id: 'head-office', label: 'Head Office' },
    { id: 'district', label: 'District' },
    { id: 'city-branch', label: 'City Branch' },
    { id: 'outline-branch', label: 'Outline Branch' },
  ];
  for (const location of workLocations) {
    await prisma.workLocation.upsert({
      where: { id: location.id },
      update: {},
      create: location,
    });
  }
  
  const branchGrades = [
    { id: 'premium-branch', label: 'Premium Branch' },
    { id: 'special-branch', label: 'Special Branch' },
    { id: 'i', label: 'I' },
    { id: 'ii', label: 'II' },
    { id: 'iii', label: 'III' },
    { id: 'iv', label: 'IV' },
    { id: 'v', label: 'V' }
  ];
  for (const grade of branchGrades) {
    await prisma.branchGrade.upsert({
      where: { id: grade.id },
      update: {},
      create: grade,
    });
  }

  const jobGradesData = Array.from({ length: 22 }, (_, i) => ({ id: `Grade ${i + 1}`, label: `Grade ${i + 1}` }));
  for (const grade of jobGradesData) {
    await prisma.jobGrade.upsert({
      where: { id: grade.id },
      update: {},
      create: grade,
    });
  }

  const jobCategoriesData = [
    { id: 'managerial', label: 'Managerial' },
    { id: 'professional', label: 'Professional' },
    { id: 'clerical', label: 'Clerical' },
    { id: 'non-clerical', label: 'Non-Clerical' },
  ];
  for (const category of jobCategoriesData) {
    await prisma.jobCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  const employmentTypesData = [
    { id: 'permanent', label: 'Permanent' },
    { id: 'contract', label: 'Contract' },
    { id: 'temporary', label: 'Temporary' },
    { id: 'internship', label: 'Internship' },
  ];
  for (const type of employmentTypesData) {
    await prisma.employmentType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  const educationAwardsData = [
    { id: 'certificate', label: 'Certificate' },
    { id: 'diploma', label: 'Diploma' },
    { id: 'bachelors-degree', label: 'Bachelor\'s Degree' },
    { id: 'masters-degree', label: 'Master\'s Degree' },
    { id: 'phd', label: 'PhD' },
  ];
  for (const award of educationAwardsData) {
    await prisma.educationAward.upsert({
      where: { id: award.id },
      update: {},
      create: award,
    });
  }

  const fieldsOfStudyData = [
    { id: 'accounting', label: 'Accounting' },
    { id: 'management', label: 'Management' },
    { id: 'economics', label: 'Economics' },
    { id: 'law', label: 'Law' },
    { id: 'computer-science', label: 'Computer Science' },
    { id: 'business-administration', label: 'Business Administration' },
  ];
  for (const field of fieldsOfStudyData) {
    await prisma.fieldOfStudy.upsert({
      where: { id: field.id },
      update: {},
      create: field,
    });
  }

  const institutionsData = [
    { id: 'addis-ababa-university', label: 'Addis Ababa University', institutionType: 'Government' },
    { id: 'mekelle-university', label: 'Mekelle University', institutionType: 'Government' },
    { id: 'unity-university', label: 'Unity University', institutionType: 'Private' },
    { id: 'admas-university', label: 'Admas University', institutionType: 'Private' },
  ];
  for (const institution of institutionsData) {
    await prisma.institution.upsert({
      where: { id: institution.id },
      update: {},
      create: institution,
    });
  }

  const programTypesData = [
    { id: 'regular', label: 'Regular' },
    { id: 'distance', label: 'Distance' },
    { id: 'extension', label: 'Extension' },
    { id: 'weekend', label: 'Weekend' },
  ];
  for (const type of programTypesData) {
    await prisma.programType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  const allowanceTypesData = [
    { id: 'housing-allowance', label: 'Housing Allowance', description: 'Allowance for housing expenses.', isTaxable: true },
    { id: 'transport-allowance', label: 'Transport Allowance', description: 'Allowance for commuting expenses.', isTaxable: false },
    { id: 'communication-allowance', label: 'Communication Allowance', description: 'Allowance for mobile and internet bills.', isTaxable: false },
    { id: 'representation-allowance', label: 'Representation Allowance', description: 'Allowance for representation duties.', isTaxable: true },
    { id: 'hardship-allowance', label: 'Hardship Allowance', description: 'Allowance for working in difficult locations.', isTaxable: false },
  ];
  for (const type of allowanceTypesData) {
    await prisma.allowanceType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  const disciplinaryActionTypesData = [
    { id: 'first-warning', label: 'First Warning' },
    { id: 'second-warning', label: 'Second Warning' },
    { id: 'final-warning', label: 'Final Warning' },
    { id: 'suspension', label: 'Suspension' },
  ];
  for (const type of disciplinaryActionTypesData) {
    await prisma.disciplinaryActionType.upsert({
      where: { id: type.id },
      update: {},
      create: type,
    });
  }

  // Seed departments (handle parent relationship)
  const departmentsData = [
      { id: '001', label: 'Engineering', departmentTypeId: 'department', parentId: null, capacity: 50, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '002', label: 'Marketing', departmentTypeId: 'department', parentId: null, capacity: 20, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '003', label: 'Sales', departmentTypeId: 'department', parentId: null, capacity: 30, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '004', label: 'Human Resources', departmentTypeId: 'department', parentId: null, capacity: 15, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '005', label: 'Product', departmentTypeId: 'department', parentId: null, capacity: 25, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '006', label: 'Finance', departmentTypeId: 'department', parentId: null, capacity: 10, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
      { id: '007', label: 'Operations', departmentTypeId: 'department', parentId: null, capacity: 40, regionId: 'addis-ababa', workLocationId: 'head-office', branchGradeId: null },
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
    { id: 'software-engineer', label: 'Software Engineer', jobCategoryId: 'professional', jobGradeId: 'Grade 10', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
    { id: 'senior-software-engineer', label: 'Senior Software Engineer', jobCategoryId: 'professional', jobGradeId: 'Grade 12', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
    { id: 'product-manager', label: 'Product Manager', jobCategoryId: 'managerial', jobGradeId: 'Grade 15', isHeadOfDepartment: true, managesDepartmentTypeId: null, managedDepartments: { connect: [{ id: '005' }] } },
    { id: 'marketing-manager', label: 'Marketing Manager', jobCategoryId: 'managerial', jobGradeId: 'Grade 14', isHeadOfDepartment: true, managesDepartmentTypeId: null, managedDepartments: { connect: [{ id: '002' }] } },
    { id: 'sales-representative', label: 'Sales Representative', jobCategoryId: 'clerical', jobGradeId: 'Grade 8', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
    { id: 'hr-specialist', label: 'HR Specialist', jobCategoryId: 'professional', jobGradeId: 'Grade 9', isHeadOfDepartment: false, managesDepartmentTypeId: null, managedDepartments: { connect: [] } },
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
        label: 'Grade 15 Structure',
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
        label: 'Grade 10 Structure',
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
    { id: "EMP002", fullName: "Bob Williams", departmentId: "002", jobTitleId: "marketing-manager", status: 'ACTIVE', contact: { create: { workEmail: "bob.w@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
    { id: "EMP003", fullName: "Charlie Brown", departmentId: "003", jobTitleId: "sales-representative", status: 'ON_LEAVE', contact: { create: { workEmail: "charlie.b@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
    { id: "EMP004", fullName: "Diana Miller", departmentId: "004", jobTitleId: "hr-specialist", status: 'ACTIVE', contact: { create: { workEmail: "diana.m@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
    { id: "EMP005", fullName: "Ethan Davis", departmentId: "001", jobTitleId: "software-engineer", status: 'TERMINATED', contact: { create: { workEmail: "ethan.d@example.com" } }, avatar: "https://placehold.co/40x40.png", joinDate: new Date() },
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
