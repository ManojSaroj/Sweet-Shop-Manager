import { z } from 'zod';

// User schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Sweet schemas
export const CreateSweetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export const UpdateSweetSchema = CreateSweetSchema.partial();

export const SweetSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  quantity: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Search schemas
export const SearchSweetsSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// Inventory schemas
export const PurchaseSchema = z.object({
  quantity: z.number().int().positive().default(1),
});

export const RestockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive'),
});

// Auth response schemas
export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Type exports
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateSweetDto = z.infer<typeof CreateSweetSchema>;
export type UpdateSweetDto = z.infer<typeof UpdateSweetSchema>;
export type Sweet = z.infer<typeof SweetSchema>;
export type SearchSweetsDto = z.infer<typeof SearchSweetsSchema>;
export type PurchaseDto = z.infer<typeof PurchaseSchema>;
export type RestockDto = z.infer<typeof RestockSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
