import React, {useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "./LoginScreen";
import GraphScreen from "./GraphScreen";
import ListScreen from "./TransactionScreen";
import ProfileScreen from "./ProfileScreen";
import Navbar from "../components/Navbar";
import CrudModal from "./CrudModal";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const MainStack = createNativeStackNavigator();

export default function NavigationScreen() {
    const [showModal, setShowModal] = useState(false);

    const [currentRoute, setCurrentRoute] = useState('Login');

    const toggleModal = () => setShowModal(!showModal);

    return (
        <NavigationContainer

            onStateChange={(state) => {

                const routeName = state?.routes[state.index]?.name;
                setCurrentRoute(routeName);
            }}
        >
            <MainStack.Navigator
                id="mainStack"
                initialRouteName="Login"
                screenOptions={{headerShown: false}}
            >
                <MainStack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{animation: "none"}}
                />
                <MainStack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{animation: "none"}}
                />
                <MainStack.Screen
                    name="Graph"
                    component={GraphScreen}
                    options={{animation: 'none'}}
                />
                <MainStack.Screen
                    name="List"
                    component={ListScreen}
                    options={{animation: 'none'}}
                />
                <MainStack.Screen
                    name="Profile"
                    component={ProfileScreen}
                />
            </MainStack.Navigator>


            {!['Login', 'Register', 'Reset'].includes(currentRoute) && (
                <>
                    <Navbar toggleModal={toggleModal}/>
                    <CrudModal visible={showModal} setVisible={setShowModal}/>
                </>
            )}

        </NavigationContainer>
    )
}