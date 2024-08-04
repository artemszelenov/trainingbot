CREATE TABLE form_answers_temp (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  client_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

INSERT INTO form_answers_temp (
  client_id, service_id, question, answer
) SELECT client_id, service_id, question, answer FROM form_answers;

DROP TABLE form_answers;

ALTER TABLE form_answers_temp RENAME TO form_answers;
