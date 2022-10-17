/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/no-var-requires
// @ts-ignore
import getRandomValues from 'get-random-values';

export const random: RandomValueFunction = bytes => {
  return getRandomValues(new Uint8Array(bytes));
};

export type RandomValueFunction = (bytes: number) => Uint8Array;
