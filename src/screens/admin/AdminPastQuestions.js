import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import Input from '../../components/Input';
import HeaderLite from '../../components/HeaderLite';
import Userlist from '../../components/Userlist';
import { users } from '../../constants/mockData';
import Button from '../../components/Button';
import ImageView from '../../components/ImageView';
import ActionCard from '../../components/ActionCard';
import CourseCard from '../../components/CourseCard';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

function AdminPastQuestions({navigation}) {
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [pastQuestions, setPastquestions] = useState([]);

  const db = getFirestore();

  const pastQuestionsRef = collection(db, 'pastQuestions');

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
      // console.log(allData)
    }
  
    getData();
  })

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Past Questions'} onPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        {pastQuestions.map((item, index) => (
          <CourseCard
            key={item.id}
            title={item.courseCode}
            value={item.courseTitle}
            year={item.year}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.fabContainer} onPress={() => navigation.navigate('AdminAddPastQuestion')}>
        <Ionicons name={'add-circle'} size={wp(65)} color={colors.primary} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // marginHorizontal: wp(20),
  },
  content: {
    // alignItems: 'center',
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  name: {
    fontSize: hp(20),
    fontWeight: '700',
    color: colors.primary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: hp(50),
    right: wp(20)
  },
})

export default AdminPastQuestions;