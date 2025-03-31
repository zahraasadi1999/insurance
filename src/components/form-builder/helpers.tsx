import { cloneElement, isValidElement } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Card, Input } from "./types";
import { Col, Row } from "antd";
import { inputMapper } from "./input-mapper";

const styles = {
  inputsHolder: {
    width: "100%",
  },
  header: {
    width: "100%",
    marginBottom: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: 1,
  },
  sectionTitle: {
    fontSize: "1.2em",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  sectionAction: {
    flexGrow: "1",
    display: "flex",
    justifyContent: "end",
  },
  inputHolder: {
    display: "flex",
    width: "100%",
    alignItems: "end",
  },
};

export const formSectionCreator = <T extends FieldValues>(
  formmethods: UseFormReturn<T>,
  section: Card<T>,
  key: string | number
) => {
  return (
    <Col {...(section.gridProps || {})} key={key}>
      <div
        style={{
          ...styles.inputsHolder,
          ...(section.gridProps?.style || {}),
        }}>
        {(section.title?.id || section.action) && (
          <div style={styles.header}>
            {section.title?.id && <div>{section.title?.id}</div>}
            {section.action && (
              <div style={styles.sectionAction}>
                {isValidElement(section.action)
                  ? cloneElement(section.action, formmethods)
                  : section.action({ formmethods })}
              </div>
            )}
          </div>
        )}
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {(section.inputs || []).map((input, index: number) =>
            formInputCreator(formmethods, input, `${key}_${index}`)
          )}
        </Row>
      </div>
    </Col>
  );
};

export const formInputCreator = <T extends FieldValues>(
  formmethods: UseFormReturn<T>,
  inputProps: Input<T>,
  key: string | number
) => {
  return (
    <Col
      {...(inputProps.gridProps || {})}
      key={key}
      style={{ display: "flex", width: "100%" }}>
      <div
        style={{
          ...styles.inputHolder,
          ...(inputProps.gridProps?.style || {}),
        }}>
        {inputMapper(inputProps, formmethods, "")}
      </div>
    </Col>
  );
};
