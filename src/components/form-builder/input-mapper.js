import CustomButton from "./components/custom-button/custom-button";
import CustomRadio from "./components/custom-radio/custom-radio";
import CustomDatePicker from "./components/custom-datepicker/custum-datepicker";
import CustomSelect from "./components/custom-select/custom-select";
import { cloneElement } from "react";
import CustomTextField from "./components/custom-text-field/custom-text-field";
import CustomCheckbox from "./components/custom-checkbox/custom-checkbox";

export const inputMapper = (inputProps, formmethods, key) => {
  // Switch based on input type to return the appropriate component
  switch (inputProps.type) {
    case "custom":
      // Clone custom component and inject formmethods prop
      return cloneElement(inputProps.component, { formmethods, key });

    case "button":
      // Custom button component with form integration
      return (
        <CustomButton {...inputProps} formmethods={formmethods} key={key} />
      );

    case "radio":
      // Custom radio button group component
      return (
        <CustomRadio {...inputProps} formmethods={formmethods} key={key} />
      );

    case "date":
      // Custom date picker component
      return (
        <CustomDatePicker {...inputProps} formmethods={formmethods} key={key} />
      );

    case "select":
      // Custom dropdown select component
      return (
        <CustomSelect {...inputProps} formmethods={formmethods} key={key} />
      );

    case "checkbox":
      // Custom checkbox component
      return (
        <CustomCheckbox {...inputProps} formmethods={formmethods} key={key} />
      );

    default:
      // Default case - renders a text input field
      // Handles types: 'text', 'password', 'email', etc.
      return (
        <CustomTextField {...inputProps} formmethods={formmethods} key={key} />
      );
  }
};
