export interface Address {
    address?: any;
    confirmed?: any;
    unconfirmed?: any;
}

export interface steemConnect {
    userId?: number;
    isAuthenticated?: boolean;
    username?: string;
    permissions?: Array<string>;
    token?: Array<string>;
};