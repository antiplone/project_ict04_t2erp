import React, { useState } from 'react';
import axios from 'axios';
import Appconfig from "#config/AppConfig.json";

function TextClassifier() {
	const fetchURL = Appconfig.fetch['mytest']
	const [inputText, setInputText] = useState('');
	const [label, setLabel] = useState('');
	const [error, setError] = useState('');
	const [result, setResult] = useState('');

  const handleSubmit = async () => {
    try {
	const response = await axios.post(`${fetchURL.protocol}${fetchURL.url}/classify`, {
		/*const response = await axios.post(`http://localhost:5000/classify`, {*/
			text: inputText,
		});
      setLabel(response.data.label);
      setResult(response.data.result); // result 값을 상태에 저장
      setError('');
    } catch (err) {
      setLabel('');
      setResult('');
      setError('Error occurred: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <h2>텍스트 분류기</h2>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text here"
      />
      <br />
      <button onClick={handleSubmit}>Classify</button>
      
      {label && <p>Predicted Label: {label}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>분류 결과:</h3>
      <p>{result}</p> {/* result 값을 화면에 표시 */}
    </div>
  );
}

export default TextClassifier;