import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

// if (process.env.NODE_ENV !== 'production') {
//     // (window as any).Perf = Perf;
//     (window as any).React = React;
// }

// window.addEventListener('hashchange', () => {
//     // Can be done by dispatching a state change - but reload seems easier and just as smooth for the user
//     location.reload();
// });

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
