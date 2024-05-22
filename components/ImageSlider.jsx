import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { sliderImages } from '../constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ImageSlider() {
  return (
    <Swiper
      loop
      autoplay
      autoplayTimeout={4}
      style={styles.wrapper}
      showsPagination={false}
    >
      {sliderImages.map((item, index) => (
        <View key={index} style={styles.slide}>
          <Image source={item} style={styles.image} />
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: hp(35),
    borderWidth: 1
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: wp(100) - 70,
    height: hp(35),
    borderRadius: 30,
    resizeMode: 'contain',
  },
});
