export enum Roles {
  user = 'user',
  admin = 'admin',
}

export type ReturningData = {
  id: string;
  email: string;
  role: Roles;
  confirmation: boolean;
  token: string;
};

export type RequestingData = {
  id: string;
  email: string;
  role: Roles;
  confirmation: boolean;
};
