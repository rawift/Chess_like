import React, { useState, useEffect } from 'react';


const members = ['A-P1', 'A-P2', 'A-P3', 'A-H1', 'A-H2'];
const numbers = [0, 1, 2, 3, 4];

const GameBoard = ({myCoord,setmycoord,oppoCoord,setoppocoord,roc}) => {
    const [inputValue, setInputValue] = useState('');
    const [assignments, setAssignments] = useState({});
    const [gridContent, setGridContent] = useState([]);

  useEffect(() => {
    // Initialize the assignments with each number assigned to one member
    const initialAssignments = {};
    members.forEach((member, index) => {
      initialAssignments[member] = numbers[index];
    });
    setAssignments(initialAssignments);
  }, []);

  const handleChange = (member, newValue) => {
    const updatedAssignments = { ...assignments };

    // Find the member that currently has the newValue
    const existingMember = Object.keys(assignments).find(key => assignments[key] === parseInt(newValue));

    if (existingMember) {
      // Swap the values between the members
      updatedAssignments[existingMember] = updatedAssignments[member];
    }

    // Assign the new value to the selected member
    updatedAssignments[member] = parseInt(newValue);

    setAssignments(updatedAssignments);
    updateYValues(updatedAssignments)
  };


  const updateYValues = (newYValues) => {
    const updatedPieces = player2Pieces.map(piece => {
      // If the piece name exists in the newYValues object, update its y position
      if (newYValues[piece.name] !== undefined) {
        return {
          ...piece,
          position: {
            y:4,
            x: newYValues[piece.name]
          }
        };
      }
      return piece;
    });
    setPlayer2Pieces(updatedPieces);
  };

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };


    const updateCoordinates = (coordinatesToMatch) => {
      console.log('Coordinates to match:', coordinatesToMatch);
  
      // Update the state
      setPlayer1Pieces((prevPieces) => {
        const updatedPieces = prevPieces.map((piece) => {
          const isMatching = coordinatesToMatch.some(
            (coord) => coord.x === piece.position.x && coord.y === piece.position.y
          );
          return isMatching
            ? { ...piece, position: { x: -1, y: -1 } }
            : piece;
        });
  
        console.log('Updated pieces:', updatedPieces); // Log updated state
        return updatedPieces;
      });

      setGridContent((prevPieces) => {
        const updatedPieces = prevPieces.map((piece) => {
          const isMatching = coordinatesToMatch.some(
            (coord) => coord.x === piece.position.x && coord.y === piece.position.y
          );
          return isMatching
            ? { ...piece, position: { x: -1, y: -1 } }
            : piece;
        });
  
        console.log('Updated pieces:', updatedPieces); // Log updated state
        return updatedPieces;
      });
    };


    const updatePosition = (input) => {
        // Example input: "P1:L"
        const [pieceName, direction] = input.split(':');
        const pieceIndex = player2Pieces.findIndex(piece => piece.name === `A-${pieceName}`);
        
        if (pieceIndex === -1) {
          alert('Piece not found');
          return;
        }

       
    
        const newPosition = { ...player2Pieces[pieceIndex].position };

        let fac=0;
        if(pieceName=='P1'|| pieceName=='P2'|| pieceName=='P3') fac=1;
        else if(pieceName=='H1') fac=2;
        else fac=2
        

        if(pieceName=='P1' || pieceName=='P2' || pieceName=='P3' || pieceName=='P4' || pieceName=='H1'){
          if(direction=='BL' || direction=='BR'|| direction=='FL' || direction=='FR'){
             alert("invalid move")
             return
          } 
        }
        const oldPostion=newPosition

        var cord=[]
    
        switch (direction) {
          case 'L':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x-i,y:newPosition.y})
            }
            newPosition.x -= fac;
            break;
          case 'R':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x+i,y:newPosition.y})
            }
            newPosition.x += fac;
            break;
          case 'F':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x,y:newPosition.y-i})
            }
            newPosition.y -= fac;
            break;
          case 'B':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x,y:newPosition.y+i})
            }
            newPosition.y += fac;
            break;
          case 'FL':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x-i,y:newPosition.y-i})
            }
            newPosition.y -= fac;
            newPosition.x -= fac;
            break;
          case 'FR':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x+i,y:newPosition.y-i})
            }
            newPosition.y -= fac;
            newPosition.x += fac;
            break;
          case 'BL':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x-i,y:newPosition.y+i})
            }
            newPosition.y += fac;
            newPosition.x -= fac;
            break;
          case 'BR':
            for(var i=1; i<=fac; i++){
              cord.push({x:newPosition.x+i,y:newPosition.y+i})
            }
            newPosition.y += fac;
            newPosition.x += fac;
            break;
          default:
            alert('Invalid direction');
            return;
        }

        console.log("cord",cord)


    
        // Boundary check
        if (newPosition.x < 0 || newPosition.y < 0 || newPosition.x > 4 || newPosition.y > 4) {
          alert('Out of bounds');
          return;
        }
        const currentPiece = player1Pieces[pieceIndex];
        const isPositionOccupied = player2Pieces.some(piece => 
            piece.position.x === newPosition.x && piece.position.y === newPosition.y && piece.name !== currentPiece.name
          );
        if (isPositionOccupied) {
            alert('Invalid move: Position already occupied');
            return;
          }

          updateCoordinates(cord)
        const updatedPieces = [...player2Pieces];
        updatedPieces[pieceIndex] = { ...updatedPieces[pieceIndex], position: newPosition };
        setPlayer2Pieces(updatedPieces);
      };
  
    const handleSubmit = () => {
        console.log(timer)
        if (timer <= 0) {
            console.log('Submitted Value:', inputValue);
          updatePosition(inputValue);
          }  
       
    };
  const [player1Pieces, setPlayer1Pieces] = useState([
    { name: 'B-P1', position: { x: 0, y: 0 } },
    { name: 'B-P2', position: { x: 1, y: 0 } },
    { name: 'B-P3', position: { x: 2, y: 0 } },
    { name: 'B-H1', position: { x: 3, y: 0 } },
    { name: 'B-H2', position: { x: 4, y: 0 } },
  ]);

  const [player2Pieces, setPlayer2Pieces] = useState([
    { name: 'A-P1', position: { x: 0, y: 4 } },
    { name: 'A-P2', position: { x: 1, y: 4 } },
    { name: 'A-P3', position: { x: 2, y: 4 } },
    { name: 'A-H1', position: { x: 3, y: 4 } },
    { name: 'A-H2', position: { x: 4, y: 4 } },
  ]);

  const [timer, setTimer] = useState(30);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);



   
  useEffect(() => {
    setmycoord(player2Pieces)
    setoppocoord(player1Pieces)
  },[player1Pieces,player2Pieces])

  useEffect(() => {
    console.log(roc)
  
    
    if(roc){
      let old=gridContent
      setGridContent(roc);
      let neww=roc
      console.log("old","new")
      console.log(old,neww)
    }
   

  },[roc])


  const renderGrid = () => {
    let grid = [];
    console.log("D",gridContent)
    let some=gridContent
    //setPlayer1Pieces(some)
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const player1Piece = some.find(p => p.position.x === x && p.position.y === y);
        const player2Piece = player2Pieces.find(p => p.position.x === x && p.position.y === y);
        grid.push(
          <div key={`${x}-${y}`} className="w-16 h-16 border border-gray-700 flex items-center justify-center">
            {player1Piece && player1Piece.position.x !== -1 && player1Piece.position.y !== -1 && (
              <span className="text-white">{player1Piece.name}</span>
            )}
            {player2Piece && player2Piece.position.x !== -1 && player2Piece.position.y !== -1 && (
              <span className="text-red-500">{player2Piece.name}</span>
            )}
          </div>
        );
      }
    }
    return grid;
  };


  

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4">5x5 Grid Game</h1>
      <div className="grid grid-cols-5 gap-1">{renderGrid()}</div>
      <div className="mt-4">
        <p>Time remaining: {timer} seconds</p>
        <p>Move your pieces!</p>
       
      </div>

{timer?

<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Assign Values to Members</h1>
      <div className="space-y-4 w-full max-w-md">
        {members.map((member, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-md shadow-lg">
            <span>
              {member} <span>({assignments[member]})</span>
            </span>
            <select
              value={assignments[member] || ''}
              onChange={(e) => handleChange(member, e.target.value)}
              className="bg-gray-700 text-white p-2 rounded-md focus:outline-none"
            >
              {numbers.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>

:



<div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
<h1 className="text-2xl mb-4">Input Movements</h1>
<input
  type="text"
  value={inputValue}
  onChange={handleInputChange}
  placeholder="Type something..."
  className="m-2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
/>
<button
  onClick={handleSubmit}
  className="mt-4 p-2 bg-blue-500 rounded text-white hover:bg-blue-700"
>
  Submit
</button>
<p className="mt-4">Current Input: {inputValue}</p>
</div>

}

    </div>
  );
};

export default GameBoard;
