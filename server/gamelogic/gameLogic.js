/*let players = {}; // Store players with their socket IDs
let playerReady = {}; // Store ready status of players
let socketid={}

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinGame', ({ username, opponentUsername }) => {
            // Store the player
            players[socket.id] = { username, opponentUsername };
            console.log(username,opponentUsername)
            // Check if opponent is already in the game
            const opponentSocketId = Object.keys(players).find(
                key => players[key].username === opponentUsername
            );
            console.log(players)
            console.log(opponentSocketId, players[opponentSocketId])
            if (opponentSocketId) {
                // Notify both players
                io.to(opponentSocketId).emit('opponentJoined', { username });
                io.to(socket.id).emit('opponentJoined', { username: opponentUsername });
            }
        });

        socket.on('playerReady', ({ username }) => {
            playerReady[socket.id] = true;

            const opponentSocketId = Object.keys(players).find(
                key => players[key].username === players[socket.id].opponentUsername
            );

            // Check if both players are ready
            if (opponentSocketId && playerReady[opponentSocketId] && playerReady[socket.id]) {
                io.to(socket.id).emit('gameReady');
                io.to(opponentSocketId).emit('gameReady');
            }
        });

        socket.on('disconnect', () => {
            const opponentSocketId = Object.keys(players).find(
                key => players[key].username === players[socket.id].opponentUsername
            );

            if (opponentSocketId) {
                io.to(opponentSocketId).emit('playerDisconnected', {
                    message: `${players[socket.id].username} has disconnected.`
                });
            }

            // Remove player from list
            delete players[socket.id];
            delete playerReady[socket.id];

            console.log('A user disconnected:', socket.id);
        });
    });
};
*/
// gamelogic/gameLogic.js
// gamelogic/gameLogic.js

const users = {}; // Object to map usernames to arrays of socket IDs

const games=[]

const ingame={}

module.exports = (io) => {
    io.on('connection', (socket) => {
        const username = socket.handshake.query.username;

        if (username) {
            // Initialize the array if the username is new
            if (!users[username]) {
                users[username] = [];
            }
            // Add the current socket ID to the user's array
            users[username].push(socket.id);
            console.log(`Username ${username} connected with socket ID ${socket.id}`);
        } else {
            console.log(`Connection with socket ID ${socket.id} did not provide a username`);
        }

        // Handle 'startGame' event
        socket.on('challenge', ({ challengerUsername, opponentUsername }) => {
            const opponentSocketIds = users[opponentUsername];
            if (opponentSocketIds && opponentSocketIds.length > 0) {
                console.log(`Starting game between ${challengerUsername} and ${opponentUsername}`);

                // Notify all of the opponent's socket connections
                opponentSocketIds.forEach((opponentSocketId) => {
                    io.to(opponentSocketId).emit('challenge-receive', { opponent: challengerUsername });
                });

                // Notify all of the challenger's socket connections
                /*const challengerSocketIds = users[challengerUsername];
                if (challengerSocketIds && challengerSocketIds.length > 0) {
                    challengerSocketIds.forEach((challengerSocketId) => {
                        io.to(challengerSocketId).emit('gameStarted', { opponent: opponentUsername });
                    });
                }*/
            } else {
                console.log(`Opponent ${opponentUsername} not found`);
                socket.emit('error', { message: 'Opponent not found' });
            }
        });

        socket.on('challenge-reject', ({ challengerUsername }) => {
            const opponentSocketIds = users[challengerUsername.opponent];
            
            if (opponentSocketIds && opponentSocketIds.length > 0) {
                // Notify all of the opponent's socket connections
                opponentSocketIds.forEach((opponentSocketId) => {
                    io.to(opponentSocketId).emit('challenge-rejection');
                });

            } else {
                console.log("challenge-reject")
                console.log(`Opponent ${opponentUsername} not found`);
                socket.emit('error', { message: 'Opponent not found' });
            }
        });


        socket.on('challenge-accept', ({ challengerUsername, opponentUsername }) => {
            const opponentSocketIds = users[challengerUsername.opponent];
            console.log(challengerUsername.opponent,opponentUsername)
            if (opponentSocketIds && opponentSocketIds.length > 0) {
                console.log(`Starting game between ${challengerUsername.opponent} and ${opponentUsername}`);

                // Notify all of the opponent's socket connections
                opponentSocketIds.forEach((opponentSocketId) => {
                    io.to(opponentSocketId).emit('game-started', { opponent: opponentUsername });
                });

                // Notify all of the challenger's socket connections
                const challengerSocketIds = users[opponentUsername];
                if (challengerSocketIds && challengerSocketIds.length > 0) {
                    challengerSocketIds.forEach((challengerSocketId) => {
                        io.to(challengerSocketId).emit('game-started', { opponent: challengerUsername.opponent });
                    });
                }
                const cu=challengerUsername.opponent
                games.push(opponentUsername+'+'+cu)
                ingame[opponentUsername]=true
                ingame[cu]=true
                console.log(ingame, games)
            } else {
                console.log("game-started")
                console.log(`Opponent ${opponentUsername} not found`);
                socket.emit('error', { message: 'Opponent not found' });
            }
        });

        socket.on('coord', (data) => {
            const { myCoord, oppoCoord, username, opponentUsername } = data;
            console.log(myCoord, oppoCoord, username, opponentUsername);


            console.log(".........")
            console.log(opponentUsername)
            const opponentSocketIds = users[opponentUsername];

            console.log(opponentSocketIds)
          
            if (opponentSocketIds && opponentSocketIds.length > 0) {
                // Notify all of the opponent's socket connections
                opponentSocketIds.forEach((opponentSocketId) => {
                    io.to(opponentSocketId).emit('rcoord', { myCoord, oppoCoord, username, opponentUsername });
                });

                // Notify all of the challenger's socket connections
                /*const challengerSocketIds = users[username];
                if (challengerSocketIds && challengerSocketIds.length > 0) {
                    challengerSocketIds.forEach((challengerSocketId) => {
                        io.to(challengerSocketId).emit('rcoord', { myCoord, oppoCoord, username, opponentUsername});
                    });
                }*/

            } else {
                console.log("coord")
                console.log(`Opponent ${opponentUsername} not found`);
                socket.emit('error', { message: 'Opponent not found' });
            }

            
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            if (username) {
                // Remove the socket ID from the user's array
                users[username] = users[username].filter((id) => id !== socket.id);
                console.log(`User ${username} with socket ID ${socket.id} disconnected`);

                // If the user has no more active connections, remove the username key
                if (users[username].length === 0) {
                    delete users[username];
                }
            }
        });
    });
};
