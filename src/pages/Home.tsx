import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDatabase, ref, child, get } from 'firebase/database'

import '../styles/auth.scss'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

export function Home() {
  const navigate = useNavigate()
  const { signInWithGoogle, user } = useAuth()

  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }
    navigate('/rooms/news')
  }

  async function hadleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return
    }

    const dbRef = ref(getDatabase())
    const roomSnapshot = await get(child(dbRef, roomCode))

    if (!roomSnapshot.exists()) {
      throw new error('Room does not exist')
    }

    const roomData = roomSnapshot.val()

    if (roomData.endedAt && roomData.endedAt < Date.now()) {
      throw new error('Room has ended')
    }

    navigate(`room/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="" />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="google logo" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={hadleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
