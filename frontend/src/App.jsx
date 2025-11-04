import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AlertsPage from './pages/Alert.jsx';
import ChatbotPage from './pages/ChatBot.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // ✅ Removed TS type

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'alerts' && <AlertsPage />}
        {currentPage === 'chatbot' && <ChatbotPage />}
      </main>
    </div>
  );
}

export default App;
