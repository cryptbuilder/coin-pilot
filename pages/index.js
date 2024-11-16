// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [message, setMessage] = useState('');

    const getBestSwapRate = async () => {
        const [fromCurrency, toCurrency] = parsePrompt(prompt);
        if (!fromCurrency || !toCurrency) {
            setResponse('Please provide a valid prompt like "What is the best price for ETH to USDT?"');
            return;
        }

        try {
            const res = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${fromCurrency}`);
            const rate = res.data.data.rates[toCurrency];
            setResponse(`The best swap rate for ${fromCurrency} to ${toCurrency} is ${rate}.`);
        } catch (error) {
            console.error(error);
            setResponse('Error fetching swap rate.');
        }
    };

    const executeSwap = async () => {
        const [fromCurrency, toCurrency, amount] = parseSwapPrompt(prompt);
        if (!fromCurrency || !toCurrency || !amount) {
            setMessage('Please provide a valid swap instruction like "Swap 1 ETH to USDT".');
            return;
        }

        try {
            const res = await axios.post(`https://api.coinbase.com/v2/swap`, {
                from: fromCurrency,
                to: toCurrency,
                amount: amount,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_ACCESS_TOKEN`, // Replace with your access token
                },
            });
            setMessage(`Swap executed: ${res.data}`);
        } catch (error) {
            console.error(error);
            setMessage('Error executing swap.');
        }
    };

    const parsePrompt = (prompt) => {
        const regex = /best price for (\w+) to (\w+)/i;
        const match = prompt.match(regex);
        return match ? [match[1], match[2]] : [null, null];
    };

    const parseSwapPrompt = (prompt) => {
        const regex = /swap (\d+\.?\d*) (\w+) to (\w+)/i;
        const match = prompt.match(regex);
        return match ? [match[2], match[3], match[1]] : [null, null, null];
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Coinbase Swap App</h1>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
                style={styles.input}
            />
            <button onClick={getBestSwapRate} style={styles.button}>Get Best Swap Rate</button>
            <p>{response}</p>
            <button onClick={executeSwap} style={styles.button}>Execute Swap</button>
            <p>{message}</p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        margin: '10px',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    input: {
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '300px',
    },
};