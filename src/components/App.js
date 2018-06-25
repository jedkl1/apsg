import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import RLS from './rls';
import LMS from './lms';
import '../bootstrap-3.3.7-dist/css/bootstrap.min.css';

import '../styles/App.css';
import '../styles/spinner.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  
  handleSelect(key) {
    this.setState({ key });
  }
  
  render() {

    return (
      <div className="App">
          <Tabs
            activeKey={Number(this.state.key)}
            id="uncontrolled-tab-example"
            onSelect={this.handleSelect}>
            <Tab eventKey={1} title="HOME">
              Welcome in my application. It presents works of RLS and LMS algorithms.
              Switch parameters and see differences. 
            </Tab>
            <Tab eventKey={2} title="RLS">
              <RLS/>
            </Tab>
            <Tab eventKey={3} title="EWRLS">
              EWRLS
            </Tab>
            <Tab eventKey={4} title="LMS">
              <LMS />
            </Tab>
            <Tab eventKey={5} title="NLMS">
              NLMS
            </Tab>
          </Tabs>
      </div>
    );
  }
}

export default App;
/* Created by Jedrzej Klocek 20.06.2018*/