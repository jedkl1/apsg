import React, { Component } from 'react';
import * as math from 'mathjs';
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

import signals from '../signals.json';

class RLS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            L: 10,
            lambda: 1,
            gamma: 10,
            isSimulating: true,
            results: undefined
        };
        this.handleLChange = this.handleLChange.bind(this);
        this.handleLambdaChange = this.handleLambdaChange.bind(this);
        this.handleGammaChange = this.handleGammaChange.bind(this);
    }

    handleLChange(event) {
        this.setState({L: Number(event.target.value)});
    }

    handleLambdaChange(event) {
        this.setState({lambda: Number(event.target.value)});
    }

    handleGammaChange(event) {
        this.setState({gamma: Number(event.target.value)});
    }

    startSimulation() {
        
    }

    rlsExecute(x, d, L, lambda, gamma) {
        const N = x.length;
        let e = math.zeros(1, N);
        let y = math.zeros(1, N);
        let ff = math.zeros(L, N);

        let f_n = math.zeros(L);
        let x_n = Array.apply(null, Array(L)).map(Number.prototype.valueOf,0);

        let P = math.multiply(gamma, math.identity(L));

        for (let n = 0; n < N; n++) {
            x_n.unshift(x[n]);
            x_n.pop();
            
            y._data[0][n] = math.multiply(math.transpose(f_n), x_n);
            e._data[0][n] = d[n] - y._data[0][n];
            let alpha_n = 1 / (math.add(lambda, math.multiply(
                math.multiply(math.transpose(x_n), P),
                x_n)));
            f_n = math.add(f_n, math.multiply(math.multiply((alpha_n* e._data[0][n]), P), x_n));

            P = math.multiply((1/lambda), math.subtract(P, 
                math.multiply(math.multiply(math.multiply(math.multiply(alpha_n, P), x_n), math.transpose(x_n)), P)));
            
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
        this.rlsExecute(signals.x, signals.d, this.state.L, this.state.lambda, this.state.gamma);
    }

    componentDidUpdate(prevProps, prevStates) {
        if(this.state.L !== prevStates.L || this.state.lambda !== prevStates.lambda || this.state.gamma !== prevStates.gamma) {
            this.rlsExecute(signals.x, signals.d, this.state.L, this.state.lambda, this.state.gamma);
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
                &lambda;:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.lambda}
                    onChange={this.handleLambdaChange} />
            </label><br/>
            <label>
                &gamma;:
                <input
                    type="Number"
                    className={"form-control"}
                    value={this.state.gamma}
                    min={10} max={1000} step={100}
                    onChange={this.handleGammaChange} />
            </label><br/>
        </form>
        <div className="buttons">
            <button className={"btn btn-primary"} onClick={this.startSimulation}>Simulate</button>
            {
                this.state.isSimulating ? 
                    <div className="spinner">
                        <div className="cube1"></div>
                        <div className="cube2"></div>
                    </div>
                    :
                    null
            }
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

export default RLS;
/* Created by Jedrzej Klocek 20.06.2018*/