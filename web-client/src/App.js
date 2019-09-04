import React, { Component } from "react";
import "./App.css";
import DashboardView from "./components/DashboardView/DashboardView";

class App extends Component {
  render() {
    return (
      <main className="App">
        <div className="App-header">
          <h2>Client-A Dashboard</h2>
        </div>
        <DashboardView />
      </main>
    );
  }
}

export default App;
