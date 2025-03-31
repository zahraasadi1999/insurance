import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { formSectionCreator } from "./helpers";
import { Form, Row } from "antd";
import { setData } from "../../redux/slices/forms-slice";
import { useAppDispatch } from "../../hooks/redux";

/**
 * FormBuilder Component - A reusable form builder with React Hook Form integration
 * @param {Object} props - Component props
 * @param {Object} props.defaultValues - Initial form values
 * @param {Function} props.onSubmit - Submission handler function
 * @param {string} props.id - Unique form identifier
 * @param {Array|Function} props.formLayout - Form layout configuration or function that returns layout
 * @param {Object} props.title - Optional form title configuration
 */
export default function FormBuilder({
  defaultValues,
  onSubmit,
  id,
  formLayout,
  title,
}) {
  // Initialize react-hook-form with configuration
  const formmethods = useForm({
    mode: "onSubmit", // Validation mode
    shouldUnregister: false, // Keep field values when unmounted
    defaultValues: defaultValues, // Initial form values
    shouldUseNativeValidation: false, // Disable browser validation
  });

  // Redux dispatch function
  const dispatch = useAppDispatch();

  /**
   * Effect to update form values when defaultValues change
   * Ensures form stays in sync with external data changes
   */
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        formmethods.setValue(key, value);
      });
    }
  }, [defaultValues, formmethods]);

  // Form styles configuration
  const styles = {
    form: { width: "inherit" }, // Inherit parent width
    inputTitle: {
      fontSize: "20px",
      width: "100%",
      ...title?.sx, // Merge custom title styles
    },
    subtitle: {
      fontSize: "16px",
      fontWeight: 300,
      width: "100%",
    },
    container: {}, // Container for form sections
  };

  /**
   * Effect to initialize form values (duplicate for emphasis in code)
   * This ensures form values are properly set on mount
   */
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        formmethods.setValue(key, value);
      });
    }
  }, [defaultValues, formmethods]);

  // Process form layout (can be either array or function that returns array)
  const formLayoutArray =
    typeof formLayout === "function" ? formLayout(formmethods) : formLayout;

  return (
    <FormProvider {...formmethods}>
      {/* 
        Ant Design Form with react-hook-form integration
        - Uses handleSubmit for form submission
        - Updates Redux store on submission
      */}
      <Form
        id={id}
        onFinish={formmethods.handleSubmit((data) => {
          // Call provided onSubmit handler
          onSubmit(data, formmethods);
          // Update form state in Redux
          dispatch(setData({ path: `${id}.isDirty`, value: false }));
        })}
        style={styles.form}
      >
        {/* Optional form title */}
        {title?.id && <div style={styles.inputTitle}>{title.id}</div>}

        {/* Form content container */}
        <div style={styles.container}>
          {/* Responsive row layout for form sections */}
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {/* Render each form section using formSectionCreator */}
            {formLayoutArray &&
              formLayoutArray.map((section, index) =>
                formSectionCreator(formmethods, section, index)
              )}
          </Row>
        </div>
      </Form>
    </FormProvider>
  );
}