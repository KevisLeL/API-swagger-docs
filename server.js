const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const router = express.Router();


const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Game Test API",
      description: "Users and games API information",
      contact: {
        name: "Kevis DeveloperMode"
      },
      server: ["http://localhost:3000"]
    }
  },
  apis: ["server.js"],
  version: '1.0'
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const users = [
  {    id: "1",
    name: "Lio Messi",
    email: "Lio@Messi.com",
    games: [
      {
        gameId: "1",
        name: "Overwatch",
        type: "FPS",
      },
      {
        gameId: "2",
        name: "Valorant",
        type: "tactic FPS",
      },
    ],
  },
  {
    id: "2",
    name: "Kevis",
    email: "Kevis@Kevis.com",
    games: [
      {
        gameId: "3",
        name: "Forza",
        type: "Auto Sim",
      },
      {
        gameId: "4",
        name: "GTA V",
        type: "Open World",
      },
      {
        gameId: "1",
        name: "Overwatch",
        type: "FPS",
      },
      {
        gameId: "4",
        name: "GTA V",
        type: "Open World",
      },
      {
        gameId: "1",
        name: "Overwatch",
        type: "FPS",
      }
    ],
  },
];



function getUserById(id){
    return users.find(u => u.id === id); 
}

function getGameByGameId(gameId, id){
    const user = users.find(u => u.id === id);
    return user.games.find(g => g.gameId === gameId);
}

function getGamesfromUser(id){
    const user = users.find(u => u.id === id);
    return user.games;
}

function getAllGames(){
//Array sólo con los juegos de TODOS los jugadores.
  const allGames = [...new Set([].concat(...users.map((o) => o.games)))];
  console.log(allGames);
//Array sólo con los juegos de TODOS los jugadores, quitando los duplicados, mopstrando cada juego 1 vez.
  let noDupGames = allGames.filter((game, index, self) => self.findIndex(t => t.gameId === game.gameId && t.name === game.name && t.type === game.type) === index);
  console.log(noDupGames); 

return noDupGames;
}

// ROUTES 
/**
 * @swagger
 * /api/user/{userId}:
 *  get:
 *    description: Use to request user info.
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: ID of user to return
 *      required: true
 *    responses:
 *      '200': 
 *        description: A succesful response.
 *      '404': 
 *        description: Response not found.
 */
router.get('/user/:id', function (req, res) {
    console.log(req.params);
    res.header('Content-Type', 'application/json');
    res.header('Accept', 'application/json'); 
    const id = req.params.id;
    console.log(id);
    const user = getUserById(id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User Not Found')
    }
  });

  /**
 * @swagger
 * /api/games:
 *  get:
 *    description: Use to request all games info.
 *    responses:
 *      '200': 
 *        description: A succesful response.
 *      '404': 
 *        description: Games not found.
 */
  router.get('/games', function (req, res) {
    res.header('Content-Type', 'application/json');
    res.header('Accept', 'application/json');
    const games = getAllGames();
    if (games) {
        res.send(games);
    } else {
        res.status(404).send('Games Not Found')
    }
  });

 /**
 * @swagger
 * /api/user/{userId}/game/{gameId}:
 *  get:
 *    description: Use to request an user game info.
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: ID of user to return
 *      required: true
 *    - name: gameId
 *      in: path
 *      description: ID of game to return
 *      required: true
 *    responses:
 *      '200': 
 *        description: A succesful response.
 *      '404': 
 *        description: User game not found.
 */
router.get('/user/:id/game/:gameId', function (req, res) {
    console.log(req.params);
    res.header('Content-Type', 'application/json');
    res.header('Accept', 'application/json'); 
    const id = req.params.id;
    const gameId = req.params.gameId;
    console.log(gameId);
    const game = getGameByGameId(gameId, id);
    if (game) {
        res.send(game);
    } else {
        res.status(404).send('Game Not Found')
    }
  });

/**
 * @swagger
 * /api/user/{userId}/games:
 *  get:
 *    description: Use to request all user games info.
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: ID of user to return
 *      required: true
 *    responses:
 *      '200': 
 *        description: A succesful response.
 *      '404': 
 *        description: User not found.
 */
  router.get('/user/:id/games', function (req, res) {
    console.log(req.params);
    console.log(req.query);
    res.header('Content-Type', 'application/json');
    res.header('Accept', 'application/json');
    const id = req.params.id; 
    const games = getGamesfromUser(id);
    if (games) {
        res.send(games);
    } else {
        res.status(404).send('User Not Found')
    }
  });

  /**
 * @swagger
 * /api/user:
 *  post:
 *    description: Used to create a new user info.
 *    parameters:
 *    - name: User info
 *      in: body
 *      description: New user info
 *      required: true
 *      schema:
 *        type: "array"
 *        items:
 *          $ref: "#/definitions/User"   
 *    responses:
 *      '200': 
 *        description: A succesful response.
 *      '400': 
 *        description: Invalid user info.
 * 
 * definitions:
 *  User:
 *    type: "object"
 *    properties:
 *      id:
 *        type: "integer"
 *        format: "int64"
 *      name:
 *        type: "string"
 *      email:
 *        type: "string"
 */
  router.post('/user', function (req, res) {
    const user = req.body;
    if (!user.id || !user.name || !user.email ) {
    res.status(400).send('Bad request. User invalid')
    } else {
    res.send("User Created");
    users.push(user);
    }
    });

 /**
 * @swagger
 * /api/user/{userId}/game:
 *  post:
 *    description: Use to create a new user game.
 *    parameters:
 *    - name: userId
 *      in: path
 *      description: ID of user to return
 *      required: true
 *    - name: gameId
 *      in: formData
 *      description: New game ID
 *      required: true
 *      type: integer
 *    - name: name
 *      in: formData
 *      description: New game name
 *      required: true
 *      type: string
 *    - name: type
 *      in: formData
 *      description: New game type
 *      required: true
 *      type: string
 *    responses:
 *      '200': 
 *        description: A succesful response.
 *      '400': 
 *        description: Invalid game info.
 */
router.post('/user/:id/game', function (req, res) {
    const game = req.body;
    const id = req.params.id;
    if (!game.gameId || !game.name || !game.type ) {
        res.status(400).send('Bad request. Game invalid')
        } else {
        res.send("Game Created");
        const user = getUserById(id);
        user.games.push(game);
        }

});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());    
app.use('/api', router);
app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
   });
