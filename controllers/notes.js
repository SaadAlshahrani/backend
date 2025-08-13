const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(foundNote => {
      if (!foundNote) {
        response.status(404).end()
      } else {
        response.json(foundNote)
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const newNote = new Note({
    content: body.content,
    important: body.important || false
  })

  newNote.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(request.params.id)
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

module.exports = notesRouter