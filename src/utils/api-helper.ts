export const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:4000';
export const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

export enum FetchStatusEnum {
    initial = 'initial',
    loading = 'loading',
    success = 'success',
    failure = 'failure'
}

// TODO improve this
export type FetchStatus = 'initial' | 'loading' | 'success' | 'failure';

export interface Builder {
    withJwt: (token: string) => Builder;
    with: (name: string, value: string) => Builder;
    build: () => Headers;
}

export function headersBuilder() {
    const headers = new Headers();
    const builder: Builder = {
        withJwt: (token: string) => (headers.append('auth', token), builder),
        with: (name: string, value: string) => (headers.append(name, value), builder),
        build: () => headers
    };

    return builder;
}
