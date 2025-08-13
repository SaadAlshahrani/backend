require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
// const cors = require('cors')
const app = express()


app.use(express.static('dist'))
app.use(express.json())
// app.use(cors())
const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path    ', request.path)
  console.log('Body:   ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

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
app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// --- Create a note ---
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(note => {
    response.json(note)
  })
    .catch(error => next(error))
})

// Update a note
app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  const { content, important } = request.body

  Note.findByIdAndUpdate(id)
    .then(foundNote => {
      if (!foundNote) {
        return response.status(404).end()
      }

      foundNote.content = content
      foundNote.important = important

      return foundNote.save().then(updatedNote => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

// Delete a single note
app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id

  Note.findByIdAndDelete(id)
    .then(deletedNode => {
      response.json(204).end()
    })
    .catch(error => next(error))
})

// Unknown endpoints handling
app.use((request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
})

// Error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT}`)
})