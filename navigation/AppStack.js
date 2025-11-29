import React, {useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import GraphScreen from "../screens/GraphScreen";
import ListScreen from "../screens/TransactionScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Navbar from "../components/Navbar";
import CrudModal from "../screens/CrudModal";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const MainStack = createNativeStackNavigator();

export default function AppStack({currentRoute}) {
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(!showModal);

    return (
        <>
            <MainStack.Navigator
                id="mainStack"
                initialRouteName="Graph"
                screenOptions={{headerShown: false}}
            >
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


            {!['Profile'].includes(currentRoute) && (
                <>
                    <Navbar toggleModal={toggleModal}/>
                    <CrudModal visible={showModal} setVisible={setShowModal}/>
                </>
            )}
        </>
    )
}