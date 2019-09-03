import React, {Component} from 'react';
import './App.css';
import ResultBox from './components/ResultBox/ResultBox';
import DashboardForms from './components/DashboardForms/DashboardForms';

class App extends Component{

  state = {
    result: ""
  };

  render(){
    return (
      <main className="App">
        <div className="App-header">
          <h2>Client-A Dashboard - </h2>
        </div>
        <div className="App-dashboard-forms-container">
          <ResultBox />
          <DashboardForms/>
        </div>
      </main>
    );
  }
}

export default App