
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      const res = await axios.get("http://localhost:3000/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Lisitng Fvrt data : ",res.data)
       return res.data.map((favorite) => favorite._id); 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching favorites"
      );
    }
  }
);


export const addFavoriteAsync = createAsyncThunk(
  "favorites/add",
  async ({listingId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
   console.log("Listing id : ",listingId)
   console.log("Token in redux store",token)
      const res = await axios.post(`http://localhost:3000/api/favorites/${listingId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return listingId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error adding favorite");
    }
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  "favorites/remove",
  async ({listingId}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;
      console.log("Listing id : ",listingId)
      console.log(" Token in redux Store",token)
      const res = await axios.delete(`http://localhost:3000/api/favorites/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return listingId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error removing favorite");
    }
  }
);


const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [], 
    loading: false,
    error: null,
  },
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((id) => id !== action.payload);
      })
      .addCase(removeFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
