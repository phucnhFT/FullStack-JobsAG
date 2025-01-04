import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "user",
  initialState: { // trạng thái khởi tạo
    loading: false,
    user: null,
    emailStatus: null, // Trạng thái gửi email
    interestedCompanies: [], // Danh sách công ty mà user quan tâm
  },

  reducers: {
    // thay đổi trạng thái dựa trên actions
    //actions
    setLoading: (state, action) => {
      // trạng thái loading
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      // cập nhật thông tin người dùng
      state.user = action.payload;
    },
    setEmailStatus: (state, action) => {
      state.emailStatus = action.payload; // Trạng thái gửi email (success, error)
    },
    //get
    setInterestedCompanies: (state, action) => {
      state.interestedCompanies = action.payload; // Cập nhật danh sách công ty quan tâm
    },
    // Xóa công ty khỏi danh sách quan tâm
    removeInterestedCompany: (state, action) => {
      state.interestedCompanies = state.interestedCompanies.filter(
        (company) => company._id !== action.payload // Loại bỏ công ty theo ID
      );
    },
  },
});

export const {
  setLoading,
  setUser,
  setEmailStatus,
  setInterestedCompanies,
  removeInterestedCompany,
} = userSlice.actions;
export default userSlice.reducer;