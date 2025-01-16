import React, { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';

interface AIResponse {
  model: string;
  response: string;
  loading: boolean;
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>([
    { model: 'ChatGPT', response: '', loading: false },
    { model: 'Gemini', response: '', loading: false },
    { model: 'Claude', response: '', loading: false },
    { model: 'DeepSeek', response: '', loading: false },
  ]);

  const callOpenAI = async (prompt: string) => {
    const url = "https://openai-service-gd.openai.azure.com/openai/deployments/gpt-4-32k/chat/completions?api-version=2024-08-01-preview";
    const headers = {
      "Content-Type": "application/json",
      "api-key": "1TqLT0wRJhp3J6Fqlf4Qi0BfRBynR35A4dbfSWzTwtGRIqKFQDfuJQQJ99BAACL93NaXJ3w3AAABACOG1R2H"
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
      return `Error: Failed to get response from OpenAI`;
    }
  };

  const callGemini = async (prompt: string) => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA3myRCymuhjFIAO1agAjj0UZlgXSyIOw8";
    const headers = {
      "Content-Type": "application/json"
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error:', error);
      return `Error: Failed to get response from Gemini`;
    }
  };

  const callDeepSeek = async (prompt: string) => {
    // #"sk-604904899c4345398f0cedb0862e5ada"
    const api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnZGdkanVyaWNAZ21haWwuY29tIiwiaWF0IjoxNzM3MDAwMDUwfQ.U97aENvybV8RDOo2Fmfish5LyeYRI7V0YuKALZ39uuk"

    const url = "https://api.hyperbolic.xyz/v1/chat/completions/";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${api_key}`
    };

    const data = {
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt}
      ],
      temperature: 0.7,
      max_tokens: 800
    }

    const jsonBody = JSON.stringify(data)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: jsonBody
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error:', error);
      return `Error: Failed to get response from DeepSeek`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Set all responses to loading state
    setResponses(prev => prev.map(r => ({ ...r, loading: true, response: '' })));

    // Call OpenAI API for ChatGPT
    try {
      const openAIResponse = await callOpenAI(prompt);
      setResponses(prev => prev.map(r => {
        if (r.model === 'ChatGPT') {
          return { ...r, loading: false, response: openAIResponse };
        }
        return r;
      }));
    } catch (error) {
      setResponses(prev => prev.map(r => {
        if (r.model === 'ChatGPT') {
          return { ...r, loading: false, response: 'Error: Failed to get response' };
        }
        return r;
      }));
    }

    // Call Gemini API
    try {
      const geminiResponse = await callGemini(prompt);
      setResponses(prev => prev.map(r => {
        if (r.model === 'Gemini') {
          return { ...r, loading: false, response: geminiResponse };
        }
        return r;
      }));
    } catch (error) {
      setResponses(prev => prev.map(r => {
        if (r.model === 'Gemini') {
          return { ...r, loading: false, response: 'Error: Failed to get response' };
        }
        return r;
      }));
    }

    // Call DeepSeek API
    try {
      const deepSeekResponse = await callDeepSeek(prompt);
      setResponses(prev => prev.map(r => {
        if (r.model === 'DeepSeek') {
          return { ...r, loading: false, response: deepSeekResponse };
        }
        return r;
      }));
    } catch (error) {
      setResponses(prev => prev.map(r => {
        if (r.model === 'DeepSeek') {
          return { ...r, loading: false, response: 'Error: Failed to get response' };
        }
        return r;
      }));
    }

    // Simulate remaining AI responses for demonstration
    setTimeout(() => {
      setResponses(prev => prev.map(r => {
        if (r.model === 'Claude') {
          return { ...r, loading: false, response: `Claude mock response to: ${prompt}` };
        }
        return r;
      }));
    }, 2000);

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-blue-600"/>
            <h1 className="text-2xl font-bold text-gray-900">mChatCompares - multi AI Responses</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4 text-lg"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {responses.map((response, index) => (
            <div
              key={response.model}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {response.model}
              </h2>
              <div className="min-h-[200px] bg-gray-50 rounded-lg p-4">
                {response.loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : response.response ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{response.response}</p>
                ) : (
                  <p className="text-gray-400 text-center">Response will appear here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;