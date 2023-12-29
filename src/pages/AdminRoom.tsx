import React, { Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDatabase, ref, remove, update } from 'firebase/database'

import deleteImg from '../assets/images/delete.svg'
import logoImg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Question/'
import { RoomCode } from '../components/RoomCode'

import '../styles/room.scss'

import { useRoom } from '../hooks/useRoom'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id

  const db = getDatabase()
  const navigate = useNavigate()

  const { questions, title } = useRoom(roomId)

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
      const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`)
      await remove(questionRef)
    }
  }

  async function handleEndRoom() {
    const roomRef = ref(db, `rooms/${roomId}`)
    await update(roomRef, {
      endedAt: new Date()
    })

    navigate('/')
  }

  async function handleCheckQuestionAnswered(questionId: string) {
    const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`)
    await update(questionRef, {
      isAnswered: true
    })
  }

  async function handleHighlighQuestion(questionId: string) {
    const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`)
    await update(questionRef, {
      isHighlighted: true
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} key={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions?.length} pergunta(s)</span>}
        </div>
        {questions?.map(question => {
          return (
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <Fragment>
                  <button
                    onClick={() => handleCheckQuestionAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta com respondida" />
                  </button>
                  <button onClick={() => handleHighlighQuestion(question.id)}>
                    <img src={answerImg} alt="Dar destaque à pergunda " />
                  </button>
                </Fragment>
              )}

              <button onClick={() => handleDeleteQuestion(question.id)}>
                <img src={deleteImg} alt="delete question" />
              </button>
            </Question>
          )
        })}
      </main>
    </div>
  )
}
