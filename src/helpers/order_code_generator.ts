import { monotonicFactory } from 'ulid';

export const generateCode = (prefix: string): string => {
  const generateUlid = monotonicFactory();
  const code = generateUlid().slice(0, 10);

  return prefix.toUpperCase() + code;
};
