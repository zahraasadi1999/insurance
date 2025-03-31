import { toPascalCase } from "../../helpers/string-helper";
import { getUniqueValueType } from "./types/default-props";

export const getUniqueValue = (option: getUniqueValueType) => {
  if (option || option === 0 || option === "0" || typeof option === "boolean") {
    return typeof option === "string" ||
      typeof option === "number" ||
      typeof option === "boolean"
      ? option
      : String(option.id) ||
          String(option.key) ||
          String(option.title) ||
          String(option.name) ||
          String(option.value);
  }
  return null;
};

export const getLabel = (option: getUniqueValueType) => {
  if (option || option === 0 || option === "0") {
    if (typeof option === "string") {
      return toPascalCase(option);
    } else if (typeof option === "object" && option !== null) {
      return (
        String(option.title) ||
        String(option.label) ||
        String(option.key) ||
        String(option.name) ||
        String(option.id) ||
        String(option.value)
      );
    } else {
      return option.toString();
    }
  }
};
