import { apiFetch } from "./api-fetch";
import { Customer } from "@/contexts/auth/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>(`${API_URL}/customers`, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });
}