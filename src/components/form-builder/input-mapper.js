import CustomButton from "./components/custom-button/custom-button";
import CustomRadio from "./components/custom-radio/custom-radio";
import CustomDatePicker from "./components/custom-datepicker/custum-datepicker";
import CustomSelect from "./components/custom-select/custom-select";
import { cloneElement } from "react";
import CustomTextField from "./components/custom-text-field/custom-text-field";
import CustomCheckbox from "./components/custom-checkbox/custom-checkbox";

export const inputMapper = (inputProps, formmethods, key) => {
  switch (inputProps.type) {
    case "custom":
      return cloneElement(inputProps.component, { formmethods, key });

    case "button":
      return (
        <CustomButton {...inputProps} formmethods={formmethods} key={key} />
      );
    case "radio":
      return (
        <CustomRadio {...inputProps} formmethods={formmethods} key={key} />
      );
    case "date":
      return (
        <CustomDatePicker {...inputProps} formmethods={formmethods} key={key} />
      );
    case "select":
      return (
        <CustomSelect {...inputProps} formmethods={formmethods} key={key} />
      );
    case "checkbox":
      return (
        <CustomCheckbox {...inputProps} formmethods={formmethods} key={key} />
      );
    default:
      return (
        <CustomTextField {...inputProps} formmethods={formmethods} key={key} />
      );
  }
};
