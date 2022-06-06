import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import AppLoading from 'expo-app-loading';
import { colors } from './src/constants/colors';
import AppContextProvider from './src/context/AppContext';
import { initializeApp } from "firebase/app";
import FPEPastQuestion from './src/navigation';
import { hp } from './src/util/dimension';
import {getFromStorage} from './src/util/storageUtil'

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyAfBbgaSF8h78ZxxeIaLJjil9pGOEzj1Rs",
    authDomain: "pastquestionfinder.firebaseapp.com",
    projectId: "pastquestionfinder",
    storageBucket: "pastquestionfinder.appspot.com",
    messagingSenderId: "663067249953",
    appId: "1:663067249953:web:5bba86c24e106d30490260"
  };

  initializeApp(firebaseConfig);

  return (
    <AppContextProvider>
      <ToastProvider
        placement="top"
        duration={2000}
        // successColor="green"
        // dangerColor="red"
        // warningColor="orange"
        // normalColor="#6610F2"
        normalColor={colors.primary}
        offsetTop={hp(40)}
        // renderType={{
        //   normal: (toast) => (
        //     <Toast text={toast.message} bgColor="#6610F2" />
        //   ),
        //   danger: (toast) => (
        //     <Toast text={toast.message} bgColor="#F83C33" />
        //   ),
        //   success: (toast) => (
        //     <Toast text={toast.message} bgColor="#45D988" />
        //   ),
        // }}
        swipeEnabled={true}>
        <FPEPastQuestion />
      </ToastProvider>
    </AppContextProvider>
  );
}
