import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        message: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    },
    reducers:{
      registerRequest(state){
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      registerSuccess(state,action){
        state.loading = false;
        state.message = action.payload.message;
      },
      registerFailed(state,action){
        state.loading = false;
        state.error = action.payload;
      },
      otpVerificationRequest(state){
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      otpVerificationSuccess(state,action){
        state.loading = false;
        state.message = action.payload.message;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      },
      otpVerificationFailed(state,action){
        state.loading = false;
        state.error = action.payload;
      },
      loginRequest(state){
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      loginSuccess(state,action){
        state.loading = false;
        state.message = action.payload.message;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      },
      loginFailed(state,action){
        state.loading = false;
        state.error = action.payload;
      },
      logOutRequest(state){
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      logOutSuccess(state,action){
        state.loading = false;
        state.message = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      },
      logOutFailed(state,action){
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      },
      getUserRequest(state){
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      getUserSuccess(state,action){
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      },
      getUserFailed(state){
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      },
      forgotPasswordRequest(state){
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      forgotPasswordSuccess(state,action){
        state.loading = false;
        state.message = action.payload;
      },
      forgotPasswordFailed(state,action){
        state.loading = false;
        state.error = action.payload;
      },
      resetPasswordRequest(state){
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      resetPasswordSuccess(state,action){
        state.loading = false;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      },
      resetPasswordFailed(state,action){
        state.loading = false;
        state.error = action.payload;
      },
     updatePasswordRequest(state){ 
        state.loading = true;
        state.error = null;
        state.message=null;
      },
      updatePasswordSuccess(state,action){
        state.loading = false;
        state.message = action.payload;
      },
      updatePasswordFailed(state,action){
        state.loading = false;
        state.error = action.payload;
      },
      resetAuthSlice(state){
      state.error = null;
      state.message = null;
      state.loading = false;
      state.user=state.user;
      state.isAuthenticated=state.isAuthenticated;
      }
      
    }
})


export const resetAuthSlice=()=>(dispatch)=>{
  dispatch(authSlice.actions.resetAuthSlice());
}

export const register=(data)=>
async(dispatch)=>{
  dispatch(authSlice.actions.registerRequest());
  await axios.post("http://localhost:4000/api/v1/auth/register",data,{
    withCredentials:true,
    headers:{
      "Content-Type":"application/json"
    }
  }).then(res=>{
    dispatch(authSlice.actions.registerSuccess(res.data))
  }).catch(error=>{
    dispatch(authSlice.actions.registerFailed(error.response.data.message))
  })
}

export const otpVerification =(email,otp)=>
  async(dispatch)=>{
    dispatch(authSlice.actions.otpVerificationRequest());
    await axios.post("http://localhost:4000/api/v1/auth/verify-otp",{email,otp},{
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    }).then(res=>{
      dispatch(authSlice.actions.otpVerificationSuccess(res.data))
    }).catch(error=>{
      dispatch(authSlice.actions.otpVerificationFailed(error.response.data.message))
    })

}

export const login =(data)=>async(dispatch)=>{
    dispatch(authSlice.actions.loginRequest());
    await axios.
    post("http://localhost:4000/api/v1/auth/login",
    data,
    {
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    }).then(res=>{
      dispatch(authSlice.actions.loginSuccess(res.data))
    }).catch(error=>{
      dispatch(authSlice.actions.loginFailed(error.response.data.message))
    })

}

export const logOut =()=>
  async(dispatch)=>{
    dispatch(authSlice.actions.logOutRequest());
    await axios.
    get("http://localhost:4000/api/v1/auth/logOut",
    {
      withCredentials:true,
    }).then(res=>{
      dispatch(authSlice.actions.logOutSuccess(res.data.message))
      dispatch(authSlice.actions.resetAuthSlice())
    }).catch(error=>{
      dispatch(authSlice.actions.logOutFailed(error.response.data.message))
    })

}

export const getUser =()=>
  async(dispatch)=>{
    dispatch(authSlice.actions.getUserRequest());
    await axios.
    get("http://localhost:4000/api/v1/auth/me",
    {
      withCredentials:true,
    }).then(res=>{
      dispatch(authSlice.actions.getUserSuccess(res.data.user))
    }).catch(error=>{
      dispatch(authSlice.actions.getUserFailed(error.response.data.message))
    })
}

export const forgotPassword =(data)=>async(dispatch)=>{
  dispatch(authSlice.actions.forgotPasswordRequest());
  await axios.post("http://localhost:4000/api/v1/auth/password/forgot",
  data,
  {
    withCredentials:true,
    headers:{
      "Content-Type":"application/json"
    }
  }).then(res=>{
    dispatch(authSlice.actions.forgotPasswordSuccess(res.data.message))
  }).catch(error=>{
    dispatch(authSlice.actions.forgotPasswordFailed(error.response.data.message))
  })

}

export const resetPassword =(data,token)=>async(dispatch)=>{
  dispatch(authSlice.actions.resetPasswordRequest());
  await axios.
  put(`http://localhost:4000/api/v1/auth/password/reset/${token}`,
  data,
  {
    withCredentials:true,
    headers:{
      "Content-Type":"application/json"
    }
  }).then(res=>{
    dispatch(authSlice.actions.resetPasswordSuccess(res.data))
  }).catch(error=>{
    dispatch(authSlice.actions.resetPasswordFailed(error.response.data.message))
  })
}

export const updatePassword =(data)=>async(dispatch)=>{
  dispatch(authSlice.actions.updatePasswordRequest());
  await axios.
  put("http://localhost:4000/api/v1/auth/password/update",
  data,
  {
    withCredentials:true,
    headers:{
      "Content-Type":"application/json"
    }
  }).then(res=>{
    dispatch(authSlice.actions.updatePasswordSuccess(res.data.message))
  }).catch(error=>{
    dispatch(authSlice.actions.updatePasswordFailed(error.response.data.message))
  })
}

export default authSlice.reducer;