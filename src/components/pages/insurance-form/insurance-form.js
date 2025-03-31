"use client";
import { useFormContext } from "react-hook-form";
import { submit_form } from "../../../apis/global-api";
import InsuranceFormInput from "./insurance-inputs";
import { useAppSelector } from "../../../hooks/redux";
import FormBuilder from "../../form-builder/form";

export default function InsuranceForm() {
  const data = useAppSelector((state) => state.insurance);
  const defaultValues = useAppSelector((state) => state.forms.resault);
  const formmethods = useFormContext();
  const layout = [
    {
      type: "section",
      gridProps: { xs: 24 },
      inputs: [
        {
          type: "custom",
          component: (
            <InsuranceFormInput formmethods={formmethods} data={data} />
          ),
          gridProps: { xs: 24 },
        },
        {
          type: "button",
          form: "forms.ADVANCE_SEARCH_FORM",
          buttonType: "submit",
          name: "",
          label: "submit",
          gridProps: {
            xs: 24,
          },
        },
      ],
    },
  ];
  const handleSubmit = (data) => {
    console.log(data);
    submit_form({ data });
  };

  return (
    <FormBuilder
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      formLayout={layout}
      id={"forms.ADVANCE_SEARCH_FORM"}
    />
  );
}
