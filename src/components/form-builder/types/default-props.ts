type getUniqueValueType =
  | string
  | number
  | boolean
  | {
      label?: string;
      name?: string;
      value?: number | boolean | string;
      id?: number | string | boolean;
      key?: number | string;
      title?: string;
    };
export type { getUniqueValueType };
