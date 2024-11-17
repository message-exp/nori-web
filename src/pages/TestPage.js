import React from 'react';
import { usePage } from '../context/PageContext';

const TestPage = () =>
{
    const { changePage } = usePage();

    return (
        <div>
            <h1>Test Page</h1>
            <p>Click a button to navigate to a page:</p>
            <button onClick={() => changePage('host')}>Go to Host Page</button>
            <button onClick={() => changePage('demo')}>Go to Style Demo Page</button>
            <button onClick={() => changePage('login')}>Go to Login Page</button>
            <button onClick={() => changePage('home')}>Go to User Home Page</button>
            <button onClick={() => changePage('signup')}>Go to Signup Page</button>
        </div>
    );
};

export default TestPage;
