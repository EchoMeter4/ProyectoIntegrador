import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GraphScreen from './screens/GraphScreen';
import ListScreen from './screens/TransactionScreen';
import ProfileScreen from './screens/ProfileScreen';
import {NavigationContainer} from "@react-navigation/native";
import Navbar from "./components/Navbar";
import CrudModal from "./screens/CrudModal";
import React, {useState} from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from './screens/RegisterScreen';

const MainStack = createNativeStackNavigator();

export default function App() {
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


            { !['Login', 'Register', 'Reset'].includes(currentRoute) && (
                <>
                    <Navbar toggleModal={toggleModal}/>
                    <CrudModal visible={showModal} setVisible={setShowModal}/>
                </>
            )}

        </NavigationContainer>
    )
}