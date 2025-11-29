import {AuthProvider} from "./components/AuthContext";
import NavigationScreen from "./screens/NavigationScreen";

export default function App() {
    return (
        <AuthProvider >
            <NavigationScreen/>
        </AuthProvider>
    )
}