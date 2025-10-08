import { useEffect } from "react";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { useAuthStore } from "@/store/zustandStores";

export const IndexRoutes = () => {
    const { isAuthenticated, checkAuth, fetchUserProfile } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [isAuthenticated, fetchUserProfile]);
    
    return isAuthenticated ? <ProtectedRoutes /> : <PublicRoutes />;
}
