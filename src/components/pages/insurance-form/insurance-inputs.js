import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { Row } from "antd";
import { formInputCreator } from "../../form-builder/helpers";
import {
  findKeyValue,
  getDependentFieldObjects,
} from "../../../helpers/string-helper";
import { dynamic_api } from "../../../apis/global-api";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

export default function InsuranceFormInput({ data, formmethods }) {
  const [formSections, setFormSections] = useState({});
  const form = formmethods.watch();
  const dispatch = useAppDispatch();
  const dynumic = useAppSelector((state) => state.dynamic);
  const watchAllFields = useWatch({
    control: formmethods.control,
  });

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

        if (!showingCondition) return []; // Ensure undefined is not returned
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
                      params: { [value.label.toLowerCase()]: item.label }, // Assuming value.label holds the value to be sent
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
                format: "YYYY-MM-DD", // Ensure required props are set
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
function checkVisibility(currentValue, condition, expectedValue) {
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
