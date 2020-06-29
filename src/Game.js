let cardsRoles = {
  genre: ["f", "h"],
  job: ["Plombier.e", "Masseur.se"],
  orientationS: ["Hétérosexuelle", "Homosexuelle"],
};

let futur = [
  "tu mérite de ne pas accepter les choses que tu ne veux pas",
  "lorem ipsum dolor sit amet",
  "lorem ipsum dolor sit amet",
  "lorem ipsum dolor sit amet",
];

let themes = ["amateur"];
let games = ["cultureQ", "tabou", "acteurX", "ouEst"];
let chosenGames = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = class Game {
  constructor({ sockets }) {
    this.players = sockets.map((socket) => ({ id: socket.id })) || [];
    this.theme;
    this.game;
    this.round = { laps: 0 };
  }
  initialize() {
    games = ["cultureQ", "tabou", "acteurX", "ouEst"];
    //player values
    this.drawCards();
    this.chooseFutur();
    //game values
    this.chooseTheme();
    this.chooseGame();
  }
  drawCards() {
    this.players.forEach((player) => {
      player.cardRole = {
        genre: cardsRoles.genre[getRandomInt(cardsRoles.genre.length)],
        job: cardsRoles.job[getRandomInt(cardsRoles.job.length)],
        orientationS:
          cardsRoles.orientationS[getRandomInt(cardsRoles.orientationS.length)],
      };
    });
  }
  chooseTheme() {
    this.theme = themes[getRandomInt(themes.length)];
  }
  chooseGame() {
    this.round.laps++;
    if (games.length < 1) {
      games = chosenGames;
      chosenGames = [];
    }
    // let chosenGameIndex = getRandomInt(games.length);
    let chosenGameIndex = this.round.laps - 1;
    console.log(chosenGameIndex);
    if (chosenGameIndex < games.length) {
      console.log("annuile");
      this.game = games[chosenGameIndex];
    } else {
      console.log("gamers");
      this.game = games[getRandomInt(games.length)];
    }
    // chosenGames.push(games[chosenGameIndex]);
    // games.splice(chosenGameIndex, 1);
  }
  chooseFutur() {
    this.players.forEach((player) => {
      player.futur = futur[getRandomInt(futur.length)];
    });
  }
  getPlayerById({ id }) {
    return this.players.filter((player) => {
      return player.id === id;
    })[0];
  }
};
