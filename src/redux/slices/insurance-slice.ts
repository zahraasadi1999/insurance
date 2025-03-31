import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../types";
enum InsuranceStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

enum InsuranceType {
  Health = "Health",
  Life = "Life",
  Auto = "Auto",
  Home = "Home",
}

interface EnhancedInsuranceRecord {
  id: string;
  fullName: string; // Using camelCase instead of spaced property names
  age: number;
  insuranceType: InsuranceType | string; // Enum + fallback
  city: string;
  status: InsuranceStatus | string;
}

interface EnhancedInsuranceData {
  columns: (keyof EnhancedInsuranceRecord)[];
  data: EnhancedInsuranceRecord[];
}
interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "select" | "radio" | "checkbox" | "number" | "group";
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  visibility?: {
    dependsOn: string;
    condition: "equals";
    value: string;
  };
  dynamicOptions?: {
    dependsOn: string;
    endpoint: string;
    method: "GET" | "POST";
  };
  fields?: FormField[];
}

interface InsuranceForm {
  formId: string;
  title: string;
  fields: FormField[];
}

interface InsuranceFormsResponse {
  resault: InsuranceForm[];
  submitted: EnhancedInsuranceData;
}

// Properly typed initial state
const initialState: InsuranceFormsResponse = {
  resault: [], // Initialize as empty array
  submitted: {
    columns: [],
    data: [],
  },
};

const insuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    setInsuranceData: (state, action: PayloadAction<InsuranceForm[]>) => {
      state.resault = action.payload;
    },
    setInsuranceSubmittedData: (
      state,
      action: PayloadAction<EnhancedInsuranceData>
    ) => {
      state.submitted = action.payload;
    },
    // Add more reducers as needed
  },
});

// Selector
export const selectInsuranceData = (state: RootState) => state.insurance;

// Actions
export const { setInsuranceData, setInsuranceSubmittedData } =
  insuranceSlice.actions;

// Reducer
export default insuranceSlice.reducer;
