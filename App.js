import {StyleSheet} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GraphScreen from './screens/GraphScreen';
import ListScreen from './screens/TransactionScreen';
import ProfileScreen from './screens/ProfileScreen';
import {NavigationContainer} from "@react-navigation/native";
import Navbar from "./components/Navbar";
import CrudModal from "./screens/CrudModal";
import React, {useState} from "react";

const MainStack = createNativeStackNavigator();
export default function App() {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);

    return (
        <NavigationContainer>
            <MainStack.Navigator
                id='mainStack'
                initialRouteName='Graph'
                screenOptions={{headerShown: false}}
            >
                <MainStack.Screen
                    name='Graph'
                    component={GraphScreen}
                    options={{animation: 'none'}}
                />
                <MainStack.Screen
                    name='List'
                    component={ListScreen}
                    options={{animation: 'none'}}
                />
                <MainStack.Screen
                    name='Profile'
                    component={ProfileScreen}
                />
            </MainStack.Navigator>
            <Navbar toggleModal={toggleModal}/>
            <CrudModal visible={showModal} setVisible={setShowModal}/>
        </NavigationContainer>
    )
}

