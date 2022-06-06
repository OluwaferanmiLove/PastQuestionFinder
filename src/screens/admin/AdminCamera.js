import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../util/dimension';
import { getStorage, ref, uploadString } from "firebase/storage";

export default function AdminCamera({onPressBack}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    let photo = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true
    });

    let base64Data = `data:image/jpeg;base64,${photo.base64}`
    let photoData = {
      data: base64Data,
      height: photo.height,
      width: photo.width,
    }
    console.log(photoData)
    setImage(photoData)
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000000'} />
      {!image && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          zoom={0}
          autoFocus={true}
          type={type}
          onCameraReady={() => {
            console.log('true')
            setCameraReady(true)
          }}
          ratio={'16:9'}>
          <View style={styles.boundryContainer}>
            <View style={styles.boundryTop} />
            <View style={styles.boundryBottom} />
          </View>
        </Camera>
      )}
      {image && (
        <Image
          source={{uri: image.data}}
          style={{
            flex: 1,
            // width: image.width,
            // height: image.height,
            resizeMode: 'contain',
          }} />
      )}
      <View style={styles.shutter}>
        <TouchableOpacity style={{flex: 0.2}} onPress={onPressBack}>
          <Ionicons name={'arrow-back-circle'} color={colors.white + 50} size={wp(45)} />
        </TouchableOpacity>
        {!image && (
          <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={takePicture}>
            <Ionicons name={'scan-circle-outline'} color={colors.white} size={wp(60)} />
          </TouchableOpacity>
        )}
        {image && (
          <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={takePicture}>
            <Ionicons name={'md-checkmark'} color={colors.white} size={wp(60)} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={{flex: 0.2}}>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    resizeMode: 'contain'
  },
  boundryContainer: {
    flex: 1,
    marginTop: Platform.select({android: hp(25), ios: hp(60)}),
    alignItems: 'center',
  },
  boundryTop: {
    width: '85%',
    height: hp(50),
    borderWidth: wp(3),
    borderBottomWidth: 0,
    borderColor: colors.white + 70,
  },
  boundryBottom: {
    width: '85%',
    marginTop: hp(510),
    height: hp(50),
    borderWidth: wp(3),
    borderTopWidth: 0,
    borderColor: colors.white + 70,
  },
  shutter: {
    flexDirection: 'row',
    paddingHorizontal: wp(20),
    width: '100%',
    height: hp(120),
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // bottom: hp(55),
  },
});
