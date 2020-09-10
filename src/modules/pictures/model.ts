
export interface Picture {
    id: string;
    filename: string;
    createdAt: string;
    updatedAt: string;
}

export type DeletePictureResponse = {
    success: true;
} | {
    success: false;
    error: string;
};
