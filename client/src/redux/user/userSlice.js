import { createSlice } from "@reduxjs/toolkit";
const SERVER_URL = "http://localhost:3000";

const initialState = {
    currentUser: null,
    isLoading: false,
    token: null,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.isLoading = false;

            const user = action.payload;
            if (user.avatar && !user.avatar.startsWith('http')) {
                user.avatar = `${SERVER_URL}${user.avatar}`;
            }

            state.currentUser = user;
            state.token = user.token;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        noError: (state) => {
            state.error = null
        },
        signOut: (state) => {
            state.currentUser = null;
            state.isLoading = false;
            state.token = null;
            state.error = null;
        },
        updateAvatar: (state, action) => {
            if (state.currentUser) {
                let avatar = action.payload;
                if (avatar && !avatar.startsWith('http')) {
                    avatar = `${SERVER_URL}${avatar}`;
                }
                state.currentUser.avatar = avatar;
            }
        },
        updateUser: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload };
        }
        ,
    }
});

export const { signInStart, signInSuccess, signInFailure, noError, signOut, updateAvatar ,updateUser} = userSlice.actions;
export default userSlice.reducer;