// import { useEffect, useState } from "react";
// import { useWatch } from "react-hook-form";
// import { Row } from "antd";
// import { formInputCreator } from "../../form-builder/helpers";
// import {
//   findKeyValue,
//   getDependentFieldObjects,
// } from "../../../helpers/string-helper";
// import { dynamic_api } from "../../../apis/global-api";
// import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

// export default function InsuranceFormInput({ data, formmethods }) {
//   // State to store processed form sections
//   const [formSections, setFormSections] = useState({});

//   // Watch all form values
//   const form = formmethods.watch();

//   // Redux hooks for state management
//   const dispatch = useAppDispatch();
//   const dynumic = useAppSelector((state) => state.dynamic);

//   // Watch all fields for changes
//   const watchAllFields = useWatch({
//     control: formmethods.control,
//   });

//   /**
//    * Main effect to process form data and build form sections
//    * Runs when form data, watched fields, or dependencies change
//    */
//   useEffect(() => {
//     /**
//      * Recursively processes form fields to generate input configurations
//      * @param {Array} fields - Array of field definitions
//      * @param {string} parentPath - Path for nested fields (used for groups)
//      * @returns {Array} Processed field configurations
//      */
//     const processFields = (fields, parentPath = "") => {
//       return fields.flatMap((field) => {
//         // Build full path for the field (including parent path for nested fields)
//         const fullPath = parentPath ? `${parentPath}.${field.id}` : field.id;

//         // Handle group fields recursively
//         if (field.type === "group" && field.fields) {
//           return processFields(field.fields, fullPath);
//         }

//         // Check field visibility conditions
//         const dependsOnPath = field.visibility?.dependsOn ?? "";
//         const dependsOnValue = findKeyValue(form, dependsOnPath);
//         const showingCondition = checkVisibility(
//           dependsOnValue,
//           field.visibility?.condition,
//           field.visibility?.value
//         );

//         // Skip hidden fields
//         if (!showingCondition) return [];

//         // Common properties for all field types
//         const commonProps = {
//           sx: {
//             background: "inherit",
//             border: "none",
//             ...field.sx, // Merge custom styles
//           },
//           title: {
//             id: field.label ?? "defaultTitle",
//             rules: { required: field.required },
//             sx: {
//               fontSize: { xs: "10px", sm: "14px" }, // Responsive font sizes
//               fontWeight: 400,
//               ...field.sx,
//             },
//           },
//           rules: { required: field.required },
//           gridProps: {
//             xs: 24, // Full width on mobile
//             md: 12, // Half width on medium screens
//             lg: 8, // One third width on large screens
//           },
//           path: fullPath,
//           // Fallback to dynamic options from Redux if no options provided
//           options: field.options ?? dynumic.resault.states ?? [],

//           // Action handler for dependent fields
//           action: (item) => {
//             const result = getDependentFieldObjects(data.resault, field.id);
//             if (result.length) {
//               // Handle dependent field updates
//               const handleDependentFields = (
//                 dependentFields,
//                 dispatch,
//                 value
//               ) => {
//                 dependentFields.forEach((field) => {
//                   if (field.dynamicOptions) {
//                     // Make API call for dynamic options
//                     dynamic_api({
//                       dispatch,
//                       method: field.dynamicOptions.method,
//                       endpoint: field.dynamicOptions.endpoint,
//                       params: { [value.label.toLowerCase()]: item.label },
//                     });
//                   }
//                 });
//               };
//               handleDependentFields(result, dispatch, { label: field.label });
//             }
//           },
//         };

//         // Return field configuration based on type
//         switch (field.type) {
//           case "select":
//             return [{ ...commonProps, type: "select" }];
//           case "radio":
//             return [{ ...commonProps, type: field.type }];
//           case "checkbox":
//             return [{ ...commonProps, type: field.type }];
//           case "date":
//             return [
//               {
//                 ...commonProps,
//                 type: "date",
//                 format: "YYYY-MM-DD", // Date format
//                 rules: { required: field.required },
//               },
//             ];
//           default:
//             return [{ ...commonProps, type: "text" }]; // Default to text input
//         }
//       });
//     };

//     // Process all sections from the form data
//     const newFormSections = {};
//     data.resault.forEach((section) => {
//       newFormSections[section.formId] = processFields(section.fields);
//     });

//     // Update state with processed sections
//     setFormSections(newFormSections);
//   }, [data.resault, watchAllFields, formmethods, dynumic.resault, dispatch]);

//   // Render form sections
//   return (
//     <div
//       style={{
//         marginBottom: 32,
//         display: "flex",
//         flexDirection: "column",
//       }}>
//       {data.resault.map((item) => (
//         <div
//           key={item.formId}
//           style={{
//             marginBottom: 32,
//             display: "flex",
//             flexDirection: "column",
//           }}>
//           <h2 style={{ marginBottom: 16 }}>{item.title}</h2>
//           <Row gutter={[24, 24]}>
//             {formSections[item.formId]?.map((input, index) =>
//               formInputCreator(formmethods, input, index)
//             )}
//           </Row>
//         </div>
//       ))}
//     </div>
//   );
// }

