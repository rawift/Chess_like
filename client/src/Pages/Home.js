// src/App.js
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../Context/UserContext';
import GameBoard from '../Components/GameBoard';

const SOCKET_SERVER_URL = 'http://localhost:8000';

const Home = () => {
    const { user } = useContext(UserContext); // Get username from context
    const [opponentUsername, setOpponentUsername] = useState('');
    const [isChallengeReceived, setIsChallengeReceived] = useState(false);
    const [roc,setroc] = useState(null)
    const [roc2,setroc2] = useState(null)
    const [challengerUsername, setChallengerUsername] = useState('');
    const [gameStarted, setgameStarted] = useState(false)
    const username=user.username
    const [myCoord, setmycoord] = useState({})
    const [oppoCoord, setoppocoord] = useState({})
    useEffect(() => {
        if (username) {
            const socket = io(SOCKET_SERVER_URL, {
                query: { username }
            });

            socket.on('connect', () => {
                console.log(`Connected with socket ID: ${socket.id}`);
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from the server');
            });

            socket.on('challenge-receive', (opponent) => {
                console.log('Game started:', opponent);
                console.log(opponentUsername)
                setIsChallengeReceived(true)
                setChallengerUsername(opponent)
                console.log(challengerUsername)
            });
            socket.on('challenge-rejection', () => {
                alert(`challenge rejected by ${opponentUsername}`)
            });

            socket.on('game-started', (opponent) => {
                setgameStarted(true)
                console.log("game started", opponent)
            });

            socket.on('rcoord', ({ myCoord, oppoCoord, username, opponentUsername  }) => {
                console.log('fdata', myCoord, oppoCoord, username, opponentUsername );

                let arr=myCoord
                arr.forEach(player => {
                    player.position.x = 4 - player.position.x;
                    player.position.y = 4 - player.position.y;
                    player.name = player.name.replace("A-", "B-");
                });
                let arr2=oppoCoord
                arr2.forEach(player => {
                    player.position.x = 4 - player.position.x;
                    player.position.y = 4 - player.position.y;
                    player.name = player.name.replace("B-", "A-");
                });
                console.log("here",myCoord)
                setroc(myCoord)
                setroc2(oppoCoord)
                console.log("OPPOCORD",oppoCoord)
                //setmycoord(oppoCoord)
            });

            // Clean up the socket connection when the component unmounts
            return () => {
                socket.disconnect();
            };
        }
    }, [username]);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL);
        console.log(myCoord)
        console.log(oppoCoord)
        
        const op=!challengerUsername.opponent?opponentUsername:challengerUsername.opponent
        console.log("ME AND OPPO",username,op)
        console.log("oopocord",oppoCoord)
        socket.emit('coord', { myCoord, oppoCoord, username, opponentUsername:op });
        
    },[myCoord,oppoCoord])


    
 




    const handleChallenge = () => {
        const socket = io(SOCKET_SERVER_URL);
        console.log("challenge",{username, opponentUsername})
        socket.emit('challenge', { challengerUsername:username, opponentUsername });
    };

    const handleAccept = () => {
        const socket = io(SOCKET_SERVER_URL);
        console.log("Challenge accepted");
        setIsChallengeReceived(false);
        socket.emit('challenge-accept', { challengerUsername, opponentUsername: username });
    };

    const handleReject = () => {
        const socket = io(SOCKET_SERVER_URL);
        console.log("Challenge rejected");
        setIsChallengeReceived(false);
        socket.emit('challenge-reject', { challengerUsername });
    };

    return (
    <>
    {gameStarted?
    <GameBoard myCoord={myCoord} setmycoord={setmycoord} oppoCoord={oppoCoord} setoppocoord={setoppocoord} roc={roc}/>
    :
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Game Lobby</h1>

        <div className="mt-6">
            <label className="block text-lg font-semibold mb-2">Opponent's Username:</label>
            <input
                type="text"
                value={opponentUsername}
                onChange={(e) => setOpponentUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Enter opponent's username"
            />
        </div>

        <button
            onClick={handleChallenge}
            className="mt-6 bg-green-500 text-white py-2 px-4 rounded"
        >
            Challenge
        </button>
    </div>

    {/* Challenge Modal */}
    {isChallengeReceived && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Challenge Received</h2>
                <p className="mb-4">You have been challenged by {challengerUsername.opponent}. Do you accept?</p>
                <div className="flex justify-end">
                    <button
                        onClick={handleReject}
                        className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                    >
                        Reject
                    </button>
                    <button
                        onClick={handleAccept}
                        className="bg-green-500 text-white py-2 px-4 rounded"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )}
</div>
    
    }
    </>
       
    );
};

export default Home;
