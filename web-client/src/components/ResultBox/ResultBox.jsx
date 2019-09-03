import React, { Component } from 'react';
import './ResultBoxStyle.css';

class ResultBox extends Component {
    state = { 
        result: "Use border utilities to quickly style the border"
    };

    render() { 
        return ( 
            <div className="result-box"> 
                <span>{this.state.result}</span>
            </div>
        );
    }
}
 
export default ResultBox;