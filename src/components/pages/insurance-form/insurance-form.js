"use client"; // Next.js directive to mark this as a Client Component

import { useFormContext } from "react-hook-form";
import { submit_form } from "../../../apis/global-api";
import InsuranceFormInput from "./insurance-inputs";
import { useAppSelector } from "../../../hooks/redux";
import FormBuilder from "../../form-builder/form";
import { forms } from "../../../configs/constants";

/**
 * Main insurance form component that handles form submission and rendering
 * Integrates with Redux for state management and react-hook-form for form handling
 */
export default function InsuranceForm() {
  // Get insurance data from Redux store
  const data = useAppSelector((state) => state.insurance);

  // Get default form values from Redux store
  const defaultValues = useAppSelector((state) => state.forms.resault);

  // Access form methods from react-hook-form context
  const formmethods = useFormContext();

  const layout = [
    {
      type: "section", // Section container
      gridProps: { xs: 24 }, // Full width on extra small screens
      inputs: [
        {
          type: "custom", // Custom component input type
          component: (
            <InsuranceFormInput formmethods={formmethods} data={data} />
          ),
          gridProps: { xs: 24 }, // Full width
        },
        {
          type: "button", // Form submit button
          form: forms.INSURANCE_FORM, // Form identifier
          buttonType: "submit", // Button type
          name: "", // No name needed for submit button
          label: "submit", // Button label
          gridProps: {
            xs: 24, // Full width
          },
        },
      ],
    },
  ];

  const handleSubmit = (data) => {
    submit_form({ data }); // Call API to submit form data
  };

  /**
   * Renders the form using FormBuilder component
   * - Passes submission handler, default values, layout, and form ID
   */
  return (
    <FormBuilder
      onSubmit={handleSubmit} // Submission handler
      defaultValues={defaultValues} // Initial form values
      formLayout={layout} // Form structure definition
      id={forms.INSURANCE_FORM} // Unique form identifier
    />
  );
}
