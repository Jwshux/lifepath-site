import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { AuthModalProvider } from './context/AuthModalContext';
import './styles/Global.css';

function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
          <Navbar />
          <Home />
          <Footer />
          <AuthModal />
      </AuthModalProvider>
    </AuthProvider>
  );
}

export default App;