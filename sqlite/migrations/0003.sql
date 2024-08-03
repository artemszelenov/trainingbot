DROP TABLE IF EXISTS form_questions;

DROP TABLE IF EXISTS form_answers;

ALTER TABLE clients ADD COLUMN awaited_form_service_id INTEGER;

CREATE TABLE form_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  client_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);
