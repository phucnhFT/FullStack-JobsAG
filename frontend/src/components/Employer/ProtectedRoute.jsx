import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//hàm setup bảo vệ tuyến Route => ràng buộc chặt chẽ các role 

export default function ProtectedRoute({children }) {
    const {user} = useSelector(store=>store.user)

    const navigate = useNavigate()

    useEffect(() => {
         if (user === null || user.role !== "Nhà Tuyển Dụng") {
           navigate("/");
         }
    }, [])

    return (
        <>
        {children}
        </>
    )
} 