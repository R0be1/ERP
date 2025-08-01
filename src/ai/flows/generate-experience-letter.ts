
'use server';
/**
 * @fileOverview A flow for generating a work experience letter.
 * 
 * - generateExperienceLetter - A function that handles the letter generation process.
 * - GenerateExperienceLetterInput - The input type for the flow.
 * - GenerateExperienceLetterOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExperienceSchema = z.object({
    title: z.string(),
    department: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    managerialRole: z.boolean().optional(),
});

const GenerateExperienceLetterInputSchema = z.object({
    name: z.string().describe('Full name of the employee.'),
    joinDate: z.string().describe('The date the employee joined the company.'),
    employmentType: z.string().describe('The type of employment (e.g., Permanent, Contract).'),
    internalExperience: z.array(ExperienceSchema).describe('A list of internal roles held by the employee.'),
});

export type GenerateExperienceLetterInput = z.infer<typeof GenerateExperienceLetterInputSchema>;

const GenerateExperienceLetterOutputSchema = z.object({
    letterContent: z.string().describe('The full text content of the generated work experience letter.'),
});

export type GenerateExperienceLetterOutput = z.infer<typeof GenerateExperienceLetterOutputSchema>;

export async function generateExperienceLetter(input: GenerateExperienceLetterInput): Promise<GenerateExperienceLetterOutput> {
    return generateExperienceLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExperienceLetterPrompt',
  input: { schema: GenerateExperienceLetterInputSchema },
  output: { schema: GenerateExperienceLetterOutputSchema },
  prompt: `You are an HR assistant tasked with writing a formal Work Experience Letter for an employee.
  
  Today's date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
  
  The letter should be addressed "To Whom It May Concern".
  
  Based on the following employee details, please draft a professional and concise work experience letter. The letter should confirm the employee's tenure and the positions they held within the company.
  
  Employee Name: {{{name}}}
  Join Date: {{{joinDate}}}
  Employment Type: {{{employmentType}}}
  
  Internal Work Experience:
  {{#each internalExperience}}
  - Position: {{{this.title}}}
    Department: {{{this.department}}}
    Duration: {{{this.startDate}}} to {{{this.endDate}}}{{#if this.managerialRole}} (Managerial Role){{/if}}
  {{/each}}
  
  The letter should state that the employee has worked with the company from their join date until the present. It should list the roles they have held as detailed in their internal experience. Conclude the letter professionally, for example, with "Sincerely, [Company Name] HR Department".
  
  Do not include any information not provided above. The tone should be formal. Structure the output as plain text suitable for a PDF document.
  `,
});

const generateExperienceLetterFlow = ai.defineFlow(
  {
    name: 'generateExperienceLetterFlow',
    inputSchema: GenerateExperienceLetterInputSchema,
    outputSchema: GenerateExperienceLetterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
