import React, {Component} from 'react';
import './App.css';
import DashboardView from './components/DashboardView/DashboardView';

class App extends Component{

  handleSubmit = (method, api, value) =>{
    console.log(method + " " + value + " to " + api);
  }

  render(){
    return (
      <main className="App">
        <div className="App-header">
          <h2>Client-A Dashboard - </h2>
        </div>
        <div className="App-dashboard-forms-container">
          <DashboardView
            onSubmit = {this.handleSubmit}
          />
        </div>
      </main>
    );
  }
}

export default App