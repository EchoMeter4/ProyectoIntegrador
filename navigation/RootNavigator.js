import {useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import {useAuth} from "../components/AuthContext";

export default function RootNavigator() {
    const [currentRoute, setCurrentRoute] = useState('Login');
    const {user} = useAuth();

    return (
        <NavigationContainer

            onStateChange={(state) => {

                const routeName = state?.routes[state.index]?.name;
                setCurrentRoute(routeName);
            }}
        >
            {user ? <AppStack currentRoute={currentRoute}/> : <AuthStack/>}
        </NavigationContainer>
    )
}