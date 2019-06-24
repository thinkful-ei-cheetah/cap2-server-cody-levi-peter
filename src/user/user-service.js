const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    }
  },
  populateUserWords(db, user_id) {
    return db.transaction(async trx => {
      const [languageId] = await trx
        .into('language')
        .insert([
          { name: 'Japanese', user_id },
        ], ['id'])

      // when inserting words,
      // we need to know the current sequence number
      // so that we can set the `next` field of the linked language
      const seq = await db
        .from('word_id_seq')
        .select('last_value')
        .first()

      const languageWords = [
        ['jouzu', 'skillful', 2],
        ['senpai', 'senior', 3],
        ['sensei', 'teacher', 4],
        ['arigatou', 'thank you', 5],
        ['nani', 'what', 6],
        ['nihon', 'japan', 7],
        ['otousan', 'father', 8],
        ['okaasan', 'mother', 9],
        ['oniisan', 'elder brother', 10],
        ['oneesan', 'elder sister', 11],
        ['otouto', 'younger brother', 12],
        ['imouto', 'younger sister', 13],
        ['akai', 'red', 14],
        ['aoi', 'blue', 15],
        ['kiiroi', 'yellow', 16],
        ['midori', 'green', 17],
        ['shiroi', 'white', 18],
        ['kuroi', 'black', 19],
        ['ichi', 'one', 20],
        ['ni', 'two', 21],
        ['san', 'three', 22],
        ['shi', 'four', 23],
        ['go', 'five', 24],
        ['roku', 'six', 25],
        ['shichi', 'seven', 26],
        ['hachi', 'eight', 27],
        ['kyuu', 'nine', 28],
        ['jyuu', 'ten', 29],
        ['hai', 'yes', 30],
        ['iie', 'no', 31],
        ['desu', 'is', null]
      ]

      const [languageHeadId] = await trx
        .into('word')
        .insert(
          languageWords.map(([original, translation, nextInc]) => ({
            language_id: languageId.id,
            original,
            translation,
            next: nextInc
              ? Number(seq.last_value) + nextInc
              : null
          })),
          ['id']
        )

      await trx('language')
        .where('id', languageId.id)
        .update({
          head: languageHeadId.id,
        })
    })
  },
}

module.exports = UserService
