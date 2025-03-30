
import React, { useState } from 'react';


function App() {
  const [choice1, setChoice1] = useState('');
  const [choice2, setChoice2] = useState('');
  const [timeImportance, setTimeImportance] = useState(2);
  const [moneyImportance, setMoneyImportance] = useState(2);
  const [preferenceImportance, setPreferenceImportance] = useState(2);
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [coinFlipMode, setCoinFlipMode] = useState(false);
  const [coinRotation, setCoinRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const importanceLabel = (value) => {
    switch (value) {
      case 1: return 'Not Important';
      case 2: return 'Somewhat Important';
      case 3: return 'Very Important';
      default: return '';
    }
  };

  const preferenceLabel = (value) => {
    switch (value) {
      case 1: return 'Option A';
      case 2: return 'Neither';
      case 3: return 'Option B';
      default: return '';
    }
  };


  const handleGetAdvice = async () => {
    if (!choice1 || !choice2 || !timeImportance || !moneyImportance || !preferenceImportance) {
      alert('Please fill in all fields.'); // if not filled in give error
      return;
    }
    
    if (coinFlipMode) {
      const random = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const result = random === 'Heads' ? choice1 : choice2;
      const newSpinCount = spinCount + 1;
      setSpinCount(newSpinCount);
      const baseRotation = newSpinCount * 360 * 3; // always 3 spins
      const rotation = baseRotation + (random === 'Tails' ? 180 : 0);
      setCoinRotation(rotation); //add 1080 spin for smooth transition ????
      setAiResponse('');
  
      setTimeout(() => {
        setAiResponse(`Coin landed on..: ${result}`);
      }, 2000);
      return;
    }

    setLoading(true); // set loading after
    setAiResponse('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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', //api key goes here
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Decision Helper Enhanced',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `You are helping someone make decision. Help the user choose between:
- Option A: ${choice1}
- Option B: ${choice2}

Consider these decision factors:
- Time: ${timeImportance}
- Money: ${moneyImportance}
- Personal Preference: ${preferenceImportance}

Provide:
- A quick pros and cons comparison
- A clear recommendation based on these priorities
`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAiResponse(data.choices[0].message.content);
      } else {
        setAiResponse('No response received. Try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setAiResponse('Something went wrong. Check your API key or internet connection.');
    }

    setLoading(false);
  };

  const openWindowWithDimensions = () => {
    const width = 600;
    const height = 500;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    window.open(
      window.location.href, // Open the same URL in a new window
      '_blank',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };
  //linear-gradient(135deg,rgb(48, 162, 244) 0%,rgb(179, 93, 246) 100%)
  return (
    <div style={{ background: 'linear-gradient(135deg,rgb(244, 123, 48) 0%,rgb(179, 93, 246) 100%)', minHeight: '100vh', padding: '20px' }}>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(135deg,rgb(244, 123, 48) 0%,rgb(179, 93, 246) 100%)',
          padding: '20px',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, border: '2px solid black', padding: '10px'}}>Choosi</h1>
          <button onClick={openWindowWithDimensions} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Open in New Window
          </button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Option A: </label>
          <input value={choice1} onChange={(e) => setChoice1(e.target.value)} style={{ width: '97%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Option B: </label>
          <input value={choice2} onChange={(e) => setChoice2(e.target.value)} style={{ width: '97%', padding: '0.5rem' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Time: {importanceLabel(timeImportance)}</label>
          <input
            type="range"
            min="1"
            max="3"
            value={timeImportance}
            onChange={(e) => setTimeImportance(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Money: {importanceLabel(moneyImportance)}</label>
          <input
            type="range"
            min="1"
            max="3"
            value={moneyImportance}
            onChange={(e) => setMoneyImportance(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Preference: {preferenceLabel(preferenceImportance)}</label>
          <input
            className="preference-slider"
            type="range"
            min="1"
            max="3"
            value={preferenceImportance}
            onChange={(e) => setPreferenceImportance(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={coinFlipMode}
            onChange={(e) => setCoinFlipMode(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          when in doubt, flip it out
        </label>
      </div>

      {coinFlipMode && (
  <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
   
    <div
      className="coin"
      style={{
        transform: `rotateY(${coinRotation}deg)`,
        transition: 'transform 2s ease-in-out',
      }}
    >
      <div className="side heads">{choice1 || 'A'}</div>
      <div className="side tails">{choice2 || 'B'}</div>
    </div>
  </div>
    )}

        <button onClick={handleGetAdvice} disabled={loading} style={{ padding: '0.75rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}>
          {loading ? 'Thinking...' : 'Make your decision'}
        </button>

        {aiResponse && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;