
export interface iUser {
    uid: string;
    displayName?: string;
    processor?: string | null;
    email?: string | null;
    phone?: string | null;
    photoURL?: string;
    createdAt?: any;
    updatedAt?: any;
}

export interface iProcessor {
    name: string;
    sponsor: string;
    apiUrl?: string;
    id?: string;
    createdAt?: any;
    updatedAt?: any;
}