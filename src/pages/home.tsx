import React, { useEffect } from "react";
import { fetch_form, fetch_submitted_form } from "../apis/global-api";
import { useAppDispatch } from "../hooks/redux";
import InsuranceForm from "../components/pages/insurance-form/insurance-form";
import InsuranceSubmittedTable from "../components/pages/insurance-submited-table";

const Homepage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    fetch_form({ dispatch });
    fetch_submitted_form({ dispatch });
  }, [dispatch]);
  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
      <InsuranceSubmittedTable />
      <InsuranceForm />
    </div>
  );
};
export default Homepage;
