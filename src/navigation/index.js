import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AdminNav from './AdminNav';
import { createStackNavigator } from '@react-navigation/stack';
import StudentNav from './StudentNav';
import { Login, OnBoarding, Profile, Questions, QuestionView, SignUp } from '../screens';
import { colors } from '../constants/colors';
import { AppContext } from '../context/AppContext';

const MainStack = createStackNavigator()


export default function FPEPastQuestion() {
  const {state} = useContext(AppContext);

  return (
    <NavigationContainer>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: colors.mainBg
          }
        }}>
          {!state.loggedin ? (
            <>
              <MainStack.Screen component={OnBoarding} name={'OnBoarding'} />
              <MainStack.Screen component={Login} name={'Login'} />
              {/* <MainStack.Screen component={SignUp} name={'SignUp'} /> */}
            </>
          ) : (
            <>
              {state.user.role === 'admin' && (
              <MainStack.Screen component={AdminNav} name={'AdminNav'} />
              )}
              {state.user.role === 'student' && (
                <MainStack.Screen component={StudentNav} name={'StudentNav'} />
              )}
                <MainStack.Screen component={Profile} name={'Profile'} />
                <MainStack.Screen component={Questions} name={'Questions'} />
                <MainStack.Screen component={QuestionView} name={'QuestionView'} />
            </>
          )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
