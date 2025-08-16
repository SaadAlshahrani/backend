// const mongoose = require('mongoose')

// // if (process.argv.length < 3) {
// //   console.log('give password as argument')
// //   process.exit(1)
// // }



// mongoose.set('strictQuery', false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// const noteOne = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// const noteTwo = new Note({
//   content: 'HTML is hard',
//   important: false,
// })

// noteTwo.save().then((result) => {
//   console.log('note saved!', result)
//   mongoose.connection.close()
// })

// // Note.find({}).then((result) => {
// //   result.forEach((note) => {
// //     console.log(note)
// //   })
// //   mongoose.connection.close()
// // })