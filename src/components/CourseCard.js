import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity , Image} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../constants/colors';
import { hp, wp } from '../util/dimension';

function CourseCard({
  color = colors.primary,
  backgroundColor,
  courseCode,
  image,
  year,
  marginTop,
  title,
  value,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{marginTop}}>
      <View style={[styles.actionCard, {backgroundColor: color + '10'}]}>
        {/* <View style={styles.iconContainer}>
          <Text style={[styles.title, {color: color + 'aa'}]}>
            {courseCode}
          </Text>
        </View> */}
         <Image
          source={image}
          style={[styles.image]}
        />
        <View style={{flex: 1, marginHorizontal: wp(8)}}>
          <Text style={[styles.title, {color}]}>
            {title}
          </Text>
          <Text style={[styles.value, {color: color + 'aa'}]} numberOfLines={1}>
            {value}
          </Text>
          <Text style={[styles.year, {color: color + 'aa'}]} numberOfLines={1}>
            {year}
          </Text>
        </View>
        {/* <View style={styles.iconContainer}>
          <Text style={[styles.year, {color: color + 'aa'}]} numberOfLines={1}>
            {year}
          </Text>
        </View> */}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // height: wp(60),
    borderRadius: wp(10),
    justifyContent: 'space-between',
    // borderWidth: wp(1),
    backgroundColor: colors.inputBg + '30',
    paddingVertical: hp(25),
    marginVertical: hp(12),
    paddingHorizontal: hp(15),
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(50),
    height: hp(50),
    borderRadius: wp(999),
    backgroundColor: colors.primary + '20',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    width: wp(55),
    height:'120%',
    borderRadius: wp(10),
  },
  numContainer: {
    fontSize: wp(16),
    fontWeight: '300',
  },
  title: {
    fontSize: wp(20),
    fontWeight: '700',
  },
  valueContainer: {
    marginTop: hp(8),
    width: '100%',
    borderRadius: 9999,
    paddingVertical: hp(6),
    paddingHorizontal: hp(12),
    backgroundColor: '#ffffff',
  },
  value: {
    marginTop: hp(8),
    fontSize: wp(14),
    fontWeight: '700',
    color: colors.primaryLighter
  },
  year: {
    fontSize: wp(14),
    fontWeight: '700',
    color: colors.primaryLighter
  },
})

export default CourseCard;