import { Controller, } from "react-hook-form";
import {  Form, Typography, Space, Checkbox } from "antd";

const { Text } = Typography;

export default function CustomCheckbox({
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


  // For checkbox type

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
            <Checkbox
              disabled={disabled?.disabled}
              style={{
                border: error ? "1px solid red" : "none",
                borderRadius: "7px",
                padding: "8px",
                width: "100%",
              }}
              onChange={(e) => onChange(e.target.checked)}
              checked={value}
              onBlur={onBlur}>
              {placeholder}
            </Checkbox>
          )}
        />
      </Form.Item>
    );
  }

  