
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
  prompt: `You are an HR assistant tasked with writing a formal Work Experience Letter for an employee at "Nib International Bank".
  
  The letter must be structured as follows:
  1.  Start with today's date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
  2.  Add the salutation "To Whom It May Concern,".
  3.  The opening paragraph must be: "This letter is to certify that {{{name}}} has been an employee at Nib International Bank. During their tenure with us, they have held the following positions:"
  4.  Present the work history in a clean, table-like format with headers: "Job Position", "Start Date", and "End Date". Do not use markdown table syntax. Use spaces to align the columns.
  5.  Conclude the letter professionally with "Sincerely," followed by "Nib International Bank HR Department".
  
  Employee Name: {{{name}}}
  
  Internal Work Experience (for the table):
  {{#each internalExperience}}
  - Position: {{{this.title}}}, Start: {{{this.startDate}}}, End: {{{this.endDate}}}
  {{/each}}
  
  Do not include any information not provided above. The tone must be formal. The output should be plain text for a PDF.
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
