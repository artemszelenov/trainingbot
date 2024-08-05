import { sql } from "../../../../sqlite/instance";

export class Service {
  id: number;
  service_name: string;
  service_slug: string;
}

export function db_get_service(service_id: number) {
  return sql
    .query(
      `SELECT * FROM services WHERE id = ?;`
    )
    .as(Service)
    .get(service_id);
}

export function db_get_service_by_slug(service_slug: string) {
  return sql
    .query(
      `SELECT * FROM services WHERE service_slug = ?;`
    )
    .as(Service)
    .get(service_slug);
}
