import { useNavigate } from "react-router-dom";
function PrivateRoute({ children }) {
    const token = localStorage.getItem('jwtToken')
    const navigate = useNavigate()
    if(token !== null){
        return children;
    }
    else{ 
        navigate("*")
    }
}

export default PrivateRoute;