import React, { useContext, useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import Header from '../../components/Header';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../../context/AppContext';
import { generateColor } from '../../util/randomColor';
// import ImageView from '../../components/ImageView';
import Input from '../../components/Input';
import ClassCard from '../../components/ClassCard';
import { deleteFromStorage } from '../../util/storageUtil';
import { logout } from '../../context/action';
import CourseCard from '../../components/CourseCard';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import ImageView from "react-native-image-viewing";
import Button from '../../components/Button';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useToast } from 'react-native-toast-notifications';

function StudentHome({ navigation }) {
  const { state, dispatch } = useContext(AppContext);
  const [pastQuestions, setPastquestions] = useState([]);
  const [filteredPastQuestions, setFilteredPastquestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setimage] = useState([]);
  const [visible, setIsVisible] = useState(false);

  const db = getFirestore();

  const toast = useToast();

  const pastQuestionsRef = collection(db, 'pastQuestions');

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync()
    .then((res) => {
      console.log(res.granted);
    })
  },[])

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
      setPastquestions(allData)
      setFilteredPastquestions(allData)
      console.log(allData)
    }

    getData();
  })

  const handleQuestionNav = (data) => {
    setimage([{uri: data.image}])
    setIsVisible(true)
    // navigation.navigate('QuestionView', data)
  }

  const handleDownload = async () => {
    setLoading(true);
    try {
      const downloadInstance = FileSystem.createDownloadResumable(
        image[0].uri,
        FileSystem.documentDirectory + "image.jpg"
      );
    
      const result = await downloadInstance.downloadAsync();

      const asset = await MediaLibrary.createAssetAsync(result.uri);

      const albumCreate = await MediaLibrary.createAlbumAsync("FPE Past Questions", asset, false)
      setLoading(false);
      setIsVisible(false);
      toast.show('Download successfull');
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  const handleLogOut = () => {
    deleteFromStorage('userData')
      .then((response) => {
        dispatch(logout())
        // dispatch(resetState())
      })
  }

  const handleFilter = (text) => {
    if(text.length === 0) {
      setFilteredPastquestions(pastQuestions);
    }

    let newList = pastQuestions.filter(data => {
      return data.courseCode.toLowerCase().includes(text.toLowerCase());
    });

    if(!newList) {
      setFilteredPastquestions(pastQuestions);
    } else {
      console.log(newList);
      setFilteredPastquestions(newList);
    }
  }

  const footerComponets = () => (
    <View style={{width: wp(375), alignItems: 'center', marginBottom: hp(40)}}>
      <Button
        outlined
        title={'Download'}
        loading={loading}
        onPress={() => handleDownload()}
        textColor={'#ffffff'} />
    </View>
  )

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            {/* <Text style={styles.description}>Hello,</Text> */}
            <Text style={styles.name}>Welcome today</Text>
          </View>
          {/* <TouchableOpacity>
            <View  style={styles.iconContainer}>
              <Ionicons name={'log-out-outline'} size={wp(20)} color={colors.secondaryDarker} />
            </View>
          </TouchableOpacity> */}
          {/* <ImageView
            image={{uri: 'https://randomuser.me/api/portraits/women/8.jpg'}}
            width={wp(55)}
            height={wp(55)}
            /> */}
          <TouchableOpacity onPress={handleLogOut}>
            <View style={styles.iconContainer}>
              <Ionicons name={'log-out-outline'} size={wp(20)} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Input
            iconName={'search'}
            iconColor={colors.primary + '70'}
            onChangeText={(text) => handleFilter(text)}
            onFocus={() => console.log('OnFocus')}
            placeholder={'Search'} />
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Past questions</Text>
        </View>
        <View style={styles.cardContainer}>
          {filteredPastQuestions.map((item, index) => (
            <CourseCard
              key={item.id}
              image={{uri: item.image}}
              title={item.courseCode}
              value={item.courseTitle}
              year={item.year}
              onPress={() => handleQuestionNav(item)}
            />
          ))}
          {/* <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard /> */}
          {/* <ClassCard
            color={'#874d24'}
            title={'OND I'}
            value={22}
            onPress={() => navigation.navigate('Questions')}
          />
          <ClassCard
            color={'#1e9790'}
            value={8}
            title={'OND II'}
          />
          <ClassCard 
            color={'#13544c'}
            value={12}
            marginTop={hp(20)}
            title={'HND I'}
          />
          <ClassCard
            color={'#7a5e9a'}
            value={17}
            marginTop={hp(20)}
            title={'HND II'}
          /> */}
        </View>
      </ScrollView>
      <ImageView
        images={image}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        FooterComponent={footerComponets}
      />
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
  description: {
    fontSize: wp(24),
    textTransform: 'capitalize',
    fontWeight: '300',
    color: '#000000ee'
  },
  name: {
    fontSize: wp(30),
    fontWeight: '500',
    color: '#000000'
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(35),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.primary + '20',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp(20),
    // paddingVertical: hp(22),
    borderRadius: wp(10),
    // backgroundColor: colors.primary,
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
  cardContainer: {
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    marginTop: hp(20)
  },
})

export default StudentHome;