import React from 'react';

const App: React.FC = () => {
  const handleLogin = () => {
    // Redirect the user to the backend login endpoint
    window.location.href = 'http://127.0.0.1:5001/api/login';
  };

  const handleTest = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/post-queries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-blue-600">Welcome to MoodHack</h1>
        <p className="text-gray-700 mt-4">This is a simple React application.</p>
        <button
          onClick={handleLogin}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login with Spotify
        </button>
        <button
          onClick={handleTest}
          className="mt-6 ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test API
        </button>
      </div>
    </div>
  );
};

export default App;