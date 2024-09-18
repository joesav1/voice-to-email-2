import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('audio') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    })

    return NextResponse.json({ transcript: response.text })
  } catch (error) {
    console.error('Error transcribing audio:', error)
    return NextResponse.json({ error: 'Error transcribing audio' }, { status: 500 })
  }
}