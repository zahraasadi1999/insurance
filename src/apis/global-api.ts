import api from "../configs/axios/axios";
import {
  setInsuranceData,
  setInsuranceSubmittedData,
} from "../redux/slices/insurance-slice";
import { setDynamicData } from "../redux/slices/dynamic-slice";

type submit_form_body = {
  data: any;
};

export async function submit_form({ data }: submit_form_body) {
  const response = await api.post("/api/insurance/forms/submit", data);
  return response;
}

type fetch_form_body = {
  dispatch: DispatchType;
};

export async function fetch_form({ dispatch }: fetch_form_body) {
  const response = await api.get("/api/insurance/forms", {});
  console.log(response);
  dispatch(setInsuranceData(response.data));
  return response;
}

type fetch_submitted_form_body = {
  dispatch: DispatchType;
};

export async function fetch_submitted_form({
  dispatch,
}: fetch_submitted_form_body) {
  const response = await api.get("/api/insurance/forms/submissions", {});
  dispatch(setInsuranceSubmittedData(response.data));

  return response;
}
type DynamicApiType = {
  dispatch: DispatchType;
  method: "get" | "post" | "put" | "delete";
  endpoint: string;
  params: any;
};
// api.ts or wherever your axios instance is defined
export async function dynamic_api({
  dispatch,
  method,
  endpoint,
  params = {},
}: DynamicApiType) {
  try {
    let response;
    switch (method.toLowerCase()) {
      case "get":
        response = await api.get(endpoint, { params });
        break;
      case "post":
        response = await api.post(endpoint, params);
        break;
      // Add other methods as needed
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    dispatch(setDynamicData(response.data));
    return response.data;
  } catch (error) {
    console.error("Dynamic API error:", error);
    throw error;
  }
}
