import type { UseFormReturn, FieldValues } from "react-hook-form";

export type CardCreatorProps<T extends FieldValues> = {
  formMethods: UseFormReturn<T>;
};

export * from "./builder";
export * from "./inputs";
