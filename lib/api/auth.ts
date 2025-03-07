import type { User } from "@/lib/types"
import { api } from "./axios"
import axios, { AxiosError } from "axios"

// Backenddan kelgan xato formatini ifodalovchi interface
export interface ApiError {
  success: false;
  errors: Array<{
    field?: string;
    message: string;
  }>;
}

// Xatolik yuz berganda ularni qayta ishlash uchun funksiya
export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Backenddan kelgan formatdagi xato
    if (axiosError.response?.data?.errors) {
      const apiError = axiosError.response.data;
      
      // Custom error ob'ekti yaratish
      const customError = new Error(
        apiError.errors.map((err: any) => err.message).join(", ")
      );
      
      // Error ob'ektiga qo'shimcha ma'lumotlarni qo'shish
      (customError as any).errors = apiError.errors;
      (customError as any).rawErrors = apiError;
      
      throw customError;
    } else if (axiosError.response?.data?.message) {
      // Boshqa turdagi backend xatoliklari
      const errorMessage = axiosError.response.data.message;
      const customError = new Error(errorMessage);
      (customError as any).errors = [{ message: errorMessage }];
      throw customError;
    }
    
    // Oddiy axios xatoligi
    throw new Error(axiosError.message || "So'rov yuborishda xatolik yuz berdi");
  }
  
  // Boshqa turdagi xatoliklar
  if (error instanceof Error) {
    throw error;
  }
  
  // Noma'lum xatolik
  throw new Error("Noma'lum xatolik yuz berdi");
}

export async function register(userData: { fullname: string; email: string; password: string }) {
  try {
    const { data } = await api.post('/auth/register', userData);
    return data;
  } catch (error) {
    
    throw handleApiError(error);
  }
}

export const apiLogin = async (email: string, password: string) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  } catch (error) {
    
    throw handleApiError(error);
  }
}

// Keep the original login function for direct use
export const login = apiLogin;

export async function getMe(): Promise<User> {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateProfile(userData: { fullname?: string; email?: string; password?: string }): Promise<User> {
  try {
    const { data } = await api.patch('/auth/me', userData);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteAccount(): Promise<void> {
  try {
    await api.delete('/auth/me');
  } catch (error) {
    throw handleApiError(error);
  }
}

