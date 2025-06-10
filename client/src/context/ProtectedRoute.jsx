import { useAuth } from "./AuthContext";
import Login from "../pages/admin/Login";

const ProtectedRoute =({children}) =>{
    
    const {isAuthenticated}=useAuth();

    if(!isAuthenticated){
        return <Login/>
    }
    else{
        return children;
    }
}

export default ProtectedRoute