// react-native-reanimated is not installed (removed to reduce native-code
// size and NDK dependency). This stub provides the minimal API surface the
// app/expo-router references at import time so bundling doesn't fail.
import { View } from 'react-native';

export default {
  View,
  createAnimatedComponent: (Component) => Component,
};

export const createAnimatedComponent = (Component) => Component;
export const controllableSharedValueMemoryUsage = () => 0;
export const useSharedValue = (v) => ({ value: v });
export const useAnimatedStyle = (fn) => fn();
export const useDerivedValue = (fn) => ({ value: fn() });
export const useAnimatedProps = (fn) => fn();
export const useAnimatedRef = () => ({});

export const withSpring = (value) => value;
export const withTiming = (value) => value;
export const withDecay = (config) => 0;
export const withDelay = (delay, animation) => animation;
export const withSequence = (...animations) => animations[animations.length - 1];
export const withRepeat = (animation) => animation;

export const cancelAnimation = () => {};
export const runOnJS = (fn) => fn;
export const runOnUI = (fn) => fn;
