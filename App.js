import {StyleSheet} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GraphScreen from './screens/GraphScreen';
import LoginScreen from './screens/LoginScreen'; 
import ListScreen from './screens/TransactionScreen';
import RecoverPasswordScreen from './screens/RecoverPasswordScreen'; 
import {NavigationContainer} from "@react-navigation/native";
import Navbar from "./components/Navbar";
import CrudModal from "./screens/CrudModal";
import React, {useState} from "react";

const MainStack = createNativeStackNavigator();

export default function App() {
    const [showModal, setShowModal] = useState(false);
    
    
    const [currentRoute, setCurrentRoute] = useState('Login'); 

    const toggleModal = () => setShowModal(!showModal);

    
    const screensWithoutNavbar = ['Login', 'Recovery'];

    return (
        <NavigationContainer
            onStateChange={(state) => {
                const routeName = state?.routes[state.index]?.name;
                setCurrentRoute(routeName);
            }}
        >
            <MainStack.Navigator
                id='mainStack'
                initialRouteName='Login'
                screenOptions={{headerShown: false}}
            >
                <MainStack.Screen
                    name='Login'
                    component={LoginScreen}
                />
                
                <MainStack.Screen
                    name='Recovery'
                    component={RecoverPasswordScreen}
                />

                <MainStack.Screen
                    name='Graph'
                    component={GraphScreen}
                />
                <MainStack.Screen
                    name='List'
                    component={ListScreen}
                />
            </MainStack.Navigator>

            
            {!screensWithoutNavbar.includes(currentRoute) && (
                <>
                    <Navbar toggleModal={toggleModal}/>
                    <CrudModal visible={showModal} setVisible={setShowModal}/>
                </>
            )}
            
        </NavigationContainer>
    )
}