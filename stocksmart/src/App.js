import './App.css';
import LandingPage from './LandingPage';
import Navbar from './Navbar';
import UserHome from './UserHome';

function App() {
  return (
    <div className="App">

      <Navbar/>

      <LandingPage />
      <UserHome/>
    </div>
  );
}

export default App;
