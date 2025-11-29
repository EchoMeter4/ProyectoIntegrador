import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";


import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RecoverPasswordScreen from "../screens/RecoverPasswordScreen"; 

const StackNavigator = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <StackNavigator.Navigator
            id="authStack"
            initialRouteName="Login"
            screenOptions={{headerShown: false}}
        >
            <StackNavigator.Screen
                name="Login"
                component={LoginScreen}
                options={{animation: "none"}}
            />
            <StackNavigator.Screen
                name="Register"
                component={RegisterScreen}
                options={{animation: "slide_from_right"}}
            />
            
            <StackNavigator.Screen
                name="Recovery"
                component={RecoverPasswordScreen}
                options={{animation: "slide_from_right"}}
            />
        </StackNavigator.Navigator>
    )
}