// export function checkVisibility(currentValue, condition, expectedValue) {
//   switch (condition) {
//     case "equals":
//       return currentValue === expectedValue;
//     case "notEquals":
//       return currentValue !== expectedValue;
//     case "greaterThan":
//       return Number(currentValue) > Number(expectedValue);
//     case "lessThan":
//       return Number(currentValue) < Number(expectedValue);
//     default:
//       return true; // Default to visible if no condition specified
//   }
// }
import { useCallback, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Row } from "antd";
import { formInputCreator } from "../../form-builder/helpers";
import { debounce } from "lodash";

import {
  findKeyValue,
  getDependentFieldObjects,
} from "../../../helpers/string-helper";
import { dynamic_api } from "../../../apis/global-api";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDefaultData } from "../../../redux/slices/forms-slice";

export default function InsuranceFormInput({ data, formmethods }) {
  // State to store processed form sections
  const [formSections, setFormSections] = useState({});

  // Watch all form values
  const form = formmethods.watch();

  // Redux hooks for state management
  const dispatch = useAppDispatch();
  const dynumic = useAppSelector((state) => state.dynamic);

  // Watch all fields for changes
  const watchAllFields = useWatch({
    control: formmethods.control,
  });

  /**
   * Handle form blur event - dispatch data to Redux
   */
  const debouncedDispatch = useCallback(
    debounce((values) => {
      dispatch({
        type: "FORM_DATA_UPDATED",
        payload: {
          formId: "insuranceForm",
          data: values,
        },
      });
    }, 500),
    [dispatch]
  );
  // Dispatch when values change
  useEffect(() => {
    if (form) {
      debouncedDispatch(form);
    }
  }, [form, debouncedDispatch]);
  // Main effect to process form data and build form sections
  useEffect(() => {
    const processFields = (fields, parentPath = "") => {
      return fields.flatMap((field) => {
        const fullPath = parentPath ? `${parentPath}.${field.id}` : field.id;

        if (field.type === "group" && field.fields) {
          return processFields(field.fields, fullPath);
        }

        const dependsOnPath = field.visibility?.dependsOn ?? "";
        const dependsOnValue = findKeyValue(form, dependsOnPath);
        const showingCondition = checkVisibility(
          dependsOnValue,
          field.visibility?.condition,
          field.visibility?.value
        );

        if (!showingCondition) return [];

        const commonProps = {
          sx: {
            background: "inherit",
            border: "none",
            ...field.sx,
          },
          title: {
            id: field.label ?? "defaultTitle",
            rules: { required: field.required },
            sx: {
              fontSize: { xs: "10px", sm: "14px" },
              fontWeight: 400,
              ...field.sx,
            },
          },
          rules: { required: field.required },
          gridProps: {
            xs: 24,
            md: 12,
            lg: 8,
          },
          path: fullPath,
          options: field.options ?? dynumic.resault.states ?? [],
          action: (item) => {
            const result = getDependentFieldObjects(data.resault, field.id);
            if (result.length) {
              const handleDependentFields = (
                dependentFields,
                dispatch,
                value
              ) => {
                dependentFields.forEach((field) => {
                  if (field.dynamicOptions) {
                    dynamic_api({
                      dispatch,
                      method: field.dynamicOptions.method,
                      endpoint: field.dynamicOptions.endpoint,
                      params: { [value.label.toLowerCase()]: item.label },
                    });
                  }
                });
              };
              handleDependentFields(result, dispatch, { label: field.label });
            }
          },
        };

        switch (field.type) {
          case "select":
            return [{ ...commonProps, type: "select" }];
          case "radio":
            return [{ ...commonProps, type: field.type }];
          case "checkbox":
            return [{ ...commonProps, type: field.type }];
          case "date":
            return [
              {
                ...commonProps,
                type: "date",
                format: "YYYY-MM-DD",
                rules: { required: field.required },
              },
            ];
          default:
            return [{ ...commonProps, type: "text" }];
        }
      });
    };

    const newFormSections = {};
    data.resault.forEach((section) => {
      newFormSections[section.formId] = processFields(section.fields);
    });

    setFormSections(newFormSections);
  }, [data.resault, watchAllFields, formmethods, dynumic.resault, dispatch]);

  return (
    <div
      style={{
        marginBottom: 32,
        display: "flex",
        flexDirection: "column",
      }}>
      {data.resault.map((item) => (
        <div
          key={item.formId}
          style={{
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
          }}>
          <h2 style={{ marginBottom: 16 }}>{item.title}</h2>
          <Row gutter={[24, 24]}>
            {formSections[item.formId]?.map((input, index) =>
              formInputCreator(formmethods, input, index)
            )}
          </Row>
        </div>
      ))}
    </div>
  );
}

export function checkVisibility(currentValue, condition, expectedValue) {
  switch (condition) {
    case "equals":
      return currentValue === expectedValue;
    case "notEquals":
      return currentValue !== expectedValue;
    case "greaterThan":
      return Number(currentValue) > Number(expectedValue);
    case "lessThan":
      return Number(currentValue) < Number(expectedValue);
    default:
      return true;
  }
}
