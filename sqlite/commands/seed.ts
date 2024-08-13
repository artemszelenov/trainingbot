import { sql } from "../instance";

// йога
sql
	.query(
		`
  INSERT INTO services (service_name, service_slug) 
  VALUES ('Клуб "Йога за 30 минут" в Телеграм', 'yoga-30-min');
  `,
	)
	.run();

sql
	.query(
		`
  INSERT INTO services (service_name, service_slug) 
  VALUES ('Персональная йога', 'yoga-personal');
  `,
	)
	.run();

sql
	.query(
		`
  INSERT INTO services (service_name, service_slug) 
  VALUES ('Консультация по йоге', 'yoga-consultation');
  `,
	)
	.run();

// психотерапия
sql
	.query(
		`
  INSERT INTO services (service_name, service_slug) 
  VALUES ('Индивидуальная сессия', 'psychotherapy-individual');
  `,
	)
	.run();

// комплекс
sql
	.query(
		`
  INSERT INTO services (service_name, service_slug) 
  VALUES ('Индивидуальная комплексная работа', 'complex-individual');
  `,
	)
	.run();

console.log("Services is created");
