import { ReactNode } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "./inputs";

type TitleType = {
  id?: string;
  sx?: any;
};

type ActionCreator<T extends FieldValues> = (actionArg: {
  formmethods: UseFormReturn<T>;
  name?: string;
  path?: string;
}) => ReactNode;

type LayoutType<T extends FieldValues> = {
  gridProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    sx: any;
  };
  inputs: Card<T>[];
}[];

interface Card<T extends FieldValues> {
  type:
    | "text"
    | "phone-number"
    | "avatar"
    | "image-croper"
    | "select"
    | "button"
    | "date-picker"
    | "custom"
    | "section";

  disabled?: { disabled?: boolean };

  gridProps?: any;
  title?: { id: string; sx?: any };
  path?: Path<T>;
  action?: ActionCreator<T>;
  inputs?: Input<T>[];
}

type BuilderProps<TFormValues extends FieldValues> = {
  onSubmit: (
    v: TFormValues,
    formMethods: UseFormReturn<TFormValues, any, undefined>
  ) => void;
  defaultValues?: TFormValues | undefined;
  id: string;
  formLayout?:
    | Card<TFormValues>[]
    | ((formMethods: UseFormReturn<TFormValues>) => Card<TFormValues>[]);

  title?: TitleType;
};

export type { BuilderProps, Card, LayoutType };
