import React from 'react';
// import { useNavigate } from 'react-router-dom';
import '../styles/AppStyles.css';

function StyleDemoPage()
{
    // const navigate = useNavigate();

    const handleNext = () =>
    {
        console.log("Button clicked");
    };

    const handleLinkClick = () =>
    {
        console.log("Link clicked");
    };

    return (
        <div className="demo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1 className="title">Title Example</h1>

            <input
                type="text"
                className="input"
                placeholder="Enter something..."
            />

            <input
                type="text"
                className="input"
                placeholder='another'

            />

            <button className="button" onClick={handleNext}>
                Button Example
            </button>

            <p className="clickable-text" onClick={handleLinkClick}>
                Clickable Text Example
            </p>
        </div>
    );
}

export default StyleDemoPage;
