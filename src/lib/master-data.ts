
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
        { value: 'engineering', label: 'Engineering' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'sales', label: 'Sales' },
        { value: 'human-resources', label: 'Human Resources' },
        { value: 'product', label: 'Product' },
        { value: 'finance', label: 'Finance' },
        { value: 'operations', label: 'Operations' },
    ],
    jobTitles: [
        { value: 'software-engineer', label: 'Software Engineer' },
        { value: 'senior-software-engineer', label: 'Senior Software Engineer' },
        { value: 'product-manager', label: 'Product Manager' },
        { value: 'marketing-manager', label: 'Marketing Manager' },
        { value: 'sales-representative', label: 'Sales Representative' },
        { value: 'hr-specialist', label: 'HR Specialist' },
    ],
    jobGrades: Array.from({ length: 22 }, (_, i) => ({ value: `I-${i + 1}`, label: `Grade I-${i + 1}` })),
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
        { value: 'addis-ababa-university', label: 'Addis Ababa University' },
        { value: 'mekelle-university', label: 'Mekelle University' },
        { value: 'unity-university', label: 'Unity University' },
        { value: 'admas-university', label: 'Admas University' },
    ],
};


let masterData = { ...initialMasterData };

if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem('masterData');
    if (storedData) {
        try {
            masterData = JSON.parse(storedData);
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
