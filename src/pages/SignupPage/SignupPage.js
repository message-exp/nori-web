import React, { useState } from 'react';
import { usePage } from '../../context/PageContext';
import './SignupPage.css'

function SignupPage()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [error_hint, setErrorHint] = useState('');
    const { changePage } = usePage();

    const handleSignup = () =>
    {
        if (password !== confirm_password)
        {
            setErrorHint('confirm password is not the same as password')
            return;
        }
        else
        {
            setErrorHint('')    
        }

        // 可能放個註冊邏輯之後放登入邏輯?

        // changePage('home')
    };

    const handelGoLogin = () =>
    {
        changePage('login')
    }

    return (
        <div className='main-container'>
            <h1 className='title self-title'>Signup Page</h1>
            <p className='title self-subtitle'>Host: { null || 'Unknown'}</p>
            <input
                type="text"
                className='input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                className='input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="password"
                className='input'
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
            />

            <p className='hint-text error'>{error_hint}</p>

            <button className='button' onClick={handleSignup}>sign up</button>

            <p className='clickable-text' onClick={handelGoLogin}>
                or login
            </p>
        </div>
    );
}

export default SignupPage;
