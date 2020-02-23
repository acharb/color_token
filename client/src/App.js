import React, { Component } from "react";
import Color from "./contracts/Color.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      totalSupply: 0,
      all_colors: [],
      my_colors: [],
      account: ''
    }

  }

  async loadColors() {

    const contract = this.state.contract;

    const totalSupply = await contract.methods.totalSupply().call();
    this.setState({totalSupply});

    const all_colors = [];
    for (var i = 0; i < totalSupply; i++){
      const new_color = await contract.methods.colors(i).call();
      all_colors.push(new_color);
    }

    const my_colors = [];
    const my_token_ids = await contract.methods.my_token_ids().call();
    for (i = 0; i < my_token_ids.length; i++){
      my_colors.push(all_colors[my_token_ids[i]]);
    }

    this.setState({all_colors, my_colors});
  }

  async loadBlockchainData(){
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Color.networks[networkId];
    const contract = new web3.eth.Contract(
      Color.abi,
      deployedNetwork && deployedNetwork.address,
    );
    this.setState({ web3, accounts, contract, account});
  }

  async componentDidMount() {
    try {
      await this.loadBlockchainData();
      await this.loadColors();
    } catch (error) {
      alert(
        'Failed to load web3, accounts, or contract. Check console for details.',
      );
      console.error(error);
    }
  }

  mint(_color, _shape) {
    const contract = this.state.contract;
    contract.methods.mint(_color, _shape).send({from: this.state.account}).on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({
           totalSupply: Number(this.state.totalSupply) + 1, 
           my_colors: [...this.state.my_colors, _color], 
           all_colors: [...this.state.all_colors, _color]
         });
    });

  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <h2>Account {this.state.account} </h2>
        <h2>Contract Address: {this.state.contract._address} </h2>
        <h2>Total Supply: {this.state.totalSupply} </h2>
        <h2>Mint</h2>
        <form onSubmit={(event) => {
          event.preventDefault();
          const color = this.color.value;
          const token_uri = this.token_uri.value;
          this.mint(color, token_uri);
        }}>
          <input type="text" placeholder="eg.#FFFFFF" ref={(input) => {this.color = input}} />
          <input type="text" placeholder="eg. square" ref={(input) => {this.token_uri = input}} />
          <input type="submit" value="MINT" />
        </form>
        <h2>All Colors: {this.state.all_colors} </h2>
        <h2>My Colors: {this.state.my_colors} </h2>
      </div>
    );
  }
}

export default App;

