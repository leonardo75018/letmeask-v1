import { useEffect, useState } from 'react'
import { getDatabase, ref, set, push, onValue } from 'firebase/database'
import { off } from 'firebase/database'

import { useAuth } from './useAuth'

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string
      avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likes: Record<
      string,
      {
        authorId: string
      }
    >
  }
>

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
}

export function useRoom(roomId: string | undefined) {
  const { user } = useAuth()
  const db = getDatabase()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}`)

    onValue(roomRef, room => {
      const dataBaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = dataBaseRoom.questions

      const parsedQuestions = Object.entries(firebaseQuestions || {}).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0]
          }
        }
      )

      setTitle(dataBaseRoom.title)
      setQuestions(parsedQuestions)
    })
    return () => {
      off(roomRef, 'value', () => {})
    }
  }, [roomId, user?.id])

  return { questions, title }
}
