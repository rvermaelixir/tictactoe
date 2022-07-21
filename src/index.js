import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

class Board extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      values: Array(9).fill(null),
      currentItem: "X",
      playerDefaultValue: {name: null, score: 0},
      players: {"X": {name: null, score: 0}, "O": {name: null, score: 0}},
      gameActive: false,
      currentPlayer: null,
      status: null,
    };
  }

  renderSquare(i){
    return <Square value={i} items={this.state.values} label={this.state.label} disabled={this.state.status} onClick={() => this.setValue(i)}/>
  }
  allBoxesFilled = (values) => {
    console.log(values.filter(x => x === null))
    return values.filter(x => x === null).length == 0
  }
  setValue = (index) => {
    let updatedValues = this.state.values

      if(updatedValues[index] == null){
        const nextPlayer = (this.state.currentItem == 'X')? "O": "X"
        updatedValues[index] = this.state.currentItem
        if(this.checkResults()){
          let updatedPlayersWin = this.updatePlayerWin(this.state.players, this.state.currentItem)
          this.setState({
            status: `${this.state.currentPlayer.name} is the winner`,
            players: updatedPlayersWin
          })
        }else{
          if(this.allBoxesFilled(updatedValues)){
            this.setState({
              status: 'Match Draw',
            })
          }
          else{
            this.setState({
              values: updatedValues,
              currentItem: nextPlayer,
              currentPlayer: this.state.players[nextPlayer]
            })
          }

        }
      }

  }

  updatePlayerWin = (players, currentPlayerIndex) => {
    players[currentPlayerIndex]["score"] = players[currentPlayerIndex]["score"]+1
    return players
  }

  checkResults = () => {
    const squares = this.state.values
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  renderBoard = (currentPlayer) => {
    const status = this.state.status || `${this.state.currentPlayer.name} please make a move`
    return(
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <div>
          <button onClick={() => this.playAgain()} disabled={this.state.status === null}>Play Again</button>
          <button onClick={() => this.endGame()}  disabled={this.state.status === null}>End Game</button>
        </div>
        <ScoreBoard players={this.state.players} />
      </div>
    )
  }

  endGame = () => {
    this.setState({
      players: {"X": this.state.playerDefaultValue, "O": this.state.playerDefaultValue},
      currentPlayer: null,
      status: null,
      values: Array(9).fill(null),
      gameActive: false
    })
  }

  playAgain = () => {
    console.log(this.state.currentItem)
    this.setState({
      status: null,
      values: Array(9).fill(null)
    })
  }

  toss = () => {
    if(this.state.players["O"].name && this.state.players["X"].name){
      if(Math.random()%2 == 0){
        let player1 = this.state.players["O"]
        let player2 = this.state.players["X"]
        this.setState({
          players: {"X": player1, "O": player2},
          gameActive: true,
          currentPlayer: player1
        })
      }else{
        const currentPlayer = this.state.players["X"]
        this.setState({
          gameActive: true,
          currentPlayer
        })
      }
    }
  }

  updateFirstPerson = (event) => {
    let players = this.state.players
    let player = players["X"]
    player["name"]= event.target.value
    this.state.players["X"] = player
    this.setState({
      players: players
    })
  }

  updateSecondPerson = (event) => {
    let players = this.state.players
    let player = players["O"]

    player["name"]= event.target.value
    players["O"] = player
    this.setState({
      players: players
    })
  }

  renderPlayerForm = () => {
    return(
          <div>
            <div>Player 1 : <input type = "text" onInput = {(e) => this.updateFirstPerson(e)}/></div>
            <div>Player 2 : <input type = "text" onInput = {(e) => this.updateSecondPerson(e)}/></div>
            <button onClick={() => this.toss()}>Toss</button>
          </div>
    )
  }

  render(){
      if(this.state.gameActive === true){
        return(this.renderBoard(this.state.currentPlayer))
      }else{
        return(this.renderPlayerForm())
      }
  }

}

class ScoreBoard extends React.Component{
  render(){
    return(
      <div>
        <table>
          <tr>
            <td>Player</td>
            <td>Score</td>
          </tr>
          <tr>
            <td>{this.props.players["X"].name} (X)</td>
            <td>{this.props.players["X"].score}</td>
          </tr>
          <tr>
            <td>{this.props.players["O"].name} (O)</td>
            <td>{this.props.players["O"].score}</td>
          </tr>
        </table>
      </div>
    )
  }
}

function Square(props){
  return(
    <button className="square" onClick={props.onClick} disabled={props.disabled}>{props.items[props.value] || " "}</button>
  )
}


class Game extends React.Component{
  render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
        </div>
      );
    }
}

root.render(<Game />)
