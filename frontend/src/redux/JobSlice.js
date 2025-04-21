import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "", // Tìm kiếm theo tên công việc
    allAppliedJobs: [],
    searchedQuery: {
      location: "", // Địa điểm lọc
      salary: "", // Mức lương lọc
      searchJobByText: "", // Tìm kiếm theo từ khóa
      category: "",
    },
    categories: [],
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = { ...state.searchedQuery, ...action.payload };
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setCategories,
} = jobSlice.actions;

export default jobSlice.reducer;
