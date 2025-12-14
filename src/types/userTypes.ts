export type UserResponse = {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    enabled: boolean,
    emailVerified?: boolean | null,
    createdAt?: string | null
}

export type CreateUserPayload = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    enabled: boolean;
    emailVerified: boolean;
}