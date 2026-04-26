/**
 * lib/validators.js
 * Zod schemas shared across forms.
 */

import { z } from 'zod';

export const CATEGORIES = [
  'Food', 'Transport', 'Entertainment', 'Health',
  'Shopping', 'Utilities', 'Education', 'Other',
];

export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

export const expenseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title is too long'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid positive amount (e.g. 12.50)'),
  currency: z.enum(CURRENCIES, { errorMap: () => ({ message: 'Select a currency' }) }).default('INR'),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: 'Select a category' }) }),
  date: z.string().min(1, 'Date is required'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(60),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
