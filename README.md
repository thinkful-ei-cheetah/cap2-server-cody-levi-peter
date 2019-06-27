# Jouzu

+ Devs: [Cody](https://github.com/cgillette12), [Levi](https://github.com/levipaulk), and [Peter](https://github.com/Paendabear)
+ [Live](https://jouzu.now.sh/register)
+ [Client](https://github.com/thinkful-ei-cheetah/cap2-client-cody-levi-peter) Repo
+ [Server](https://github.com/thinkful-ei-cheetah/cap2-server-cody-levi-peter) Repo

## Summary

+ Jouzu is a language learning application, that is currently in alpha. Jouzu utilizes spaced repetition to improve memorization
  + In its current build...
    + Dashboard:
      + A user view the language they are currently studying as well as their total score (correct - incorrect)
      + A user can review a list of vocabulary words
        + Currently only 31 Japanese words are available.
        + Each word lists the user's number of correct and incorrect guesses
      + A user can start practicing, using spaced repetition 
    + Learn:
      + Guess the translation for the current word
        + Currently Japanese -> English
        + Number of correct / incorrect guesses is displayed
      + Correct Guess
        + Your choice and the answer are displayed
        + Total score and correct count are updated
      + Incorrect Guess
        + Your choice and the answer are displayed
        + Total score and incorrect count are updated

## Test User

+ username: `admin`
+ password: `pass`

## Local dev setup

If using user `dunder-mifflin`:

```bash
mv example.env .env
createdb -U dunder-mifflin spaced-repetition
createdb -U dunder-mifflin spaced-repetition-test
```

If your `dunder-mifflin` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=spaced-repetition-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`

## Technologies

+ This is an Express project, built using Nodejs
+ Node Modules used for this project:
  + Dependencies:
    + bcryptjs
    + cors
    + dotenv
    + express
    + helmet
    + jsonwebtoken
    + knex
    + morgan
    + pg
    + xss
    
  + devDependencies:
    + chai
    + mocha
    + nodemon
    + postgrator-cli
    + supertest