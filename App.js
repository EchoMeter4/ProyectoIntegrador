import {AuthProvider, useAuth} from "./components/AuthContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
    return (
        <AuthProvider >
            <RootNavigator/>
        </AuthProvider>
    )
}