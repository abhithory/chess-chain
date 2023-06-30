"use client"

import ChessBoard from '@/components/ChessBoard'
import { ChessGameInterface } from '@/interface';
import Image from 'next/image'
import { useEffect, useState } from 'react'
import io from 'socket.io-client';


const socket = io('http://localhost:3001');



export default function Home() {

  const [connectedToWebsoket, setConnectedToWebsoket] = useState(false);
  const [userSocketId, setUserSocketId] = useState("");
  const [connectedToRoom, setConnectedToRoom] = useState(false);
  const [opponentSocketId, setOpponentSocketId] = useState("");
  const [roomCodeToSend, setRoomCodeToSend] = useState("");


  // chessgame details

  const [chessGameDetails, setChessGameDetails] = useState<ChessGameInterface>({
    boardOrientation: "white",
    socket: "",
    userSocketId: "",
    opponentSocketId: "",
  })




  useEffect(() => {
    socket.on('connect', () => {
      setChessGameDetails({ ...chessGameDetails, socket: socket,userSocketId: socket.id});
      setUserSocketId(socket.id)
      setConnectedToWebsoket(true);
    });
  }, []);

  async function joinRoom(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const _opponentSocketId = e.target?.roomcode?.value;
    if (!_opponentSocketId || !userSocketId) return;

    function connectWithRoom() {
      setChessGameDetails({ ...chessGameDetails, opponentSocketId: _opponentSocketId,boardOrientation: "black" });
      setConnectedToRoom(true)
      setOpponentSocketId(_opponentSocketId);
    }
    socket.emit("connect-with-player", userSocketId, _opponentSocketId, connectWithRoom);
  }

  function createRoom() {
    if (!userSocketId) return;
    setChessGameDetails({ ...chessGameDetails, boardOrientation: "white" });
    setRoomCodeToSend(userSocketId);
  }


  useEffect(() => {
    socket.on("connection-req-from-player", (_opponentSocketId) => {
      console.log("connection req", _opponentSocketId);
      
      setOpponentSocketId(_opponentSocketId);
      setConnectedToRoom(true)
      setChessGameDetails({ ...chessGameDetails, boardOrientation: "white" });
      setChessGameDetails({ ...chessGameDetails, opponentSocketId: _opponentSocketId});

      // setTimeout(()=>{
      //   acceptRequest()
      // }, 5000)
    })
    return () => {
      socket.off('connection-req-from-player')
    }
  },)



  return (
    <section className="flex_center h-screen w-screen gap-5">
      <h1>Welcome to chess chain</h1>
      <div className="border border-2 p-4 flex_center gap-4">
        {userSocketId &&
          <h4>Your id: {userSocketId}</h4>
        }

        {connectedToRoom ?
          <h4>connected with {opponentSocketId}</h4>
          :
          <form onSubmit={joinRoom}>
            <input className='basic_input' id='roomcode' name='roomcode' type="text" placeholder="code of room which you want to join" />
            <button className='basic_btn' type='submit'>
              connect To Room
            </button>
          </form>
        }
        <button className='basic_btn' onClick={createRoom}>Create Room</button>
        {roomCodeToSend &&
          <h4>Room created: {roomCodeToSend} | share this code with other to join game</h4>
        }
      </div>

      {connectedToRoom &&
        <ChessBoard socket={chessGameDetails.socket} boardOrientation={chessGameDetails.boardOrientation} userSocketId={chessGameDetails.userSocketId} opponentSocketId={chessGameDetails.opponentSocketId}  />
      }
    </section>
  )
}
