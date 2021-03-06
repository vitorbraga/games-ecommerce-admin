function hasNumber(value: string) {
    return /\d/.test(value);
}

export const checkPasswordComplexity = (password: string | undefined | null): boolean => {
    return password !== null && password !== undefined && password.length >= 6 && hasNumber(password);
};

export const checkEmptyCategoryId = (categoryId: string | undefined | null): boolean => {
    return categoryId !== null && categoryId !== undefined && categoryId !== '0';
};
