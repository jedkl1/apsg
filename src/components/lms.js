import React, { Component } from 'react';
import * as math from 'mathjs';
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

import signals from '../signals.json';

class LMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            L: 10,
            alpha: 0.1,
            isSimulating: true,
            results: undefined
        };
        this.handleLChange = this.handleLChange.bind(this);
        this.handleAlphaChange = this.handleAlphaChange.bind(this);
    }

    handleLChange(event) {
        this.setState({L: Number(event.target.value)});
    }

    handleAlphaChange(event) {
        this.setState({alpha: Number(event.target.value)});
    }

    startSimulation() {
        
    }

    lmsExecute(x, d, L, alpha) {
        const N = x.length;
        let e = math.zeros(1, N);
        let y = math.zeros(1, N);
        let ff = math.zeros(L, N);

        let f_n = math.zeros(L);
        let x_n = Array.apply(null, Array(L)).map(Number.prototype.valueOf,0);

        for (let n = 0; n < N; n++) {
            x_n.unshift(x[n]);
            x_n.pop();
            
            y._data[0][n] = math.multiply(math.transpose(f_n), x_n);
            e._data[0][n] = d[n] - y._data[0][n];
            
            f_n = math.add(f_n, math.multiply((alpha* e._data[0][n]), x_n));

            for(let i = 0; i < 10; i++) {
                ff._data[i][n] = f_n._data[i];
            }
        }
        
        const _est = e._data[0].map((obj, index) => (
            {nr_probki: index+1, res: obj}
        ));
        const _y = y._data[0].map((obj, index) => (
            {nr_probki: index+1, res: obj}
        ));

        this.setState({ results: {e: _est, y: _y, ff: ff} }, this.drawPlot());
    }

    drawPlot() {

    }

    componentDidMount() {
        //this.lmsExecute(signals.x, signals.d, this.state.L, this.state.alpha);
    }

    componentDidUpdate(prevProps, prevStates) {
        if(this.state.L !== prevStates.L || this.state.alpha !== prevStates.alpha) {
            this.lmsExecute(signals.x, signals.d, this.state.L, this.state.alpha);
        }
    }

    render() {
        
    return (
      <div className="rls col-md-12">
        <form>
            <label>
                L:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.L}
                    onChange={this.handleLChange} />
            </label><br/>
            <label>
                &alpha;:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.alpha}
                    onChange={this.handleAlphaChange} />
            </label><br/>
        </form>
        <div className="buttons">
            <button className={"btn btn-primary"} onClick={this.startSimulation}>Simulate</button>
            <button className={"btn btn-success"} onClick={this.drawPlot}>Draw</button>
        </div>
        {
            this.state.results ?
            <LineChart width={800} height={500} data={this.state.results.e}>
                <XAxis dataKey="nr_probki"/>
                <YAxis/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="res" stroke="#8884d8" />
            </LineChart>
            : null
        }
        
      </div>
    );
  }
}

export default LMS;

/* Created by Jedrzej Klocek 20.06.2018*/