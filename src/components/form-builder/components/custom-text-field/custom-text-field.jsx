import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import { Input, Form, Typography, Space } from "antd";
import { TextInputType } from "../../types";

const { Text } = Typography;

export default function CustomTextField({
  path,
  rules = {},
  formmethods,
  disabled,
  label,
  title,
  type,
  placeholder,
  sx,
  masking = false,
  multiline,
  gridProps,
  ...InputProps
}) {
  const maskValue = (value) => {
    return masking && value.length > 5
      ? value.slice(0, 1) + "****" + value.slice(5)
      : value;
  };

  return (
    <Form.Item
      label={
        title?.id && (
          <Space>
            <Text>{title.id}</Text>
            {rules.required && <Text type="danger">*</Text>}
          </Space>
        )
      }
      validateStatus={formmethods.formState.errors[path] ? "error" : ""}
      help={formmethods.formState.errors[path]?.message}
      style={{ width: "100%", ...sx }}>
      <Controller
        control={formmethods.control}
        name={path}
        rules={rules}
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { error },
        }) => (
            <Input
              disabled={disabled?.disabled}
              style={{
                border: `1px solid ${error ? "red" : "none"}`,
                borderRadius: "7px",
              }}
              onChange={(e) => onChange(e.target.value)}
              id={`#-${path}`}
              onBlur={onBlur}
              value={maskValue(value || "")}
              placeholder={placeholder}
              type={type || "text"}
              {...(multiline && { rows: 4, as: "textarea" })}
            />
        )}
      />
    </Form.Item>
  );
}
