import React, { useState } from 'react';
import './Popup.css';

function Popup({ title = 'Title', onSubmit, onClose })
{
    const [inputValue, setInputValue] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [visible, setVisible] = useState(true);

    const handleSubmit = async () =>
    {
        const result = await onSubmit(inputValue);
        if (result)
        {
            setStatusMessage('Success!');
            setTimeout(() =>
            {
                setVisible(false);
                onClose();
            }, 1000);
        } else
        {
            setStatusMessage('Failed!');
            setTimeout(() =>
            {
                setVisible(false);
                onClose();
            }, 1000);
        }
    };

    return (
        visible && (
            <div className="popup-overlay">
                <div className="popup-content">
                    <h2>{title}</h2>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter text here"
                    />
                    <button onClick={handleSubmit}>Submit</button>
                    {statusMessage && <p className="status-message">{statusMessage}</p>}
                </div>
            </div>
        )
    );
}

export default Popup;
