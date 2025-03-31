import React from "react";
import { Button, Form, Typography, Space } from "antd";
import { ButtonType } from "../../types";
import { FieldValues, UseFormReturn } from "react-hook-form";

const { Text } = Typography;

export default function CustomButton<T extends FieldValues>({
  formmethods,
  label,
  onClick,
  form,
  buttonType = "button",
  end,
  sx = {},
  disabled,
  id,
  icon,
  title,
  rules,
}: ButtonType<T> & { formmethods: UseFormReturn<T> }) {
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
      style={{ width: "100%", ...sx }}
      validateStatus={formmethods.formState.errors[id as string] ? "error" : ""}
      help={formmethods.formState.errors[id as string]?.message as string}>
      <Button
        id={id}
        onClick={onClick ? () => onClick(formmethods) : undefined}
        form={form}
        type={buttonType === "submit" ? "primary" : "default"}
        htmlType={buttonType}
        disabled={disabled}
        style={{
          width: "100%",
          minHeight: "44px",
          minWidth: "5rem",
          marginLeft: end ? "auto" : undefined,
        }}>
        {label}
      </Button>
    </Form.Item>
  );
}
