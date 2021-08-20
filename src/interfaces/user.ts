export interface UserAttributes {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  roles: string[];
}
