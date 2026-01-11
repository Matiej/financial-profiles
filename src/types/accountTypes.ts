export type AccountResponse = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  emailVerified: boolean;
  createdAt: string;
};

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
};
