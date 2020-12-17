import { Router, Link } from '@reach/router';
import DrawingsPage from './drawingsPage';
import ImageUploadsPage from './imageUploadsPage';
import { Drawings } from './drawings';
import { Statistics } from './statistics';
import './App.css';


function App() {
  return (
    <>
    <Router>
      <Statistics path ="score"/>
      <Drawings path ="/" />
    </Router>

    </>
  );
}

export default App;
