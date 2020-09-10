const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function hasNumber(value: string) {
    return /\d/.test(value);
}

export const isEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email.toLowerCase());
};

export const checkPasswordComplexity = (password: string | undefined | null): boolean => {
    return password !== null && password !== undefined && password.length >= 6 && hasNumber(password);
};

export const checkEmptyCategoryId = (categoryId: string | undefined | null): boolean => {
    return categoryId !== null && categoryId !== undefined && categoryId !== '0';
};
