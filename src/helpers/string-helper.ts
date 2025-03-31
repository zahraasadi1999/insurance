// Converts a string to PascalCase
export const toPascalCase = (string: string): string => {
  return string
    ?.replace(/_/g, " ")
    .replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase());
};

export function findKeyValue(
  obj: Record<string, unknown>,
  key: string
): unknown {
  for (const [k, v] of Object.entries(obj)) {
    if (k === key) return v;
    if (typeof v === "object" && v !== null) {
      const result = findKeyValue(v as Record<string, unknown>, key);
      if (result !== undefined) return result;
    }
  }
  return undefined;
}
export const isFieldDynamic = (formConfig: any[], fieldId: string): boolean => {
  for (const form of formConfig) {
    for (const field of form.fields) {
      if (checkDependency(field, fieldId)) {
        return field;
      }
    }
  }
  return false;
};

const checkDependency = (field: any, fieldId: string): boolean => {
  if (field.type === "group" && field.fields) {
    return field.fields.some((subField: any) =>
      checkDependency(subField, fieldId)
    );
  }

  return field.dynamicOptions?.dependsOn === fieldId;
};
export const getDependentFields = (
  formConfig: any[],
  fieldId: string
): string[] => {
  const dependentFields: string[] = [];

  const checkDependency = (field: any) => {
    if (field.type === "group" && field.fields) {
      field.fields.forEach(checkDependency);
    } else if (field.dynamicOptions?.dependsOn === fieldId) {
      dependentFields.push(field.id);
    }
  };

  formConfig.forEach((form) => form.fields.forEach(checkDependency));

  return dependentFields;
};
export const getDependentFieldObjects = (
  formConfig: any[],
  fieldId: string
): any[] => {
  const dependentFields: any[] = [];

  const checkDependency = (field: any) => {
    if (field.type === "group" && field.fields) {
      field.fields.forEach(checkDependency);
    } else if (field.dynamicOptions?.dependsOn === fieldId) {
      dependentFields.push(field);
    }
  };

  formConfig.forEach((form) => form.fields.forEach(checkDependency));

  return dependentFields;
};
