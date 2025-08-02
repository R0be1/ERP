

"use client";

import { useEffect, useState } from "react";

const initialMasterData = {
    regions: [
        { value: 'addis-ababa', label: 'Addis Ababa' },
        { value: 'afar', label: 'Afar' },
        { value: 'amhara', label: 'Amhara' },
        { value: 'benishangul-gumuz', label: 'Benishangul-Gumuz' },
        { value: 'dire-dawa', label: 'Dire Dawa' },
        { value: 'gambela', label: 'Gambela' },
        { value: 'harari', label: 'Harari' },
        { value: 'oromia', label: 'Oromia' },
        { value: 'somali', label: 'Somali' },
        { value: 'snnp', label: 'Southern Nations, Nationalities, and Peoples\'' },
        { value: 'tigray', label: 'Tigray' },
    ],
    departments: [
        { value: '001', label: 'Engineering', type: 'department', parent: '', capacity: '50', region: 'addis-ababa', location: 'head-office', branchGrade: '' },
        { value: '002', label: 'Marketing', type: 'department', parent: '', capacity: '20', region: 'addis-ababa', location: 'head-office', branchGrade: '' },
        { value: '003', label: 'Sales', type: 'department', parent: '', capacity: '30', region: 'addis-ababa', location: 'head-office', branchGrade: '' },
        { value: '004', label: 'Human Resources', type: 'department', parent: '', capacity: '15', region: 'addis-ababa', location: 'head-office', branchGrade: '' },
        { value: '005', label: 'Product', type: 'department', parent: '', capacity: '25', region: 'addis-ababa', location: 'head-office', branchGrade: '' },
        { value: '006', label: 'Finance', type: 'department', parent: '', capacity: '10', region: 'addis-ababa', location: 'head-office', branchGrade: '' },
        { value: '007', label: 'Operations', type: 'department', parent: '', capacity: '40', region: 'addis-ababa', location: 'head-office', branchGrade: '' },
    ],
    jobTitles: [
        { value: 'software-engineer', label: 'Software Engineer', jobCategory: 'professional', jobGrade: 'Grade 10', isHeadOfDepartment: false, managedDepartments: [], managesDepartmentType: '' },
        { value: 'senior-software-engineer', label: 'Senior Software Engineer', jobCategory: 'professional', jobGrade: 'Grade 12', isHeadOfDepartment: false, managedDepartments: [], managesDepartmentType: '' },
        { value: 'product-manager', label: 'Product Manager', jobCategory: 'managerial', jobGrade: 'Grade 15', isHeadOfDepartment: true, managedDepartments: ['005'], managesDepartmentType: '' },
        { value: 'marketing-manager', label: 'Marketing Manager', jobCategory: 'managerial', jobGrade: 'Grade 14', isHeadOfDepartment: true, managedDepartments: ['002'], managesDepartmentType: '' },
        { value: 'sales-representative', label: 'Sales Representative', jobCategory: 'clerical', jobGrade: 'Grade 8', isHeadOfDepartment: false, managedDepartments: [], managesDepartmentType: '' },
        { value: 'hr-specialist', label: 'HR Specialist', jobCategory: 'professional', jobGrade: 'Grade 9', isHeadOfDepartment: false, managedDepartments: [], managesDepartmentType: '' },
    ],
    jobGrades: Array.from({ length: 22 }, (_, i) => ({ value: `Grade ${i + 1}`, label: `Grade ${i + 1}` })),
    jobCategories: [
        { value: 'managerial', label: 'Managerial' },
        { value: 'professional', label: 'Professional' },
        { value: 'clerical', label: 'Clerical' },
        { value: 'non-clerical', label: 'Non-Clerical' },
    ],
    educationAwards: [
        { value: 'certificate', label: 'Certificate' },
        { value: 'diploma', label: 'Diploma' },
        { value: 'bachelors-degree', label: 'Bachelor\'s Degree' },
        { value: 'masters-degree', label: 'Master\'s Degree' },
        { value: 'phd', label: 'PhD' },
    ],
    fieldsOfStudy: [
        { value: 'accounting', label: 'Accounting' },
        { value: 'management', label: 'Management' },
        { value: 'economics', label: 'Economics' },
        { value: 'law', label: 'Law' },
        { value: 'computer-science', label: 'Computer Science' },
        { value: 'business-administration', label: 'Business Administration' },
    ],
    institutions: [
        { value: 'addis-ababa-university', label: 'Addis Ababa University', institutionType: 'Government' },
        { value: 'mekelle-university', label: 'Mekelle University', institutionType: 'Government' },
        { value: 'unity-university', label: 'Unity University', institutionType: 'Private' },
        { value: 'admas-university', label: 'Admas University', institutionType: 'Private' },
    ],
    employmentTypes: [
        { value: 'permanent', label: 'Permanent' },
        { value: 'contract', label: 'Contract' },
        { value: 'temporary', label: 'Temporary' },
        { value: 'internship', label: 'Internship' },
    ],
    programTypes: [
        { value: 'regular', label: 'Regular' },
        { value: 'distance', label: 'Distance' },
        { value: 'extension', label: 'Extension' },
        { value: 'weekend', label: 'Weekend' },
    ],
    departmentTypes: [
        { value: 'ceo-office', label: 'Office of Chief Executive Officer' },
        { value: 'co-office', label: 'Office of Chief Officer' },
        { value: 'dco-office', label: 'Office of Deputy Chief Officer' },
        { value: 'department', label: 'Department' },
        { value: 'division', label: 'Division' },
        { value: 'branch', label: 'Branch' },
        { value: 'district', label: 'District' },
    ],
    workLocations: [
        { value: 'head-office', label: 'Head Office' },
        { value: 'district', label: 'District' },
        { value: 'city-branch', label: 'City Branch' },
        { value: 'outline-branch', label: 'Outline Branch' },
    ],
    branchGrades: [
        { value: 'premium-branch', label: 'Premium Branch' },
        { value: 'special-branch', label: 'Special Branch' },
        { value: 'i', label: 'I' },
        { value: 'ii', label: 'II' },
        { value: 'iii', label: 'III' },
        { value: 'iv', label: 'IV' },
        { value: 'v', label: 'V' }
    ],
    allowanceTypes: [
        { value: 'housing', label: 'Housing Allowance', description: 'Allowance for housing expenses.', isTaxable: true, defaultBasis: 'fixed', defaultValue: '5000', appliesTo: 'all' },
        { value: 'transport', label: 'Transport Allowance', description: 'Allowance for commuting expenses.', isTaxable: false, defaultBasis: 'fixed', defaultValue: '2000', appliesTo: 'all' },
        { value: 'communication', label: 'Communication Allowance', description: 'Allowance for mobile and internet bills.', isTaxable: false, defaultBasis: 'fixed', defaultValue: '1000', appliesTo: 'managerial' },
    ],
    salaryStructures: [
        { 
            value: 'SS001', 
            label: 'Managerial Grade 15',
            jobGrade: 'Grade 15', 
            jobTitle: '',
            effectiveDate: '2024-01-01',
            status: 'active',
            steps: [
                { step: '1', salary: '100000' },
                { step: '2', salary: '105000' },
                { step: '3', salary: '110000' },
            ],
            allowances: [
                { allowanceType: 'housing', basis: 'fixed', value: '15000', taxable: true, eligibilityRule: '' },
                { allowanceType: 'transport', basis: 'fixed', value: '5000', taxable: false, eligibilityRule: '' },
                { allowanceType: 'communication', basis: 'fixed', value: '2000', taxable: false, eligibilityRule: '' },
            ]
        },
        { 
            value: 'SS002', 
            label: 'Professional Grade 10',
            jobGrade: 'Grade 10', 
            jobTitle: '',
            effectiveDate: '2024-01-01',
            status: 'active',
            steps: [
                { step: '1', salary: '50000' },
                { step: '2', salary: '52500' },
            ],
            allowances: [
                { allowanceType: 'housing', basis: 'percentage', value: '10', taxable: true, eligibilityRule: '' },
                { allowanceType: 'transport', basis: 'fixed', value: '2000', taxable: false, eligibilityRule: '' },
            ]
        }
    ]
};


let masterData: typeof initialMasterData = { ...initialMasterData };

const getMasterData = () => {
    if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem('masterData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                // Merge stored data with initial data to ensure all keys are present
                const mergedData = { ...initialMasterData };
                for (const key in initialMasterData) {
                    if (parsedData[key]) {
                        (mergedData as any)[key] = parsedData[key];
                    }
                }
                return mergedData;
            } catch (e) {
                console.error("Failed to parse master data from localStorage", e);
            }
        }
    }
    return initialMasterData;
};

const setMasterData = (newData: typeof initialMasterData) => {
    masterData = newData;
    if (typeof window !== 'undefined') {
        localStorage.setItem('masterData', JSON.stringify(newData));
    }
};

export { initialMasterData, masterData, setMasterData, getMasterData };
