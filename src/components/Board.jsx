import React, { useEffect, useState } from 'react'
import Score from './Score'

export default function Board() {
      const [turn, setTurn] = useState('x')
      const [winner , setWinner] = useState(null)
      const [gameBoard , setGameBoard] = useState(()=>{
        const localVal = JSON.parse(localStorage.getItem('gameBoard'))
        if(localVal){
          return localVal
        }
        return [
          ['', '' , ''],
          ['', '' , ''],
          ['', '' , ''],
        ]
      })

      const [score , setScore] = useState(()=>{
        const localVal = JSON.parse(localStorage.getItem('score'))
        if(localVal){
          return localVal
        } 
        return {
          x : 0,
          o : 0, 
          draw : 0
        }
      })
      const [history , setHistory] = useState(()=>{
        const  localVal = JSON.parse(localStorage.getItem('history'))
        if (localVal){
          return localVal
        }
        return []
      })
      const [historyIndex , setHistoryIndex] = useState(()=>{
        if(history.length){
          return history.length
        } 
        return 0
      })
      const [isChanging ,  setIsChanging] = useState(true)
      const [error , setError] = useState('')
      const changeBoard = (e)=>{
        const x = parseInt(e.target.dataset.x)
        const y = parseInt(e.target.dataset.y)
       if(isChanging){
        if(winner === null){ // only allow to play if there is no winner
          setGameBoard(prev => { //updating the gameBoard on every click
            return prev.map((row , rowIndex) =>{
                if(x === rowIndex){
                   return row.map((col , colIndex)=>{
                        if( y === colIndex){
                            if(prev[x][y] === ""){
                              if(history.length){
                                setHistoryIndex(history.length)  //setting the history index when i new move is made
                              }
                                return turn === 'x' ? 'x' : '0'
                            }
                            return col
                        }
                        return col
                    })
                }
                return row
            })
        })
       } 
     if(gameBoard[x][y] === ''){
      setTurn(prev => {
        return prev === 'x' ? '0' : 'x' //changing turn after every round
    })
     }
       } else {
        setError(`
          You're in history view. To make changes, please redo all steps to reach the current game state.`)
       }
        
      }
      useEffect(()=>{
        checkWin(gameBoard)
        localStorage.setItem('gameBoard' , JSON.stringify(gameBoard))
        if(isChanging){
          setHistory(prev =>{
            return [...prev , gameBoard]
          })
          
          console.log('changed');
        }
        
      }, [gameBoard])

      useEffect(()=>{
        localStorage.setItem('history' , JSON.stringify(history))
      }, [history])
      useEffect(()=>{
        
        if(isChanging === false){
          console.log('change index');
          if(history.length){
          setGameBoard(history[historyIndex])
          }
          console.log('change index');
        }
        if(history.length === historyIndex + 1){
          setIsChanging(true)
          setError('')
        }
      }, [historyIndex])
      useEffect(()=>{
        localStorage.setItem('score' , JSON.stringify(score))
      }, [score])
      const checkWin = (board)=>{
        let win = null
        const cols = [
          ['' , '', ''],
          ['' , '', ''],
          ['' , '', ''],
        ]

        const diagonal = [
          ['','',''],
          ['','',''],
        ]
        board.forEach((row , i) =>{
            cols[0][i] = row[0]
            cols[1][i] = row[1]
            cols[2][i] = row[2]

            if(i === 0){
              diagonal[0][0] = row[0]
            diagonal[1][0] = row[2]
            }else if(i === 1){
              diagonal[0][1] = row[1]
            diagonal[1][1] = row[1]
          } else if(i === 2){
              diagonal[0][i] = row[2]
            diagonal[1][i] = row[0]
            }
            if(row[0] !== '' && row[1] !== '' && row[2] !== ''){
              if(row[0] === row[1] && row[1] === row[2]){
                win = `${row[0]}`
              }
            }    
        }) // checking winner for rows and making arr for columns and diagonals
        cols.forEach((row , i) =>{
              if(row[0] !== '' && row[1] !== '' && row[2] !== ''){
              if(row[0] === row[1] && row[1] === row[2]){
                win = `${row[0]}`
              }
            }    
        }) //checking winner for columns
        diagonal.forEach((row , i) =>{
              if(row[0] !== '' && row[1] !== '' && row[2] !== ''){
              if(row[0] === row[1] && row[1] === row[2]){
                win = `${row[0]}`
              }
            }    
        }) //checking winner for diagonals
        let isBoardFull =[];

         board.forEach((row , i) =>{
         isBoardFull[i] = row.every((e) =>{
            return e !== ''
          })
        }) //checking if the board is full or not 
        // console.log(isBoardFull);
        //if the board is full and there is no winner then its a draw
        if(isBoardFull[0] === true && isBoardFull[1] === true && isBoardFull[2] === true && win === null){
          win = 'draw'
        }
        handleScore(win)
        setWinner(win)
      }
      const startNewGame = (e)=>{
        setGameBoard(prev => {
          return prev.map((row) =>{
            return prev.map((col) =>{
              return ''
            })
          })
        })
        setTurn('x')
        setHistory([])
        setHistoryIndex(0)
      }

      const handleScore = (win)=>{
        if(win === 'x'){
          console.log('x wins');
          setScore(prev => {
            return {...prev , x : prev.x+1}
          })
        }
        if(win === '0'){
          setScore(prev => {
            return {...prev , o : prev.o+1}
          }) 
        }  else if(win === 'draw'){
          setScore(prev => {
            return {...prev , draw : prev.draw+1}
          }) 
            
        }
        // win === 'x' ? setScore(prev => ({...prev , x : x++})) : ''
      }
    


      const handleUndo = ()=>{
       if(winner === null){
        if(historyIndex > 0){
          console.log(historyIndex);
            setHistoryIndex(prev => {
              console.log(prev);
              return prev-1
            })
            setIsChanging(false)
       }
          // setGameBoard(history[historyIndex]) this will cause step back render issue
        }
        
      }
      const handleRedo = ()=>{
    
       if(winner === null){
        if(history.length-1 > historyIndex){
          setHistoryIndex(prev => {
            // console.log(prev);
            return prev+1
          })
          setIsChanging(false)
          // setGameBoard(history[historyIndex]) this will cause step back render issue
        }
       }
        
      }
  return (
   <div>
    <Score score={score} turn={turn}/>
    <div className='w-fit mx-auto mt-4'>
      <button className='bg-green-600 text-white text-lg rounded px-2 py-1 cursor-pointer hover:bg-green-700 mr-4' onClick={handleUndo}>undo</button>
      <button className='bg-green-600 text-white text-lg rounded px-2 py-1 cursor-pointer hover:bg-green-700' onClick={handleRedo}>Redo</button>
    </div>
    <div className='board max-w-[200px] mx-auto grid grid-cols-3 grid-rows-[60px_minmax(60px,_1fr)_60px] mt-10' onClick={changeBoard}>
        <div className='border-2 text-center py-2 text-3xl border-t-0 border-l-0 ' data-x='0' data-y='0'>{gameBoard[0][0]}</div>
        <div className='border-2 text-center py-2 text-3xl border-t-0' data-x='0' data-y='1'>{gameBoard[0][1]}</div>
        <div className='border-2 text-center py-2 text-3xl border-t-0 border-r-0' data-x='0' data-y='2'>{gameBoard[0][2]}</div>
        <div className='border-2 text-center py-2 text-3xl border-l-0 ' data-x='1' data-y='0'>{gameBoard[1][0]}</div>
        <div className='border-2 text-center py-2 text-3xl' data-x='1' data-y='1'>{gameBoard[1][1]}</div>
        <div className='border-2 text-center py-2 text-3xl border-r-0' data-x='1' data-y='2'>{gameBoard[1][2]}</div>
        <div className='border-2 text-center py-2 text-3xl border-b-0 border-l-0 ' data-x='2' data-y='0'>{gameBoard[2][0]}</div>
        <div className='border-2 text-center py-2 text-3xl border-b-0 ' data-x='2' data-y='1'>{gameBoard[2][1]}</div>
        <div className='border-2 text-center py-2 text-3xl border-r-0 border-b-0 ' data-x='2' data-y='2'>{gameBoard[2][2]}</div>
    </div>
    {winner && <h1 className='bg-green-600 w-fit mx-auto mt-4 rounded text-2xl text-white py-1 px-2 transition-all'>{winner === 'draw' ? 'Its a draw' : `${winner} wins`}</h1>}
    {winner && <button className='bg-[#3291ea] w-fit mx-auto mt-4 rounded text-2xl text-white py-1 px-2 transition-all block'
    onClick={startNewGame}
    >New Game</button>}
    <p className='text-red-400 text-center mt-6'>{error}</p>

   </div>
  )
}
