import { apiFetch } from "./api-fetch";
import { Category } from "@/contexts/auth/types";

export interface ModulePermission {
  id: number;
  name: string;
  label: string;
}

interface PermissionsByModule {
  [moduleName: string]: ModulePermission[];
}
  
  interface CreateCategoryPayload {
    name: string;
    subcategory: string;
    about: string;
    icon: string;
  }
  
  interface AddRolePermissionsPayload {
    id: number;
    permissionNames: string[];
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  export async function getSubcategories(): Promise<string[]> {
    return apiFetch<string[]>(`${API_URL}/documents/categories/subcategories`, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });
  }

  export async function getCategoriesList(): Promise<Category[]> {
    return apiFetch<Category[]>(`${API_URL}/documents/categories`, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });
  }
  
  export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
    return apiFetch<Category>(`${API_URL}/documents/categories`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
 
  
  export async function getCategoryById(id: number): Promise<Category> {
    return apiFetch<Category>(`${API_URL}/documents/categories/${id}`, {
      method: "GET",
    });
  }

  export async function deleteCategory(id: number): Promise<Category> {
    return apiFetch<Category>(`${API_URL}/documents/categories/${id}`, {
      method: "DELETE",
    });
  }

  export async function editCategory(categoryId: number, payload: CreateCategoryPayload): Promise<Category> {
    return apiFetch<Category>(`${API_URL}/documents/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }