const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)

  // Note.find({}).then(notes => {
  //   response.json(notes)
  // })
})

notesRouter.get('/:id', async (request, response) => {
  const foundNote = await Note.findById(request.params.id)
  if (!foundNote) {
    response.status(404).end()
  } else {
    response.json(foundNote)
  }

  // Note.findById(request.params.id)
  //   .then(foundNote => {
  //     if (!foundNote) {
  //       response.status(404).end()
  //     } else {
  //       response.json(foundNote)
  //     }
  //   })
  //   .catch(error => next(error))
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const newNote = new Note({
    content: body.content,
    important: body.important || false
  })

  const savedNote = await newNote.save()
  response.status(201).json(savedNote)

  // newNote.save()
  //   .then(savedNote => {
  //     response.status(201).json(savedNote)
  //   })
  //   .catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()

  // Note.findByIdAndDelete(request.params.id)
  //   .then(() => {
  //     response.status(204).end()
  //   })
  //   .catch(error => next(error))
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