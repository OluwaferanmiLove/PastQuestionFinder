import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import HeaderLite from '../../components/HeaderLite';
import ImageView from '../../components/ImageView';
import ActionCard from '../../components/ActionCard';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from 'react-native-modal';
import AdminCamera from './AdminCamera';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useToast } from 'react-native-toast-notifications';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { makeid } from '../../util/util';

function AdminAddPastQuestion({ navigation, route }) {
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(null);
  const [courseCode, setCourseCode] = useState(null);
  const [courseTitle, setCourseTitle] = useState(null);
  const [year, setYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [level, setLevel] = useState(null);
  const [image, setImage] = useState(null);
  const [imageKey, setImageKey] = useState([null]);

  const { state } = useContext(AppContext);

  const toast = useToast();

  const db = getFirestore();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      uploadImage(result.uri)
    }
  };


  const uploadImage = async (uri) => {
    setLoading(true);
    let imageState = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    const imageUri = await fetch(uri);
    const imageBlob = await imageUri.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `images/${filename}`);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, imageBlob)
      .then((snapshot) => {
        snapshot.metadata.fullPath
        console.log('Uploaded a blob or file!');
        getDownloadURL(snapshot.ref)
          .then((downloadURL) => {
            console.log('File available at', downloadURL);
            // imageState[index] = downloadURL;
            // console.log(imageState);
            setImage(downloadURL);
            setLoading(false);
            toast.show('Image uploaded successfully, continue with other data')
          });
      });
  };

  const handleAddPastQuestion = async () => {
    setLoading(true);
    try {
      let data = {
        image,
        courseCode,
        courseTitle,
        year,
        semester,
        level
      }

      const pastQuestionRef = doc(db, 'pastQuestions', makeid(32));

      // set user data in firestore
      let response = await setDoc(pastQuestionRef, data);
      toast.show('Past question added successfull');
      setLoading(false)
      navigation.goBack();
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }

  // const handleAddNewPics = () => {
  //   let imageState = image;
  //   let imageNum = imageState.length;
  //   imageState[imageNum + 1] = null;
  //   console.log(imageState);
  //   setImage(imageState);
  //   setImageKey(Math.random())
  // }

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Add Past questions'} onPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <ScrollView style={{ width: '100%' }} horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }} key={imageKey}>
            {/* {image.map((item, index) => (
              <ImageView
                key={item}
                style={{flex: 1, marginLeft: index !== 0 ? wp(5) : 0}}
                borderRadius={wp(8)}
                width={wp(335)}
                allowChange
                onPressUpload={() => pickImage(index)}
                image={{ uri: item }}
                height={hp(450)}
              />
            ))} */}
            <ImageView
              key={image}
              // style={{ flex: 1, marginLeft: index !== 0 ? wp(5) : 0 }}
              borderRadius={wp(8)}
              width={wp(335)}
              allowChange
              onPressUpload={() => pickImage()}
              image={{ uri: image }}
              height={hp(450)}
            />
          </View>
        </ScrollView>
        {/* <TouchableOpacity
          onPress={handleAddNewPics}
          style={{marginTop: hp(10), alignItems: 'flex-end'}}>
          <Text style={{fontSize: wp(16)}}>+ Add picture</Text>
        </TouchableOpacity> */}
        <View style={{ marginTop: hp(15), flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Input
              label={'Course Code'}
              onChangeText={(value) => setCourseCode(value)}
              value={courseCode}
              placeholder={'Enter course code'} />
            <Input
              label={'Course Title'}
              placeholder={'Enter course title'}
              onChangeText={(value) => setCourseTitle(value)}
              value={courseTitle}
              marginTop={hp(20)} />
            <Input
              label={'Year'}
              placeholder={'Enter year'}
              onChangeText={(value) => setYear(value)}
              value={year}
              marginTop={hp(20)} />
            <Input
              label={'Semester'}
              placeholder={'Enter semester'}
              onChangeText={(value) => setSemester(value)}
              value={semester}
              marginTop={hp(20)} />
            <Input
              label={'level'}
              placeholder={'Enter class'}
              onChangeText={(value) => setLevel(value)}
              value={level}
              marginTop={hp(20)} />
          </View>
        </View>
        {/* <View style={styles.roleContainer}>
          <Text style={styles.description}>{detail.language}</Text>
        </View> */}
        <View style={{ marginTop: hp(25) }}>
          <Button
            onPress={handleAddPastQuestion}
            title={'Add past question'}
            dark />
        </View>
      </ScrollView>
      <Modal
        isVisible={showCamera}
        coverScreen={false}
        hasBackdrop={true}
        backdropOpacity={0.5}
        swipeDirection={'down'}
        onSwipeComplete={() => setShowCamera(false)}
        onBackdropPress={() => setShowCamera(false)}
        animationIn={'fadeIn'}
        style={{
          // width: '100%',
          // bottom: 0,
          margin: 0,
          height: '100%',
          justifyContent: 'flex-end',
          // backgroundColor: colors.mainBg,

        }}>
        <AdminCamera
          onPressBack={() => setShowCamera(false)}
        />
      </Modal>
      {loading && (
        <View style={styles.loading} >
          <ActivityIndicator size={'small'} color={colors.white} />
        </View>
      )}
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
  title: {
    fontSize: hp(25),
    fontWeight: '700',
    color: colors.primary,
  },
  roleContainer: {
    backgroundColor: colors.primary + 20,
    marginTop: hp(8),
    paddingVertical: wp(4),
    paddingHorizontal: wp(25),
    borderRadius: wp(9999)
  },
  description: {
    // fontFamily: 'ApparelDisplayBold',
    marginTop: hp(8),
    fontSize: hp(16),
    color: colors.primary,
  },
  price: {
    fontSize: hp(25),
    fontWeight: '700',
    color: colors.primary,
  },
  actionContainer: {
    // position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: hp(10),
    marginBottom: hp(25),
  },
  loading: {
    position: 'absolute',
    width: wp(375),
    height: hp(812),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000060'
  },
})

export default AdminAddPastQuestion;