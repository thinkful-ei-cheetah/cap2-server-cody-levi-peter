BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Japanese', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'jouzu', 'skillful', 2),
  (2, 1, 'senpai', 'senior', 3),
  (3, 1, 'sensei', 'teacher', 4),
  (4, 1, 'arigatou', 'thank you', 5),
  (5, 1, 'nani', 'what', 6),
  (6, 1, 'nihon', 'japan', 7),
  (7, 1, 'otousan', 'father', 8),
  (8, 1, 'okaasan', 'mother', 9),
  (9, 1, 'oniisan', 'elder brother', 10),
  (10, 1, 'oneesan', 'elder sister', 11),
  (11, 1, 'otouto', 'younger brother', 12),
  (12, 1, 'imouto', 'younger sister', 13),
  (13, 1, 'akai', 'red', 14),
  (14, 1, 'aoi', 'blue', 15),
  (15, 1, 'kiiroi', 'yellow', 16),
  (16, 1, 'midori', 'green', 17),
  (17, 1, 'shiroi', 'white', 18),
  (18, 1, 'kuroi', 'black', 19),
  (19, 1, 'ichi', 'one', 20),
  (20, 1, 'ni', 'two', 21),
  (21, 1, 'san', 'three', 22),
  (22, 1, 'shi', 'four', 23),
  (23, 1, 'go', 'five', 24),
  (24, 1, 'roku', 'six', 25),
  (25, 1, 'shichi', 'seven', 26),
  (26, 1, 'hachi', 'eight', 27),
  (27, 1, 'kyuu', 'nine', 28),
  (28, 1, 'jyuu', 'ten', 29),
  (29, 1, 'hai', 'yes', 30),
  (30, 1, 'iie', 'no', 31),
  (31, 1, 'desu', 'is', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
