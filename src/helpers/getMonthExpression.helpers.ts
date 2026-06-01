import environment from '../configs/environment';

export function getMonthExpression(column: string) {
  const dbType = environment.DB_TYPE;

  switch (dbType) {
    case 'mysql':
    case 'mariadb':
      return `DATE_FORMAT(${column}, '%Y-%m')`;

    case 'sqlite':
    case 'better-sqlite3':
      return `strftime('%Y-%m', ${column})`;

    case 'postgres':
      return `TO_CHAR(${column}, 'YYYY-MM')`;

    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
}
