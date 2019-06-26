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
      let guess = xss(req.body.guess).toLowerCase()
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
      let formerHead = SLL.head
      SLL.moveNode(SLL.head.value.memory_value)
      req.language.head = SLL.head.value.id
      LanguageService.saveSLL(
        req.app.get('db'),
        req.language, 
        SLL
        )
      res.json({
        totalScore: req.language.total_score,
        wordCorrectCount: formerHead.value.correct_count,
        wordIncorrectCount: formerHead.value.incorrect_count,
        answer: formerHead.value.translation,
        isCorrect,
        // language: req.language,
        // words,
        // SLL
      })
    } catch(error) {
      next(error)
    }
  })

module.exports = languageRouter
