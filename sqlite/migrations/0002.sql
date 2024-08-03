CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  service_name TEXT NOT NULL,
  service_slug TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS form_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  question TEXT NOT NULL,
  service_id INTEGER NOT NULL,
  prev_question_id INTEGER,
  next_question_id INTEGER,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (prev_question_id) REFERENCES questions(id),
  FOREIGN KEY (next_question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS form_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  answer TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (question_id) REFERENCES form_questions(id)
);

ALTER TABLE clients ADD COLUMN age INTEGER;