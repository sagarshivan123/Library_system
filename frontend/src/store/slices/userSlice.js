import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {toast} from 'react-toastify';
import api from '../api/api';

const userSlice=createSlice({
  name:'user',
  initialState:{
    users:[],
    loading:false,
  },
  reducers:{
   fetchAllUsersRequest(state){
    state.loading=true;
   },
   fetchAllUsersSuccess(state,action){
    state.loading=false;
    state.users=action.payload;
   },
    fetchAllUsersFailed(state){
    state.loading=false;
    },
    addNewAdminRequest(state){
    state.loading=true;
    },
    addNewAdminSuccess(state){
    state.loading=false;
    },
    addNewAdminFailed(state){
    state.loading=false;
    },
  }
})

export const fetchAllUsers=()=>async(dispatch)=>{
  // console.log("fetchAllUsersRequest dispatched");
  dispatch(userSlice.actions.fetchAllUsersRequest());
  await api.get("/user/all",
 ).
    then(res=>{
  console.log("data",res.data);

    dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
  }).catch(err=>{
    dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message));
  })
  
}

export const addNewAdmin=(data)=>async(dispatch)=>{
  dispatch(userSlice.actions.addNewAdminRequest());
  await api.post("/user/add/new-admin",data,
    {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }).then(res=>{
      dispatch(userSlice.actions.addNewAdminSuccess());
      toast.success(res.data.message);
      
  }).catch(err=>{
    dispatch(userSlice.actions.addNewAdminFailed());
    toast.error(err.response.data.message);
  })
}

export default userSlice.reducer;



