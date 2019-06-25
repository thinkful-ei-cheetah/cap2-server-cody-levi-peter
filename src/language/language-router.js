const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./sll')
const xss = require('xss')

const jsonBodyParser = express.json()
const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const next = await LanguageService.getNextWord(
        req.app.get('db'),
        req.user.id,
      )
      if(!next){
        return res.status(404).json({
          error: `You don't have a next word`,
        })
      }
      res.json(LanguageService.serializeNextWord(next))
      next()
    }
    catch(error){
      next(error)
    }
  })

languageRouter
  .route('/guess')
  .post(jsonBodyParser, async (req, res, next) => {
    try {
      let guess = xss(req.body.guess)
      if(!guess){
        return res.status(400).json({
          error: `Missing 'guess' in request body`
        })
      }
      // console.log("user's language is .......", req.language)
      // console.log("user's guess is ..........", guess)
      let words = await LanguageService.getLanguageWordsInOrder(
        req.app.get('db'),
        req.language.id,
      )
      // console.log("words pulled out of db....", words)
      let head = words.find(word => req.language.head === word.id)
      let SLL = new LinkedList
      SLL.insertFirst(head)
      console.log(`SLL head = ${SLL.head}, SLL length = ${SLL.length}`)
      let next = null
      while(words.length !== SLL.length){
        next = words.find(word => word.id === last.next)
        SLL.insertLast(next)
      }
      console.log(`SLL head = ${SLL.head}, SLL length = ${SLL.length}`)
      res.json({
        language: req.language,
        words,
        SLL
      })
    } catch(error) {
      next(error)
    }
  })

module.exports = languageRouter
