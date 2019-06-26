const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getLanguageWordsInOrder(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
      .orderBy('memory_value')
  },

  getNextWord(db, user_id){
    return db
      .from('language AS l')
      .leftJoin('word AS w', 'l.head', 'w.id')
      .select('w.original', 'w.correct_count', 'w.incorrect_count', 'l.total_score')
      .where('user_id', user_id)
      .first()
  },

  serializeNextWord(next){
    return {
      nextWord: next.original,
      wordCorrectCount: next.correct_count,
      wordIncorrectCount: next.incorrect_count,
      totalScore: next.total_score
    }
  },

  saveSLL(db, language, sll){
    return db.transaction(async trx => {
      await trx('language')
        .where('id', language.id)
        .update({
          head: language.head,
          total_score: language.total_score
        })
      await trx('word')
        
    })
  }
}
// {
//   "nextWord": "Testnextword",
//   "wordCorrectCount": 222,
//   "wordIncorrectCount": 333,
//   "totalScore": 999
// }
module.exports = LanguageService
