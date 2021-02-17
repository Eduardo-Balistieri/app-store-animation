import React from 'react'
import { View, Image, StyleSheet, Text, Dimensions, Platform, Pressable } from "react-native"

import Animated, { measure, runOnUI, useAnimatedProps, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming, scrollTo, interpolate, Extrapolate, useAnimatedGestureHandler, runOnJS, withDelay, useAnimatedScrollHandler, useDerivedValue } from 'react-native-reanimated'
import { ScrollView, PanGestureHandler } from 'react-native-gesture-handler'
import { BlurView } from 'expo-blur'

import { Post } from '../typescript/Post'
import Content from './Content'
import CloseButton from './CloseButton'


const WINDOW = Dimensions.get('window')
const THUMBNAIL_HEIGHT = WINDOW.height * 0.6

const THUMBNAIL_IMAGE_SCALE_FACTOR = 1.2


const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
const AnimatedPanGestureHandler = Animated.createAnimatedComponent(PanGestureHandler)


interface AppBlockProps {
  post: Post
  isShowingDetails: Animated.SharedValue<boolean>
  showingStateChanged: () => void
}

const AppBlock = ({ post, isShowingDetails, showingStateChanged }: AppBlockProps) => {
  const isShowingContent = useDerivedValue(() => {
    return isShowingDetails.value
  })

  const boxWrapperRef = useAnimatedRef<Animated.View>()
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()

  const showingDetails = useSharedValue(false) as Animated.SharedValue<boolean>


  const blurViewOpacity = useSharedValue(0)

  const boxWrapperHeight = useSharedValue(THUMBNAIL_HEIGHT)
  const boxWrapperPositionHorizontal = useSharedValue(0)
  const boxWrapperPositionTop = useSharedValue(0)

  const scrollViewBorderRadius = useSharedValue(16)
  const scrollViewScale = useSharedValue(1)
  const scrollViewScrollEnabled = useSharedValue(false)
  const scrollViewBounces = useSharedValue(false)
  const pressedScale = useSharedValue(1)

  const thumbnailHeight = useSharedValue(THUMBNAIL_HEIGHT)
  const Android_ThumbnailBorderRadiusBottom = useSharedValue(16)  //overflow: 'hidden' not working on android

  const closeBtnOpacity = useSharedValue(0)
  const closeBtnTint = useSharedValue<'light' | 'dark'>(post.textStyle)



  const showAppDetails = () => {
    if (isShowingContent.value || showingDetails.value)
      return
    showingStateChanged()
    runOnUI(() => {
      'worklet'
      showingDetails.value = true
      blurViewOpacity.value = withDelay(150, withTiming(1, { duration: 150 }))

      boxWrapperHeight.value = withTiming(WINDOW.height)
      const { pageX, pageY } = measure(boxWrapperRef)
      boxWrapperPositionHorizontal.value = withTiming(-pageX)
      boxWrapperPositionTop.value = withTiming(-pageY)

      scrollViewBorderRadius.value = withTiming(0)
      scrollViewScrollEnabled.value = true

      thumbnailHeight.value = withTiming(THUMBNAIL_HEIGHT * THUMBNAIL_IMAGE_SCALE_FACTOR)
      Android_ThumbnailBorderRadiusBottom.value = withTiming(0)
      closeBtnOpacity.value = withTiming(1)
    })()
  }


  const hideAppDetails = () => {
    showingStateChanged()
    runOnUI(() => {
      'worklet'
      showingDetails.value = false
      blurViewOpacity.value = withTiming(0, { duration: 100 })

      boxWrapperHeight.value = withTiming(THUMBNAIL_HEIGHT)
      boxWrapperPositionHorizontal.value = withTiming(0)
      boxWrapperPositionTop.value = withTiming(0)

      scrollViewBorderRadius.value = withTiming(16)
      scrollViewScrollEnabled.value = false
      scrollViewScale.value = withTiming(1)

      thumbnailHeight.value = withTiming(THUMBNAIL_HEIGHT)
      Android_ThumbnailBorderRadiusBottom.value = withTiming(16)
      closeBtnOpacity.value = withTiming(0, { duration: 100 })
      scrollTo(scrollViewRef, 0, 0, true)
    })()
  }



  const blurViewStyles = useAnimatedStyle(() => {
    return { opacity: blurViewOpacity.value }
  })

  const containerZIndex = useAnimatedStyle(() => {
    return { zIndex: showingDetails.value ? 10 : withTiming(0) }  //withTiming -> wait for the closing animation
  })

  const boxWrapperStyles = useAnimatedStyle(() => {
    return {
      left: boxWrapperPositionHorizontal.value,
      right: boxWrapperPositionHorizontal.value,
      top: boxWrapperPositionTop.value,
      height: boxWrapperHeight.value,
      transform: [{ scale: scrollViewScale.value }]
    }
  })


  const scrollViewAnimatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: scrollViewScrollEnabled.value,
      bounces: scrollViewBounces.value,
      transform: [{ scale: pressedScale.value }]
    }
  })
  const scrollViewStyles = useAnimatedStyle(() => {
    return { borderRadius: scrollViewBorderRadius.value }
  })


  const gestureEventHandler = useAnimatedGestureHandler({
    onActive: ({ translationY }) => {
      const inputRange = [0, 100]
      if (translationY > 0) {
        const scaleValue = interpolate(translationY, inputRange, [1, 0.85], Extrapolate.CLAMP)
        scrollViewScale.value = scaleValue

        const borderRadius = interpolate(translationY, inputRange, [0, 16], Extrapolate.CLAMP)
        scrollViewBorderRadius.value = borderRadius

        const opacityValue = interpolate(translationY, inputRange, [1, 0], Extrapolate.CLAMP)
        closeBtnOpacity.value = opacityValue
      }
    },
    onEnd: () => {
      if (scrollViewScale.value > 0.9) {
        scrollViewScale.value = withTiming(1)
        scrollViewBorderRadius.value = withTiming(0)
        closeBtnOpacity.value = withTiming(1)
      }
      else
        runOnJS(hideAppDetails)()
    }
  })
  const panGestureHandlerProps = useAnimatedProps(() => {
    return { enabled: showingDetails.value }
  })


  const thumbnailStyles = useAnimatedStyle(() => {
    return { height: thumbnailHeight.value, }
  })
  const Android_thumbanailImageStyles = useAnimatedProps(() => {
    return {
      borderTopLeftRadius: scrollViewBorderRadius.value,
      borderTopRightRadius: scrollViewBorderRadius.value,
      borderBottomLeftRadius: Android_ThumbnailBorderRadiusBottom.value,
      borderBottomRightRadius: Android_ThumbnailBorderRadiusBottom.value
    }
  })

  return (
    <>
      <Animated.View
        pointerEvents='none'
        style={[styles.blurViewWrapper, blurViewStyles]}
      >
        {Platform.OS !== 'android'
          ? <BlurView tint='dark' intensity={100} style={{ flex: 1 }} />
          : <View style={{ flex: 1, backgroundColor: '#000', opacity: 0.9 }} />
        }
      </Animated.View>

      <Animated.View style={[styles.container, containerZIndex]}>
        <Animated.View
          style={[boxWrapperStyles, { position: 'absolute' }]}
          ref={boxWrapperRef}
        >
          <AnimatedScrollView
            style={[scrollViewStyles, { backgroundColor: '#1C1C1D' }]}
            animatedProps={scrollViewAnimatedProps}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={useAnimatedScrollHandler((event) => {
              if (post.textStyle === 'dark')
                closeBtnTint.value = event.contentOffset.y > ((THUMBNAIL_HEIGHT * THUMBNAIL_IMAGE_SCALE_FACTOR) - 35)
                  ? 'light'
                  : 'dark'
              const scrollViewHeight = measure(scrollViewRef).height
              scrollViewBounces.value = event.contentOffset.y > scrollViewHeight / 2
            })}
            scrollEventThrottle={16}
          >
            <AnimatedPanGestureHandler
              onGestureEvent={gestureEventHandler}
              animatedProps={panGestureHandlerProps}
            >
              <Pressable
                onPress={() => {
                  pressedScale.value = withTiming(1)
                  showAppDetails()
                }}
                onTouchStart={() => pressedScale.value = withTiming(showingDetails.value ? 1 : 0.98)}
                onTouchCancel={() => pressedScale.value = withTiming(1)}
                onTouchEnd={() => pressedScale.value = withTiming(1)}
              >
                <Animated.View style={thumbnailStyles}>
                  <View style={styles.titleWrapper}>
                    <Text style={[styles.title, { color: post.textStyle === 'dark' ? '#303030' : '#FFF' }]}>{post.title}</Text>
                  </View>
                  <Animated.View
                    style={Platform.OS === 'android'
                      ? [Android_thumbanailImageStyles, { overflow: 'hidden', flex: 1 }]
                      : { overflow: 'hidden', flex: 1 }
                    }
                  >
                    <Image
                      source={{ uri: post.imageUrl }}
                      style={styles.imageStyles}
                      resizeMode='cover'
                    />
                  </Animated.View>
                  <View style={styles.descriptionWrapper}>
                    <Text style={[styles.description, { color: post.textStyle === 'dark' ? '#4B4B4B' : '#FFF' }]}>{post.description}</Text>
                  </View>
                </Animated.View>
              </Pressable>
            </AnimatedPanGestureHandler>
            <Content />
          </AnimatedScrollView>

          {Platform.OS !== 'android' && (
            <CloseButton
              opacity={closeBtnOpacity}
              hideAppDetails={hideAppDetails}
              closeBtnTint={closeBtnTint}
            />
          )}
        </Animated.View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  blurViewWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 5
  },

  container: {
    position: 'relative',
    width: '100%',
    height: THUMBNAIL_HEIGHT,
    marginBottom: 30
  },

  titleWrapper: {
    position: 'absolute',
    top: 15,
    width: WINDOW.width - 66,
    paddingHorizontal: 15,
    zIndex: 10
  },
  title: {
    fontSize: WINDOW.width * 0.075,
    fontWeight: '700'
  },

  imageStyles: {
    flex: 1,
    zIndex: 5
  },

  descriptionWrapper: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    paddingHorizontal: 15,
    maxWidth: WINDOW.width * 0.85,
    zIndex: 10
  },
  description: {
    fontSize: WINDOW.width * 0.04
  }
})

export default AppBlock