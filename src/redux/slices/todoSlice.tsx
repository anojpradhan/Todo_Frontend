import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { BASE_URL } from "../../constants";
import axios from "axios";
import { axiosHttp } from "../../http";

interface TodoItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  user_id?: number;
}

interface TodoState {
  isLoading: boolean;
  todos: TodoItem[];
  error: string | null;
}

const initialState: TodoState = {
  isLoading: false,
  todos: [],
  error: null
}

export const fetchTodosThunk = createAsyncThunk(
  "todos/get",
  async () => {
  try {
    const response = await axiosHttp('/todos');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const addTodosThunk = createAsyncThunk(
  "todos/add",
  async (body: any) => {
  try {
    const response = await axiosHttp.post('/todos', body);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchTodosThunk.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchTodosThunk.fulfilled, (state, action) => {
      console.log(action.payload)
      state.todos = action.payload;
      state.isLoading = false;
    })
    .addCase(fetchTodosThunk.rejected, (state, action: any) => {
      state.todos = [];
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(addTodosThunk.fulfilled, (state, action) => {
      state.todos = [...state.todos, action.payload];
      state.isLoading = false;
    })
  }
})

// export const { setTodos, filterTodos, fetchTodosError } = todoSlice.actions; // Called through dispatch

export default todoSlice.reducer;


// Redux
// 1. install @reduxjs/toolkit and react-redux
// 2. configure store
// 3. create slice with initialState and reducers
// 4. wrap App with redux provider
// 5. dispatch redux actions where required


// STORE
// SLICE
// REDUCER
// ACTION
// DISPATCH
// SELECTOR