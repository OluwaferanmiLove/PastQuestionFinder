import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { wp } from '../util/dimension';

function ImageView({
  image,
  onPressUpload,
  style,
  allowChange = false,
  width = wp(55),
  borderRadius = 99999,
  height =  wp(55)}) {
  return (
    <View style={[styles.imageContainer, style,  {width, height, borderRadius}]}>
      {image &&(
        <Image
          source={image}
          style={[styles.image, {width, height}]}
        />
      )}
      {allowChange && (
        <TouchableOpacity
          onPress={onPressUpload}
          style={{position: 'absolute' ,height: '100%', height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: colors.primary, fontSize: wp(16), textAlign: 'center'}}>+ Click to upload Image</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    // width: wp(55),
    // height: wp(55),
    // borderRadius: 99999,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    resizeMode: 'contain',
    // width: wp(55),
    // height: wp(55),
  },
})

export default ImageView;
