
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
  prompt: `You are an HR assistant at "Nib International Bank". Your task is to generate a formal Work Experience Letter.
  
  Follow this structure precisely:
  1.  Start with the current date aligned to the right. Use the format: DD/MM/YYYY.
  2.  Add two newlines.
  3.  Add the salutation "To Whom It May Concern," aligned to the left.
  4.  Add two newlines.
  5.  The opening paragraph must be exactly: "This letter is to certify that {{{name}}} has been an employee at Nib International Bank. During their tenure with us, they have held the following positions:"
  6.  Add two newlines.
  7.  Present the work history in a table format with the headers "Title", "Company", and "Date". Use spaces, not tabs or markdown, to align the columns.
      - The "Company" for all internal experience is "Nib International Bank".
      - The "Date" should be the range from start to end date (e.g., "YYYY-MM-DD to YYYY-MM-DD" or "YYYY-MM-DD to Present").
  8.  Add two newlines after the table.
  9.  The closing paragraph must be exactly: "We have found {{{name}}} to be a diligent, hardworking, and valuable member of our team. We wish them all the best in their future endeavors."
  10. Add four newlines for a signature space.
  11. Add the bank's name: "Nib International Bank".

  Here is the employee's information:
  Employee Name: {{{name}}}
  Work History:
  {{#each internalExperience}}
  - Title: {{{this.title}}}, Company: Nib International Bank, Date: {{{this.startDate}}} to {{{this.endDate}}}
  {{/each}}
  
  The entire output must be plain text suitable for a PDF, with professional spacing and alignment.
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
