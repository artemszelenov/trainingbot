/**
 * A single .sql file can contain multiple sql statements
 * splitted by an empty line
 */
export function parse_sql_content(content: string): string[] {
  const parts = content
    .split(/\n\n/gm)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
  return parts;
}
