export enum Roles {
  user = 'user',
  admin = 'admin',
}

export type ReturningData = {
  id: string;
  email: string;
  role: Roles;
  token: string;
};

export type RequestingData = {
  id: string;
  email: string;
  role: Roles;
};
