import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import InsuranceFormInput, { checkVisibility } from "./insurance-inputs";

// Mock dependencies
jest.mock("../../../hooks/redux");
jest.mock("../../../apis/global-api");
jest.mock("../../form-builder/helpers");
jest.mock("../../../helpers/string-helper");

// Mock formInputCreator
const mockFormInputCreator = jest.fn(() => <div>Mock Form Input</div>);
jest.mock("../../form-builder/helpers", () => ({
  formInputCreator: () => mockFormInputCreator,
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    dynamic: () => ({
      resault: {
        states: ["State1", "State2"],
      },
    }),
  },
});

// Mock form methods
const mockFormMethods = {
  control: {},
  watch: jest.fn(),
  getValues: jest.fn(),
  formState: { errors: {} },
};

describe("InsuranceFormInput", () => {
  const mockData = {
    resault: [
      {
        formId: "form1",
        title: "Test Form",
        fields: [
          {
            id: "field1",
            type: "text",
            label: "Field 1",
            required: true,
          },
          {
            id: "field2",
            type: "select",
            label: "Field 2",
            visibility: {
              dependsOn: "field1",
              condition: "equals",
              value: "show",
            },
          },
          {
            id: "group1",
            type: "group",
            fields: [
              {
                id: "nestedField",
                type: "checkbox",
                label: "Nested Field",
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormMethods.watch.mockImplementation(() => ({}));
  });

  it("renders form sections with titles", () => {
    render(
      <Provider store={mockStore}>
        <InsuranceFormInput data={mockData} formmethods={mockFormMethods} />
      </Provider>
    );

    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getAllByText("Mock Form Input").length).toBeGreaterThan(0);
  });

  it("processes fields correctly", () => {
    render(
      <Provider store={mockStore}>
        <InsuranceFormInput data={mockData} formmethods={mockFormMethods} />
      </Provider>
    );

    // Verify formInputCreator was called for each visible field
    expect(mockFormInputCreator).toHaveBeenCalledTimes(2); // field1 and nestedField (field2 is hidden by default)
  });

  it("handles field visibility conditions", () => {
    // Mock watch to return a value that shows field2
    mockFormMethods.watch.mockImplementation(() => ({ field1: "show" }));

    render(
      <Provider store={mockStore}>
        <InsuranceFormInput data={mockData} formmethods={mockFormMethods} />
      </Provider>
    );

    // Now field2 should be visible
    expect(mockFormInputCreator).toHaveBeenCalledTimes(3);
  });

  it("handles group fields correctly", () => {
    render(
      <Provider store={mockStore}>
        <InsuranceFormInput data={mockData} formmethods={mockFormMethods} />
      </Provider>
    );

    // Verify nested field is processed
    expect(mockFormInputCreator).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        path: "group1.nestedField",
        type: "checkbox",
      }),
      expect.anything()
    );
  });

  it("updates when data changes", () => {
    const { rerender } = render(
      <Provider store={mockStore}>
        <InsuranceFormInput data={mockData} formmethods={mockFormMethods} />
      </Provider>
    );

    const newData = {
      ...mockData,
      resault: [
        ...mockData.resault,
        {
          formId: "form2",
          title: "New Form",
          fields: [{ id: "newField", type: "text", label: "New Field" }],
        },
      ],
    };

    rerender(
      <Provider store={mockStore}>
        <InsuranceFormInput data={newData} formmethods={mockFormMethods} />
      </Provider>
    );

    expect(screen.getByText("New Form")).toBeInTheDocument();
  });
});

describe("checkVisibility", () => {
  it("returns true for equals condition when values match", () => {
    expect(checkVisibility("test", "equals", "test")).toBe(true);
  });

  it("returns false for equals condition when values differ", () => {
    expect(checkVisibility("test", "equals", "different")).toBe(false);
  });

  it("returns true for notEquals condition when values differ", () => {
    expect(checkVisibility("test", "notEquals", "different")).toBe(true);
  });

  it("handles numeric comparisons", () => {
    expect(checkVisibility("5", "greaterThan", "3")).toBe(true);
    expect(checkVisibility("2", "lessThan", "3")).toBe(true);
  });

  it("returns true by default for unknown conditions", () => {
    expect(checkVisibility("any", "unknownCondition", "value")).toBe(true);
  });
});
