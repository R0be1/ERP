
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
        { value: 'software-engineer', label: 'Software Engineer', jobCategory: 'professional', jobGrade: 'grade-10' },
        { value: 'senior-software-engineer', label: 'Senior Software Engineer', jobCategory: 'professional', jobGrade: 'grade-12' },
        { value: 'product-manager', label: 'Product Manager', jobCategory: 'managerial', jobGrade: 'grade-15' },
        { value: 'marketing-manager', label: 'Marketing Manager', jobCategory: 'managerial', jobGrade: 'grade-14' },
        { value: 'sales-representative', label: 'Sales Representative', jobCategory: 'clerical', jobGrade: 'grade-8' },
        { value: 'hr-specialist', label: 'HR Specialist', jobCategory: 'professional', jobGrade: 'grade-9' },
    ],
    jobGrades: Array.from({ length: 22 }, (_, i) => ({ value: `grade-${i + 1}`, label: `Grade ${i + 1}` })),
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
    ]
};


let masterData: typeof initialMasterData = { ...initialMasterData };

if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem('masterData');
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            // Merge stored data with initial data to ensure all keys are present
            masterData = { ...initialMasterData, ...parsedData };
        } catch (e) {
            console.error("Failed to parse master data from localStorage", e);
        }
    }
}

const setMasterData = (newData: typeof initialMasterData) => {
    masterData = newData;
    if (typeof window !== 'undefined') {
        localStorage.setItem('masterData', JSON.stringify(newData));
    }
};

export { masterData, setMasterData };
