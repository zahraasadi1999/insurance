import { useEffect } from "react";
import {
  FormProvider,
  useForm,
} from "react-hook-form";
import { formSectionCreator } from "./helpers";
import { Form, Row } from "antd";
import { setData } from "../../redux/slices/forms-slice";
import { useAppDispatch } from "../../hooks/redux";

export default function FormBuilder({
  defaultValues,
  onSubmit,
  id,
  formLayout,
  title,
}) {
  const formmethods = useForm({
    mode: "onSubmit",
    shouldUnregister: false,
    defaultValues: defaultValues ,
    shouldUseNativeValidation: false,
  });


const dispatch=useAppDispatch()

 

  // Update form values on `defaultValues` change
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        formmethods.setValue(
          key,
          value 
        );
      });
    }
  }, [defaultValues, formmethods]);

  
  const styles = {
    form: { width: "inherit" },
    inputTitle: {
      fontSize: "20px",
      width: "100%",
      ...title?.sx,
    },
    subtitle: {
      fontSize: "16px",
      fontWeight: 300,
      width: "100%",
    },
    container: {},
  };

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        formmethods.setValue(
          key ,
          value 
        );
      });
    }
  }, [defaultValues, formmethods]);

  const formLayoutArray =
    typeof formLayout === "function" ? formLayout(formmethods) : formLayout;

  return (
    <FormProvider {...formmethods}>
      <Form
        id={id}
        onFinish={formmethods.handleSubmit((data) => {
          onSubmit(data, formmethods);
          dispatch(setData({ path: `${id}.isDirty`, value: false }));
        })}
        style={styles.form}>
        {title?.id && <div style={styles.inputTitle}>{title.id}</div>}
        <div style={styles.container}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {formLayoutArray &&
              formLayoutArray.map((section, index) =>
                formSectionCreator(formmethods, section, index)
              )}
          </Row>
        </div>
      </Form>
    </FormProvider>
  );
}
