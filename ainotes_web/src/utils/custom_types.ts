export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Full<T> = {
  [P in keyof T]-?: T[P];
};
