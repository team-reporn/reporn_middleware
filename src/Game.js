let cardsRoles = {
  genre: ["h", "f", "nb"],
  job: ["plumber", "nurse"],
  orientationS: ["straight", "be"],
};

let futur = [
  "tu mérite de ne pas accepter les choses que tu ne veux pas",
  "lorem ipsum dolor sit amet",
  "lorem ipsum dolor sit amet",
  "lorem ipsum dolor sit amet",
];

let themes = ["amateur", "bbc", "lesbian"];
let games = ["cultureQ", "tabou ", "acteurX", "ouEst"];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = class Game {
  constructor({ sockets }) {
    this.players = sockets.map((socket) => ({ id: socket.id })) || [];
    this.theme;
    this.game;
  }
  initialize() {
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
    this.game = games[getRandomInt(games.length)];
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
