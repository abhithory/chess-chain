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
  const [connectedWith, setConnectedWith] = useState("");
  const [roomCodeToSend, setRoomCodeToSend] = useState("");


  // chessgame details

  const [chessGameDetails, setChessGameDetails] = useState<ChessGameInterface>({
    boardOrientation: "white"
  })




  useEffect(() => {
    socket.on('connect', () => {
      setUserSocketId(socket.id)
      setConnectedToWebsoket(true);
    });
  }, []);

  async function joinRoom(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.target?.roomcode?.value || !userSocketId) return;
    function connectedToRoom() {
      setConnectedToRoom(true)
      setConnectedWith(e.target?.roomcode?.value);
      setChessGameDetails({ ...chessGameDetails, boardOrientation: "black" });

    }
    connectedToRoom()
  }

  function createRoom() {
    if (!userSocketId) return;
    setChessGameDetails({ ...chessGameDetails, boardOrientation: "white" });
    setRoomCodeToSend(userSocketId);

    setConnectedWith("connected");
    setConnectedToRoom(true)

  }


  return (
    <section className="flex_center h-screen w-screen gap-5">
      <h1>Welcome to chess chain</h1>
      <div className="border border-2 p-4 flex_center gap-4">
        {userSocketId &&
          <h4>Your id: {userSocketId}</h4>
        }

        {connectedToRoom ?
          <h4>connected with {connectedWith}</h4>
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
        <ChessBoard boardOrientation={chessGameDetails.boardOrientation} />
      }
    </section>
  )
}
