import * as React from 'react';

export class RegisterSuccess extends React.PureComponent<{}, never> {
    public render() {
        return (
            <div>
                <h1>Register success</h1>
                <p>Will have an image, thanks for registering, link to login</p>
                <p>It can also have some message "check your email" to activate</p>
            </div>
        );
    }
}
