import React, { Component } from 'react';
import './App.css';
// import DashboardView from "./components/DashboardView/DashboardView";
import Dashboard from './components/Daskboard';

class App extends Component {
  render() {
    return (
      <main className="App">
        <div className="App-header">
          <h2>Client-A Dashboard</h2>
        </div>
        {/* <DashboardView /> */}
        <Dashboard />
      </main>
    );
  }
}

export default App;
