import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 

function Square(props) {
    let btn_class = 'square'
    return (
      <button className={btn_class} data-id={props.id} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square value={this.props.squares[i]} id={i} onClick={() => this.props.onClick(i)}/>;
    }
  
    render() {
      return (
        <div>
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
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        history : [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,  
      }
    }
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares:squares,
        }]),
        stepNumber: history.length,
        xIsNext:!this.state.xIsNext,
      });
    }
    jumpTo(step) {
      changeColor(null)
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step, move) => {
        const desc = move ? 
          'Go to move # ' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
      let status
      if (winner) {
        status = 'Winner: ' + winner;
      }else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  function calculateWinner(squares) {
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
    let draw = 0;
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        const win = [a, b, c];
        changeColor(win)
        return squares[a];
      }
    }
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] != null) {
        draw++;
      }
    }
    if (draw == squares.length) {
      return 'Draw'
    }
    return null;
  }
  function changeColor(win) {
    document.querySelectorAll('.square').forEach(domContainer => {
      const dataID = parseInt(domContainer.dataset.id, 10)
      if (win == null) {
        if (domContainer.classList.contains('red-color')) {
          domContainer.classList.remove('red-color')
        }
      }else {
        for (let i = 0; i < win.length; i++) {
          if (dataID == win[i]){
            domContainer.classList.add('red-color');
            break;
          }
        }
      }
    })
  }
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  