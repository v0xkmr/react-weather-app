import React, { Component } from 'react';
import Weather from './components/Weather';
import './main.css';

class App extends Component {
  render() {
    return (
      <div className="outer">
        <Weather />
      </div>
    );
  }
}

export default App;
