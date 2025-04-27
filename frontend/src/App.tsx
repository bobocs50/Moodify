
import React from 'react';
import { useState } from 'react';

const App: React.FC = () => {


  //question and chatbot function
  const questions= [
    "What is the best thing that has happend to you today?",                 
    "How would you describe your day to someone in just 3 sentences?",       
    "What comes to mind when you're thinking of tomorrow or the days that follow?",   
    "What are you working on in your free time and how is it going?",         
    "What is something thats been stuck on your mind lately?" 
      ];
  
  
  // State to track current question index, user answers, and input value
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatCompleted, setChatCompleted] = useState(false);
  
  
  // State to store the fetched catchMood data
  const [catchMood, setCatchMood] = useState<string | null>('-');

  // Function to fetch catchMood
  const fetchCatchMood = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/catchMood', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCatchMood(data.mood); // Save only the 'mood' property in state
        console.log('Catch Mood:', data);
      } else {
        console.error('Failed to fetch catchMood:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching catchMood:', error);
    }
  };

  // Fetch catchMood when the component mounts
  React.useEffect(() => {
    fetchCatchMood();
  }, []);




  const handleLogin = () => {
    // Redirect the user to the backend login endpoint and send with JSON 
    window.location.href = 'http://127.0.0.1:5001/api/login';
  };

  var playlistLink = "";

  //Get playlist link from express
  const getPlaylist = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/playlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      playlistLink = data.playlistUrl;
      console.log('Playlist Link:', playlistLink);
      window.location.href = playlistLink;

      return data;

    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  };


  //NOCO CODE!!!! START HERE
  let updatedAnswers = [...userAnswers, inputValue];

  // Handle input change
  const handleSubmitAnswer = () => {
    if (inputValue.trim() === '') return;

    // Add the answer to our answers array
    const updatedAnswers = [...userAnswers, inputValue];
    setUserAnswers(updatedAnswers);
    
    // Clear input field
    setInputValue('');
    
    // Move to next question / finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // When all questions are completed
      setChatCompleted(true);
      console.log("Chat completed");
      //answers are sent to backend as json
      console.log("User answers: ", updatedAnswers);
      
      sendAnswersToAPI().then(() => {
        fetchCatchMood(); // Refetch catchMood after sending answers
      });
      sendAnswersToAPI(); // when chatcmoleted send data to backendd
      
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();



    }
  };


  const sendAnswersToAPI = async () => {
    const response = await fetch('http://127.0.0.1:5001/api/post-queries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: updatedAnswers}),
    });
    await response.json(); 
  };
  

  //NOCO CODE!!!! END HERE








  return (
    <>
      {/* Blur circle background */}
      


      {/* Navbar */}
      <nav className="bg-black py-3 p-4 shadow-lg">
        <div className="container mx-auto">
          <span className="text-2xl text-white font-bold">MOODIFY</span>
        </div>
      </nav>

      {/* H1 Comment */}
      <div className="flex justify-center mt-32 text-black text-4xl font-bold">
        <h1>Mood-based Spotify playlists, powered by AI. </h1>
      </div>
      
      {/* Textbox */}

      <div className="flex justify-center mt-10"> 
        <div className="mt-24 bg-white w-text-w h-text-h rounded-3xl shadow-lg shadow-gray-500/50 border-2 ">

            {/* Chat Section */}
            <div className="flex-col">
            <div className="flex justify-center items-center mt-9">
              <h1 className="text-black text-lg font-bold mr-2">Current Mood: {catchMood}</h1>
            </div>





            <div className="flex justify-center">
            <div className="h-80 w-chat-w mt-7 overflow-y-auto mb-4 p-3 border-2 shadow-lg border-gray-300 border-opacity-90 rounded-lg bg-white">
                {/* Display previous questions and answers */}
                {userAnswers.map((answer, index) => (
                  <div key={`qa-${index}`} className="mb-4">
                  <div className="font-medium text-black">{questions[index]}</div>
                  <div className="pl-4 mt-1 text-gray-700">{answer}</div>
                  </div>
                ))}

                {/* Current question */}
                {!chatCompleted && (
                  <div className="font-medium text-black">
                  {questions[currentQuestionIndex]}
                  </div>
                )}

                {/* Completion message */}
                {chatCompleted && (
                  <div className="text-spotify font-medium">
                  Thank you for completing the mood check-in!
                  </div>
                )}
                </div>

            </div>
    
            
            </div>
                


            {/* Input Box */}
            {!chatCompleted && (
            <div className="flex justify-center mt-5">
              <div className="flex items-center bg-gray-200 w-96 h-10 rounded-lg px-4">
              <img src="/chat.png" alt="Chat Icon" className="w-6 h-6 mr-4" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your answer here..."
                className="flex-grow bg-gray-200 placeholder-gray-600 focus:outline-none"
              />
              </div>
            </div>
            )}




          {/* Buttons */}
            <div className="flex justify-around -space-x-24 mt-3">
                <button 
                  onClick={handleLogin} 
                  className="bg-spotify w-button-w h-10 rounded-lg flex items-center justify-center space-x-2"
                >
                  <img src="/spotify.png" className="w-6 h-6" alt="Spotify Logo" />
                  <h1 className="text-white text-sm font-medium">
                  Login with Spotify
                  </h1>
                </button>

                <button 
                  onClick={getPlaylist} 
                  className="bg-gray-200 w-button-w h-10 rounded-lg ring-2 ring-inset ring-spotify"
                >
                  <h1 className="flex justify-center items-center h-full text-sm font-medium">
                  Get Playlist
                  </h1>
                </button>
            </div>
        </div>
      </div>
    
      <div className="absolute top-0 left-[800px] w-[1000px] h-[1000px] bg-spotify rounded-full opacity-30 filter blur-3xl -z-10" style={{ top: '-200px' }}></div>

      <div className="absolute bottom-0 -left-[500px] w-[1000px] h-[1000px] bg-spotify rounded-full opacity-30 filter blur-3xl -z-10" style={{ bottom: '-400px' }}></div>





    </>
  );
};

export default App;