export interface AuthUser {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole?: string | null;
}

export interface LoginPayload {
  userId: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: AuthUser;
}
