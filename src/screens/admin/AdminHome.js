import React, {useContext, useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import Header from '../../components/Header';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../../context/AppContext';
import ActionCards from './components/ActionCards';
import { generateColor } from '../../util/randomColor';
import ImageView from '../../components/ImageView';
import { logout } from '../../context/action';
import { deleteFromStorage } from '../../util/storageUtil';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

function AdminHome ({navigation}) {
  const {state, dispatch} = useContext(AppContext);
  const [pastQuestionsNum, setPastquestionsNum] = useState(0);
  const [adminNumber, setAdminNumber] = useState(0);

  const db = getFirestore();

  const pastQuestionsRef = collection(db, 'pastQuestions');
  const adminsRef = query(collection(db, "users"), where("role", "==", 'admin'));

  useEffect(() => {
    const getData = async () => {
      let response = await getDocs(pastQuestionsRef);
      let allData = response.docs.map((item) => {
        return item.data();
      })
      // blocks.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.data());
      // });
      setPastquestionsNum(allData.length)
    }
  
    getData();
  })

  useEffect(() => {
    const getAdmins = async () => {
      let admins = await getDocs(adminsRef);
      let allAdmins = admins.docs.map((item) => {
        return item.data();
      })
      setAdminNumber(allAdmins.length);
    }
  
    getAdmins();
  });

  const handleLogOut = () => {
    deleteFromStorage('userData')
      .then((response) => {
        dispatch(logout())
        // dispatch(resetState())
      })
  }

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <ImageView
            image={{uri: 'https://randomuser.me/api/portraits/women/8.jpg'}}
            width={wp(55)}
            height={wp(55)}
            /> */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.name}>{state.user.firstName} {state.user.lastName}</Text>
            <Text style={styles.description}>{state.user.role}</Text>
          </View>
          <TouchableOpacity onPress={handleLogOut}>
            <View  style={styles.iconContainer}>
              <Ionicons name={'log-out-outline'} size={wp(20)} color={colors.secondaryDarker} />
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Total number of past questions
          </Text>
          <Text style={styles.infoValue}>
            200
          </Text>
        </View> */}
        {/* <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
        </View> */}
        <View style={styles.content}>
          {/* <ActionCards
            marginTop={hp(25)}
            onPress={() => navigation.navigate('AdminList')}
            title={'Admins'}
            iconName={'people-outline'}
            value={40}
          /> */}
          <ActionCards
            color={'#000000'}
            marginTop={hp(25)}
            width={wp(330)}
            onPress={() => navigation.navigate('AdminList')}
            title={'Admins'}
            description={'View admin list and add new admins'}
            iconName={'book-outline'}
            value={adminNumber}
          />
          <ActionCards
            color={'#000000'}
            marginTop={hp(25)}
            width={wp(330)}
            onPress={() => navigation.navigate('AdminPastQuestions')}
            title={'Past Questions'}
            description={'View past questions and add new ones'}
            iconName={'book-outline'}
            value={pastQuestionsNum}
          />
          {/* <ActionCards
            color={generateColor()}
            marginTop={hp(25)}
            title={'Payments'}
            value={40}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: wp(20),
  },
  header: {
    marginTop: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: wp(10)
  },
  name: {
    fontSize: wp(20),
    fontWeight: '500',
    color: colors.primary
  },
  description: {
    fontSize: wp(16),
    textTransform: 'capitalize',
    fontWeight: '300',
    color: colors.secondaryDarker
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(35),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.secondaryLighter + '30',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp(20),
    paddingVertical: hp(22),
    borderRadius: wp(10),
    backgroundColor: colors.primary,
  },
  infoTitle: {
    fontSize: wp(16),
    fontWeight: '300',
    color: '#ffffff90',
  },
  infoValue: {
    fontSize: wp(35),
    fontWeight: '700',
    marginTop: hp(10),
    color: '#ffffff'
  },
  sectionTitleContainer: {
    marginTop: hp(25),
  },
  sectionTitle: {
    fontSize: wp(22),
    fontWeight: '700',
    color: colors.primary
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: hp(20)
  }
})

export default AdminHome;