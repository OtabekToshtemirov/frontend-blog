import type { User } from "@/lib/types"
import { api } from "./axios"

export async function register(userData: { fullname: string; email: string; password: string }) {
  const { data } = await api.post('/auth/register', userData);
  return data;
}

export const apiLogin = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

// Keep the original login function for direct use
export const login = apiLogin;

export async function getMe(): Promise<User> {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function updateProfile(userData: { fullname?: string; email?: string; password?: string }): Promise<User> {
  const { data } = await api.patch('/auth/me', userData);
  return data;
}

export async function deleteAccount(): Promise<void> {
  await api.delete('/auth/me');
}

