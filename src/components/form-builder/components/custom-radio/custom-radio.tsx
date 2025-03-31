import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import { Radio, Form, Typography, Space } from "antd";
import { RadioPropsType } from "../../types";

const { Text } = Typography;

export default function CustomRadio<T extends FieldValues>({
  formmethods,
  path,
  title,
  rules,
  disabled,
  sx,
  options,
}: RadioPropsType<T> & { formmethods: UseFormReturn<T> }) {
  return (
    <Form.Item
      label={
        title?.id && (
          <Space>
            <Text>{title.id}</Text>
            {rules?.required && <Text type="danger">*</Text>}
          </Space>
        )
      }
      validateStatus={formmethods.formState.errors[path] ? "error" : ""}
      help={formmethods.formState.errors[path]?.message as string}
      style={{ width: "100%", ...sx }}>
      <Controller
        control={formmethods.control}
        name={path}
        rules={rules}
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { error },
        }) => {
          // Ensure value matches exactly with option values
          const currentValue = options.find((opt) => opt === value);

          return (
            <Radio.Group
              onChange={(e) => {
                console.log("Selected:", e.target.value); // Debugging
                onChange(e.target.value);
              }}
              onBlur={onBlur}
              value={currentValue} // Use the matched value
              disabled={disabled?.disabled}
              ref={ref}>
              <Space direction="horizontal" size={16}>
                {options.map((option) => (
                  <Radio
                    key={String(option)}
                    value={option}
                    style={{
                      cursor: disabled?.disabled ? "not-allowed" : "pointer",
                      border: `1px solid ${error ? "red" : "none"}`,
                    }}>
                    {option}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          );
        }}
      />
    </Form.Item>
  );
}
