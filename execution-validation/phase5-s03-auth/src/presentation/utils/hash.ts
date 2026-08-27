/**
 * Função de hash “falsa” para fins de demonstração.
 * Em produção use bcrypt, argon2 ou similar.
 */
export function hashPassword(password: string): string {
  // simples reverso + base64 – NÃO USE EM PRODUÇÃO!
  return Buffer.from(password.split("").reverse().join("")).toString(
    "base64"
  );
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}