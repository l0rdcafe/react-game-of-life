import React from "react";
import Counter from "./counter";
import Controls from "./controls";
import GameBoard from "./gameboard";
import {
  maxDensityStillLife,
  firstGenPulsar,
  gliderGun,
  crazyCorners,
  pulsar,
  pentadecathlon,
  gliderGunAndPulsars
} from "./utils";

class GameOfLife extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentBoard: gliderGunAndPulsars,
      generation: 0,
      running: false,
      intervalID: "",
      showPatterns: false,
      patterns: []
    };
  }
  componentDidMount = () => {
    this.beginSimulation();
  };
  createBoard = cells => {
    const config = [];
    for (let i = 0; i < 30; i += 1) {
      config.push([]);
      for (let j = 0; j < 50; j += 1) {
        if (cells === "randomize") {
          config[i].push(Math.random() < 0.5 ? 0 : 1);
        } else {
          config[i].push(cells);
        }
      }
    }
    return config;
  };
  createPattern = arr => {
    const pattern = this.createBoard(0);
    for (let i = 0; i < arr.length; i += 1) {
      const row = arr[i][0];
      const cell = arr[i][1];
      pattern[row][cell] = 1;
    }
    return pattern;
  };
  beginSimulation = () => {
    if (this.state.running) {
      return null;
    }

    this.setState({
      intervalID: setInterval(() => {
        this.nextGen();
      }, 100)
    });
  };
  nextGen = () => {
    const board = this.state.currentBoard;
    const count = this.state.generation;

    this.setState({ generation: count + 1, currentBoard: this.nextBoard(board), running: true });
  };
  pauseSimulation = () => {
    if (this.state.running) {
      clearInterval(this.state.intervalID);
      this.setState({ running: false });
    } else {
      this.beginSimulation();
    }
  };
  randomize = () => {
    clearInterval(this.state.intervalID);
    this.setState({
      currentBoard: this.createBoard("randomize"),
      generation: 0,
      running: false,
      intervalID: ""
    });
    setTimeout(() => {
      this.beginSimulation();
    }, 100);
  };
  reset = () => {
    clearInterval(this.state.intervalID);
    this.replaceState(this.getInitialState());

    setTimeout(() => {
      this.beginSimulation();
    }, 100);
  };
  clearBoard = () => {
    clearInterval(this.state.intervalID);

    this.setState({
      currentBoard: this.createBoard(0),
      generation: 0,
      running: false,
      intervalID: ""
    });
  };
  nextBoard = board => {
    const nxtBoard = [];

    board.forEach((row, i) => {
      nxtBoard.push([]);
      row.forEach((cell, j) => {
        const buddies = this.countCellBuddies(i, j, board);
        const life = 1;
        const death = 0;
        let fate;

        if (cell === 1) {
          fate = buddies >= 2 && buddies <= 3 ? life : death;
        } else {
          fate = buddies === 3 ? life : death;
        }

        nxtBoard[i].push(fate);
      });
    });
    return nxtBoard;
  };
  countCellBuddies = (i, j, board) => {
    function isCellOccupied(x, y) {
      if (board[x]) {
        return board[x][y];
      }
    }

    let numBuds = 0;

    if (isCellOccupied(i - 1, j - 1)) {
      numBuds += 1;
    }

    if (isCellOccupied(i - 1, j)) {
      numBuds += 1;
    }

    if (isCellOccupied(i - 1, j + 1)) {
      numBuds += 1;
    }

    if (isCellOccupied(i, j - 1)) {
      numBuds += 1;
    }

    if (isCellOccupied(i, j + 1)) {
      numBuds += 1;
    }

    if (isCellOccupied(i + 1, j - 1)) {
      numBuds += 1;
    }

    if (isCellOccupied(i + 1, j)) {
      numBuds += 1;
    }

    if (isCellOccupied(i + 1, j + 1)) {
      numBuds += 1;
    }

    return numBuds;
  };
  convertToOneDimension(arr) {
    const oneDim = [];
    arr.forEach(row => {
      row.map(cell => oneDim.push(cell));
    });
    return oneDim;
  }
  clickChanger = e => {
    const { id } = e.target;
    const el = document.getElementById(id);
    const color = window.getComputedStyle(el).getPropertyValue("background-color");
    const row = Math.floor(id / 50);
    const col = id % 50;
    const update = this.state.currentBoard;

    if (color.includes("rgb(0, 0, 0)")) {
      update[row][col] = 1;
    } else {
      update[row][col] = 0;
    }

    this.setState({ currentBoard: update });
  };
  togglePatterns = () => {
    const pattern = !this.state.showPatterns
      ? [
          "Glider Gun",
          "Pulsar",
          "Crazy Corners",
          "Pentadecathlon",
          "Baby Pulsar",
          "Load Pattern",
          "Maximum Density Still Life"
        ]
      : [];
    this.setState({ showPatterns: !this.state.showPatterns, patterns: pattern });
  };
  selectPattern = e => {
    const pattern = e.target.innerText;
    const patterns = {
      "Glider Gun": this.createPattern(gliderGun),
      "Crazy Corners": this.createPattern(crazyCorners),
      Pentadecathlon: this.createPattern(pentadecathlon),
      Pulsar: this.createPattern(pulsar),
      "Baby Pulsar": this.createPattern(firstGenPulsar),
      "Maximum Density Still Life": this.createPattern(maxDensityStillLife)
    };

    clearInterval(this.state.intervalID);
    this.setState({
      currentBoard: pattern === "Load Pattern" ? gliderGunAndPulsars : patterns[pattern],
      generation: 0,
      running: false,
      intervalID: ""
    });
  };
  render() {
    const dead = { background: "black" };
    const alive = { background: "#66ff33" };
    const board = this.convertToOneDimension(this.state.currentBoard);
    const drawBoard = board.map((cell, i) => {
      const color = cell === 0 ? dead : alive;
      return <div id={i} onClick={this.clickChanger} className="cell" style={color} key={i} />;
    });
    const animateClass = this.state.showPatterns ? "show" : "hide";
    const patterns = this.state.patterns.map(pattern => (
      <div className="pattern" key={pattern} onClick={this.selectPattern}>
        {pattern}
      </div>
    ));

    return (
      <div>
        <div className="title">Conway's Game of Life</div>
        <GameBoard create={drawBoard} />
        <div className="bottomTab">
          <Counter count={this.state.generation} />
          <Controls
            handleClick={this.pauseSimulation}
            label="Start/Pause/Resume"
            tooltip="Press pause while a simulation is running, click on some cells, and see what happens when you resume!"
          />
          <Controls handleClick={this.randomize} label="Randomize" />
          <Controls
            handleClick={this.clearBoard}
            label="Clear Board"
            tooltip="Clear the board and click on the cells to make your own patterns!"
          />
          <Controls
            handleClick={this.togglePatterns}
            label="Patterns"
            tooltip="Some cool pre-loaded patterns! Select, then go back one menu to run."
          />
          <div className={`${animateClass} patternsWrapper`}>
            <div>
              <div>Patterns:</div>
              {patterns}
              <div className="back" onClick={this.togglePatterns}>
                Back
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GameOfLife;
