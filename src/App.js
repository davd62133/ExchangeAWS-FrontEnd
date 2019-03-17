import React, { Component } from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currencies:[],
            conversion:[],
            first:"USD",
            second:"COP",
            amount:1
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentDidMount() {
        fetch('https://l68mt224pl.execute-api.us-east-1.amazonaws.com/prod/exchange?s=list')
            .then(response => response.json())
            .then(data => this.setState({currencies: JSON.parse(data.message).currencies}));

        fetch('https://l68mt224pl.execute-api.us-east-1.amazonaws.com/prod/exchange?s=none')
            .then(response => response.json())
            .then(data => this.setState({conversion: JSON.parse(data.message).quotes}));
    }

    getKeys(array){
        var keys = [];
        for(var k in array) keys.push(k);
        return keys;
    }

    getConversion(){
        if(this.state.conversion[this.state.first+this.state.second] !== undefined) {
            return this.state.conversion[this.state.first + this.state.second] * this.state.amount;
        }else if(this.state.conversion[this.state.second+this.state.first] !== undefined){
            return   this.state.amount / this.state.conversion[this.state.second + this.state.first] ;
        }else{
            return (this.state.amount/this.state.conversion["USD"+this.state.first])*
                this.state.conversion["USD"+this.state.second];
        }
    }


    render() {
    return (
      <div className="App">
          <AppBar position="static" color="primary">
              <Toolbar>
                  <Typography variant="h6" color="inherit">
                      Exchange App
                  </Typography>
              </Toolbar>
          </AppBar>
          <form>
              <Typography variant="h5" color="textSecondary">
                Amount To Convert:
              </Typography>
              <br/>

              <FormControl variant="outlined">
                    <TextField required={true}
                               label="Amount"
                               type="number"
                               variant="outlined"
                               value={this.state.amount}
                               name="amount"
                                onChange={this.handleChange}/>
              </FormControl>
          <br/>
              <Typography variant="h5" color="textSecondary">
                  Currencies:
              </Typography>
          <br/>
              <FormControl variant="outlined">
                  <InputLabel htmlFor="first" required={true}>From</InputLabel>
                  <Select value={this.state.first} onChange={this.handleChange}
                          input={
                              <OutlinedInput
                                  name="first"
                                  id="first"
                                  labelWidth={100}
                              />
                          }>
                      {
                        this.getKeys(this.state.currencies).map((value)=>{
                            return(
                                <MenuItem key={value} value={value}>
                                    {value} ({this.state.currencies[value]})
                                </MenuItem>
                            )
                            })
                      }
                  </Select>
              </FormControl>
              <br/>
              <br/>
              <FormControl variant="outlined">
                  <InputLabel htmlFor="second" required={true}>To</InputLabel>
                  <Select value={this.state.second} onChange={this.handleChange}
                          input={
                              <OutlinedInput
                                  name="second"
                                  id="second"
                                  labelWidth={100}
                              />
                          }>
                      {
                        this.getKeys(this.state.currencies).map((value)=>{
                            return(
                                <MenuItem key={value} value={value}>
                                    {value} ({this.state.currencies[value]})
                                </MenuItem>
                            )
                            })
                      }
                  </Select>
                  <br/>
                  <Typography variant="h5" color="textSecondary">
                      Result
                  </Typography>
                  <br/>
                  <Typography variant="h4">
                      {this.getConversion().toString()}
                  </Typography>
              </FormControl>
          </form>
      </div>
    );
  }
}

export default App;
