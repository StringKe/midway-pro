export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export declare type MidwayProConfig = DeepPartial<{
  format: {
    ignoreList: string[];
  };
}>;
