
export interface Overview {
    users: number;
    orders: number;
}

export type GetOverviewResponse = {
    success: true;
    overview: Overview;
} | {
    success: false;
    error: string;
};
