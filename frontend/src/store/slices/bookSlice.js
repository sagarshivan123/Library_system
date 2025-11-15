import React from 'react'
import api from '../api/api.js'
import { createSlice } from '@reduxjs/toolkit'
import { toggleAddBookPopup } from './popupSlice'
import {toast} from "react-toastify"


const bookSlice =createSlice({ 
name: 'books',
initialState: {
loading: false,
error: null,
message: null,
books: [],
},
reducers:{
  fetchBooksRequest(state){
    state.loading = true
    state.error = null
    state.message = null
  },
  fetchBooksSuccess(state, action){
    state.loading = false
    state.books = action.payload
  },
  fetchBooksFailed(state, action){
    state.loading = false
    state.error = action.payload
  },
  addBookRequest(state){
    state.loading = true
    state.error = null
    state.message = null
   
  },
  addBookSuccess(state,action){
    state.loading = false
    state.message = action.payload
  },
  addBookFailed(state){
    state.loading = false
    state.error = action.payload
  },
  deleteBookRequest(state){
   state.loading = true
    state.error = null
    state.message = null
  },
  deleteBookSuccess(state,action){
    state.loading = false
    state.message = action.payload.message
    state.books=state.books.filter(book=>book._id!==action.payload.bookId)
  },
  deleteBookFailed(state,action){
    state.loading = false
    state.error = action.payload
  },
  resetBookSlice(state){
   state.error = null
    state.message = null
    state.loading = false
  }
}
})
export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  await api
    .get("/book/all")
    .then((res) => {
      dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
    })
    .catch((err) => {
      dispatch(bookSlice.actions.fetchBooksFailed(err.response.data.message));
    });
};

export const deleteBook=(bookId)=>async(dispatch)=>{
  try {
    dispatch(bookSlice.actions.deleteBookRequest())
      const {data}=await api.delete(`/book/delete/${bookId}`)
      dispatch(bookSlice.actions.deleteBookSuccess({message:data.message,bookId}))
  } catch (error) {
    dispatch(bookSlice.actions.deleteBookFailed(error.response.data.message)) 
  }
}

export const addBook=(data)=>async(dispatch)=>{
  dispatch(bookSlice.actions.addBookRequest())
  await api.post('/book/admin/add',data,{
   
    headers:{
      "Content-Type":"application/json"
    }
  }).then(res=>{
    bookSlice.actions.addBookSuccess(res.data.message)
    toast.success(res.data.message);
    dispatch(toggleAddBookPopup())
    dispatch(fetchAllBooks());
  }).catch(err=>{
      dispatch(bookSlice.actions.addBookFailed(err.response.data.message))
    })
  
}

export const resetBookSlice=()=>(dispatch)=>{
  dispatch(bookSlice.actions.resetBookSlice())
}
export default bookSlice.reducer;