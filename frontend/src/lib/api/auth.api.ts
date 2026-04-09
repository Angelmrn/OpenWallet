import { fetcher } from "@/lib/fetcher";
import { User } from "@/types";

export const loginApi = (email: string, password: string) =>
  fetcher<{ accessToken: string; user: User }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerApi = (name: string, email: string, password: string) =>
  fetcher<{ message: string }>("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const verifyEmailApi = (token: string) =>
  fetcher<{ message: string }>(`/verify-email/${token}`);

export const getMeApi = () => fetcher<{ user: User }>("/me");

export const logoutApi = () =>
  fetcher<{ message: string }>("/logout", { method: "POST" });
