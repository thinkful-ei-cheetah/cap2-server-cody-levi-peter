const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./sll')
const xss = require('xss')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

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
      const words = await LanguageService.getLanguageWordsInOrder(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
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
      return res.json(LanguageService.serializeNextWord(next))
    }
    catch(error){
      next(error)
    }
  })

languageRouter
  .route('/guess')
  .post(jsonBodyParser, async (req, res, next) => {
    try {
      let guess = xss(req.body.guess).toLowerCase()
      guess = guess.toLowerCase()
      if(!guess){
        return res.status(400).json({
          error: `Missing 'guess' in request body`
        })
      }
      let words = await LanguageService.getLanguageWordsInOrder(
        req.app.get('db'),
        req.language.id,
      )
      let head = words.find(word => req.language.head === word.id)
      let SLL = new LinkedList
      SLL.insertFirst(head)
      let nextId = SLL.head.value.next
      let nextObj = null
      while(words.length !== SLL.length){
        nextObj = words.find(word => word.id === nextId)
        nextId = nextObj.next
        SLL.insertLast(nextObj)
      }
      let isCorrect
      if(guess === SLL.head.value.translation){
        req.language.total_score++
        SLL.head.value.correct_count++
        SLL.head.value.memory_value *= 2
        isCorrect = true
      }
      else{
        req.language.total_score--
        SLL.head.value.incorrect_count++
        SLL.head.value.memory_value = 1
        isCorrect = false
      }
      let formerHead = SLL.head.value
      SLL.moveNode(SLL.head.value.memory_value)
      req.language.head = SLL.head.value.id
      await LanguageService.saveSLL(
        req.app.get('db'),
        req.language, 
        SLL
        )
      return res.json({
        nextWord: SLL.head.value.original,
        totalScore: req.language.total_score,
        wordCorrectCount: SLL.head.value.correct_count,
        wordIncorrectCount: SLL.head.value.incorrect_count,
        answer: formerHead.translation,
        isCorrect,
      })
    } catch(error) {
      next(error)
    }
  })

module.exports = languageRouter
