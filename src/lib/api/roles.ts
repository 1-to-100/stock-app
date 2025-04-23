import { apiFetch } from "./api-fetch";

export interface ModulePermission {
  id: number;
  name: string;
  label: string;
}

interface PermissionsByModule {
  [moduleName: string]: ModulePermission[];
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  abbreviation?: string;
  permissions: PermissionsByModule; 
  _count: {
    users: number;
  };
}
  
  interface CreateRolePayload {
    name: string;
    description: string;
  }
  
  interface AddRolePermissionsPayload {
    id: number;
    permissionNames: string[];
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  export async function getRoles(): Promise<Role[]> {
    return apiFetch<Role[]>(`${API_URL}/roles`, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });
  }
  
  export async function createRole(payload: CreateRolePayload): Promise<Role> {
    return apiFetch<Role>(`${API_URL}/roles`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  
  export async function addRolePermissions(payload: AddRolePermissionsPayload): Promise<Role> {
    return apiFetch<Role>(`${API_URL}/roles/${payload.id}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permissionNames: payload.permissionNames }),
    });
  }
  
  export async function getRoleById(id: number): Promise<Role> {
    return apiFetch<Role>(`${API_URL}/roles/${id}`, {
      method: "GET",
    });
  }

  export async function editRole(roleId: number, payload: CreateRolePayload): Promise<Role> {
    return apiFetch<Role>(`${API_URL}/roles/${roleId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }