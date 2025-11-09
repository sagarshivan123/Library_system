 export const validatePassword = (password,confirmPassword=null) => {
 if(!password)return "Password is required";

  if(password.length<8 || password.length>16){
    return "Password must be b/w 8 to 16 characters long";
  }

  if(confirmPassword!==null && password !==confirmPassword){
    return "Password and confirm password do not match";
  }
return null;
}
