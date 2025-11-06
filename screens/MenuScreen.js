import {Text, StyleSheet, View, Button} from "react-native";
import React, {useState} from 'react';
import GraphScreen from "./GraphScreen";
import LoginScreen from "./LoginScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import RegisterScreen from "./RegisterScreen";
import TransactionScreen from "./TransactionScreen";

export default function MenuScreen() {
  const [screen, setScreen] = useState("menu");

    switch (screen) {
        case 'graph':
            return <GraphScreen/>
        case 'login':
            return <LoginScreen/>
        case 'notifications':
            return <NotificationScreen/>
        case 'profile':
            return <ProfileScreen/>
        case 'register':
            return <RegisterScreen/>
        case 'transaction':
            return <TransactionScreen/>
        case 'menu':
        default:
            return (
                <View style={styles.container}>
                    <Text>Menú de Prácticas</Text>
                    <Button
                        title="Login"
                        onPress={() => setScreen('login')}
                    />
                    <Button
                        title="Registro"
                        onPress={() => setScreen('register')}
                    />
                    <Button
                        title="Graph"
                        onPress={() => setScreen('graph')}
                    />
                    <Button
                        title="Transacciones"
                        onPress={() => setScreen('transaction')}
                    />
                    <Button
                        title="Notificaciones"
                        onPress={() => setScreen('notifications')}
                    />
                    <Button
                        title="Perfil"
                        onPress={() => setScreen('profile')}
                    />
                </View>
            )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6F9",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8B3A62",
    marginBottom: 25,
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonSquare: {
    width: 180,
    height: 45,
    marginVertical: 6,
    borderRadius: 0,
    overflow: "hidden",
  },
});
