require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
// const cors = require('cors')
const app = express()


// app.use(cors())
const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path    ', request.path)
    console.log('Body:   ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)
app.use(express.json())
app.use(express.static('dist'))

// Home
app.get('/', (request, response) => {
    response.send('<h1>Hello Gonk!</h1>')
})

// Get all notes
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

// --- Get a single note ---
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    // Handle notes that don't exist
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(note => Number(note.id)))
    : 0

    return String(maxId + 1)
}

// --- Create a note ---
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)
    response.json(note)
})

// Delete a single note
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

// Handle all unknown endpoints
app.use((request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
})

// Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`)
})