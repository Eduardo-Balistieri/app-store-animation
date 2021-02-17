import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { AntDesign } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'


const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

interface CloseButtonProps {
  opacity: Animated.SharedValue<number>
  closeBtnTint: Animated.SharedValue<'light' | 'dark'>
  hideAppDetails: () => void
}

const CloseButton = ({ opacity, closeBtnTint, hideAppDetails }: CloseButtonProps) => {
  const closeBtnStyles = useAnimatedStyle(() => {
    return { opacity: opacity.value }
  })

  const darkBlurView = useAnimatedStyle(() => {
    return {
      opacity: closeBtnTint.value === 'dark' ? withTiming(1) : withTiming(0),
      zIndex: closeBtnTint.value === 'dark' ? 5 : 10,
    }
  })
  const lightBlurView = useAnimatedStyle(() => {
    return {
      opacity: closeBtnTint.value === 'light' ? withTiming(1) : withTiming(0),
      zIndex: closeBtnTint.value === 'light' ? 5 : 10
    }
  })

  return (
    <Animated.View style={[styles.closeBtnWrapper, closeBtnStyles]}>
      <Pressable onPress={hideAppDetails}>
        <>
          <AnimatedBlurView intensity={100} tint='dark' style={[styles.closeBtn, darkBlurView]}>
            <AntDesign name='close' size={20} color='#EEE' />
          </AnimatedBlurView>

          <AnimatedBlurView intensity={100} tint='light' style={[styles.closeBtn, lightBlurView]}>
            <AntDesign name='close' size={20} color='#818181' />
          </AnimatedBlurView>
        </>
      </Pressable>
    </Animated.View>
  )
}


const styles = StyleSheet.create({
  closeBtnWrapper: {
    position: 'absolute',
    top: 20,
    right: 18,
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden'
  },

  closeBtn: {
    position: 'absolute',
    top: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default CloseButton