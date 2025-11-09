import React,{useState} from "react";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {GiHamburgerMenu} from "react-icons/gi";
import Sidebar from "../layout/Sidebar.jsx";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
// import Header from "../layout/Header.jsx";


const Home = () => {
  const [isSideBarOpen ,setIsSideBarOpen] = useState(false);
  const [selectedComponent ,setSelectedComponent] = useState("");
  
  const {user,isAuthenticated} = useSelector((state) => state.auth);

  if(!isAuthenticated){
    return <Navigate to={"/login"}/>
  }
  return (<>
  
  <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
    
    <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">

     <GiHamburgerMenu className="text-2xl"
     onClick={()=>setIsSideBarOpen(!isSideBarOpen)}/>
    </div>
    
    <Sidebar isSideBarOpen={isSideBarOpen} 
    setIsSideBarOpen={setIsSideBarOpen}
    setSelectedComponent={setSelectedComponent} /> 

   {(()=>{
      console.log("Selected component:", selectedComponent);
    switch(selectedComponent){
      case "Dashboard":
        return user?.role==="user"?(
          <UserDashboard/>
        ):(<AdminDashboard/>);
        break;
      case "Books":
        return <BookManagement/>;
      break;
        case "Catalog":
          if(user?.role==="Admin"){
            
            return <Catalog/>;
          }
          break;
          case "Users":
            if(user?.role==="Admin"){
              return <Users/>;
            }
            break;
          case "My Borrowed Books":
            return <MyBorrowedBooks/>;
            break;
      default:
        return user?.role==="user"?(
          <UserDashboard/>
        ):(<AdminDashboard/>);
        break;
    }
    
   })
   ()}
   
  </div>
  
  </>
  )
}
export default Home;