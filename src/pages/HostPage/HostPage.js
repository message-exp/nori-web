import React, { useState } from 'react';
import { usePage } from '../../context/PageContext';
import './HostPage.css'

function EnterHostPage()
{
    const [host, setHost] = useState('');
    const [hint_ip, setIPHint] = useState('');
    const { changePage } = usePage();

    const handleNext = () =>
    {
        var isValid = checkLoginValid();
        if (isValid)
        {
            changePage('login');
            setIPHint('');
        }
        else
        {
            setIPHint('✕ this ip is not valid');
        }
    };

    const checkLoginValid = () =>
    {
        // 判斷邏輯放在這裡

        // 以下就個模擬的邏輯
        if (host === '192.168.1.1')
        {
            
            return true;
        }
        else
        {
            
            return false
        }

    }

    const handelKeyDown = (event) =>
    {
        if (event.key === 'Enter')
        {
            handleNext();  // 按下 Enter 後執行跳轉
        }
    }

    return (
        <div className='main-container'>
            <h1 className='title self-title'>Enter Host</h1>

            <input
                type="text"
                className='input'
                value={host}
                onChange={(e) => setHost(e.target.value)}
                onKeyDown={handelKeyDown}
                placeholder="Enter host IP"
            />

            <p className='hint-text self-error'>{ hint_ip }</p>

            <button className='button' onClick={handleNext}>Next</button>
        </div>
    );
}

export default EnterHostPage;
