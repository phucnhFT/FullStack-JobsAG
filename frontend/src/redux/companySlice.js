import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        companies: [],
        searchCompanyByText: "",
    },
    reducers: {
        //actions
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        },
        setCompanies: (state, action) => {
            state.companies = action.payload;
        }
    }
})
export const {
    setSingleCompany,
    setCompanies,
    setSearchCompanyByText
}= companySlice.actions;

export default companySlice.reducer