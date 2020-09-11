
export interface Picture {
    id: string;
    filename: string;
}

export type DeletePictureResponse = {
    success: true;
} | {
    success: false;
    error: string;
};
