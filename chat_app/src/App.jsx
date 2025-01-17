import { Fragment } from 'react';
import './App.css';
import Header from './components/header/Header';
import Room from './components/room/Room';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <Room />
    </Fragment>
  );
}

export default App;