import React, { JSX, useState } from "react";
import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import { Select, Form, Typography, Space } from "antd";

import { SelectType } from "../../types";

const { Text } = Typography;

const CustomSelect = <T extends FieldValues>({
  formmethods,
  options,
  disabled,
  path,
  action,
  rules,
  title,
  placeholder,

  sx,
}: SelectType<T> & { formmethods: UseFormReturn<T> }): JSX.Element => {
  const [initOptions, setInitOptions] = useState(options);

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
          field: { onChange, value, ref },
          fieldState: { error },
        }) => {
          const selectedValue = initOptions?.find(
            (option: any) => option === value
          );

          return (
            <Select
              style={{ width: "100%" }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.toLowerCase().includes(input.toLowerCase())
              }
              disabled={disabled?.disabled}
              placeholder={placeholder}
              value={selectedValue ? selectedValue : undefined}
              onChange={(value, option) => {
                onChange(option);
                action && action(option);
              }}
              options={initOptions?.map((option: any) => ({
                value: option,
                label: option,
                option: option, // Pass the original option as additional data
              }))}
              onFocus={(e) => e.preventDefault()}
              status={error ? "error" : ""}
              allowClear
            />
          );
        }}
      />
    </Form.Item>
  );
};

export default CustomSelect;
