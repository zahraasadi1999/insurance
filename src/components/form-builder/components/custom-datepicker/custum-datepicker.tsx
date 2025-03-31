import React, { useEffect } from "react";
import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import { DatePicker, Form, Typography, Space } from "antd";
import type { DatePickerProps } from "antd";
import dayjs from "dayjs";
import { DatePickerType } from "../../types";

const { Text } = Typography;

const CustomDatePicker = <T extends FieldValues>({
  disabled,
  formmethods,
  path,
  rules,
  title,
  defaultValue,
  placeholder = "Select date",
  format = "YYYY-MM-DD",
}: DatePickerType<T> & { formmethods: UseFormReturn<T> }) => {
  useEffect(() => {
    if (defaultValue) {
      formmethods.setValue(path, defaultValue as any);
    }
  }, [defaultValue, formmethods, path]);

  const handleChange: DatePickerProps["onChange"] = (date, dateString) => {
    formmethods.setValue(path, dateString as any);
  };

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
      style={{ width: "100%" }}>
      <Controller
        name={path}
        control={formmethods.control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            style={{
              width: "100%",
              border: `1px solid ${error ? "red" : "none"}`,
            }}
            onChange={handleChange}
            onBlur={field.onBlur}
            value={field.value ? dayjs(field.value) : null}
            disabled={disabled?.disabled}
            placeholder={placeholder}
            format={format}
            allowClear
          />
        )}
      />
    </Form.Item>
  );
};

export default CustomDatePicker;
