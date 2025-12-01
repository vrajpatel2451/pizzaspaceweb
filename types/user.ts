export interface RegisterUserPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  cartIds?: string[];
}
export interface LoginUserPayload {
  email: string;
  password: string;
  cartIds?: string[];
}

export interface UserResponse {
  phone: string;
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponseWithToken {
  user: UserResponse;
  token: string;
}
