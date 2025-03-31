import { ReactElement } from "react";
import {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormReturn,
} from "react-hook-form";

type TRegisterRules<T extends FieldValues> = Omit<
  RegisterOptions<T, FieldPath<T>>,
  "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
>;
//----------------------------------------------------------------------------------

type SelectType<T extends FieldValues> = {
  type: "select";
  options: optionsType[];
  label?: string;
  path: Path<T>;
  action?: (value: any) => void;
  disabled?: { disabled: boolean };
  rules?: { required?: boolean };
  title: { id: string; sx?: any };
  sx?: any;
  placeholder?: string;
  gridProps?: any;
};
//----------------------------------------------------------------------------------
interface DynamicOptionsConfigsType<T> {
  method: "initials" | "from-form" | "dynamic" | "dependent";
  path?: string;
  watchPaths?: Path<T>[];
  params?: {
    filters?: string;
    q?: string;
  };
  url?: string;
  modifier?: (options: any, watchedValues?: any[]) => any;
  getOptionsFromResults?: (results: any) => any;
  noOptionMessage?: string;
}

//----------------------------------------------------------------------------------

type optionsType = {
  label?: string;
  name?: string;
  value?: number | boolean | string;
  id?: number | string | boolean;
  key?: number | string;
  title?: string;
};

//----------------------------------------------------------------------------------

type BaseInput = {
  gridProps?: any;
};

type TextInputType<T extends FieldValues> = {
  type: "text";
  path: Path<T>;
  masking?: boolean;
  variant?: "standard" | "filled" | "outlined";
  rules?: TRegisterRules<T>;
  multiline?: boolean;
  formMethods?: UseFormReturn<T>;
  disabled?: { disabled: boolean };
  label?: string;
  title?: { id?: string; sx?: any };
  placeholder?: string;
  gridProps?: any; // TODO: change any to grid v2 props;
  sx?: any;
};

//----------------------------------------------------------------------------------

type Custom = {
  type: "custom";
  component: ReactElement;
};

//----------------------------------------------------------------------------------

type ButtonType<T extends FieldValues> = {
  type: "button";
  label: string;
  rules?: { required: boolean };
  onClick?: (formMethods: UseFormReturn<T>) => void;
  form?: string;
  name: string;
  buttonType?: "button" | "submit" | "reset";
  end?: boolean;
  sx?: any;
  fullWidth?: boolean;
  disabled?: boolean;
  id?: string;
  icon?: {
    position: "right" | "left";
    id: string;
    path: string;
    sx?: any;
  };
  loading?: boolean;
  title?: { id: string; sx?: any };
};
//--------------------------------------------------------------------------------
interface RadioPropsType<T extends FieldValues> {
  type: "radio";
  label?: string;
  path: Path<T>;
  title?: {
    id?: string;
    sx?: React.CSSProperties;
  };
  rules?: any;
  disabled?: {
    disabled: boolean;
  };
  sx?: React.CSSProperties;
  options: string[];
}

//---------------------------------------------------------------------------------
type DatePickerType<T extends FieldValues> = {
  disabled?: { disabled: boolean };
  type: "date";
  placeholder?: string;
  label?: string;
  path: Path<T>;
  format: "YYYY-MM-DD";
  rules: { required?: boolean };
  title?: { id: string; sx?: any };
  defaultValue?: PathValue<T, Path<T>>;
};
//---------------------------------------------------------------------------------

type Input<T extends FieldValues> = (
  | TextInputType<T>
  | RadioPropsType<T>
  | SelectType<T>
  | DatePickerType<T>
  | Custom
  | ButtonType<T>
) &
  BaseInput;

//-------------------------------------------------------------------------------

export type {
  Input,
  ButtonType,
  DatePickerType,
  SelectType,
  optionsType,
  RadioPropsType,
  TextInputType,
  DynamicOptionsConfigsType,
};
