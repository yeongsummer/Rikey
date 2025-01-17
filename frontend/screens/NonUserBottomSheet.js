import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    PanResponder
} from 'react-native';
import API from "../api/API";
import { TouchableOpacity } from 'react-native-gesture-handler';

const NonUserBottomSheet = (props) => {
    const { nonmodalVisible, setNonModalVisible } = props;



    const screenHeight = Dimensions.get("screen").height;
    const panY = useRef(new Animated.Value(screenHeight)).current;
    const translateY = panY.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0, 1],
    });

    const resetBottomSheet = Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    });

    const closeBottomSheet = Animated.timing(panY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
    });

    const panResponders = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderMove: (event, gestureState) => {
            panY.setValue(gestureState.dy);
        },
        onPanResponderRelease: (event, gestureState) => {
            if(gestureState.dy > 0 && gestureState.vy > 1.5) {
                closeModal();
            }
            else {
                resetBottomSheet.start();
            }
        }
    })).current;

    useEffect(()=>{
        if(props.nonmodalVisible) {
            resetBottomSheet.start();
        }
    }, [props.nonmodalVisible]);

    const closeModal = () => {
        closeBottomSheet.start(()=>{
            setNonModalVisible(false);
        })
    }
    
    return (
        <Modal
            visible={nonmodalVisible}
            animationType={"fade"}
            transparent
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback
                    onPress={closeModal}
                >
                    <View style={styles.background}/>
                </TouchableWithoutFeedback>
                <Animated.View
                    style={{...styles.bottomSheetContainer, transform: [{ translateY: translateY }]}}
                    {...panResponders.panHandlers}
                >   
                    <TouchableOpacity>
                    <Text style={{fontSize: 20, marginBottom:"5%"}} onPress={() => {
                      alert("신고되었습니다.")
                      closeModal() }}>신고하기</Text>
                    </TouchableOpacity>
                    <View style={{ borderBottomColor: '#484848', borderBottomWidth: 0.5,height: "0.1%", width: "100%"}} />

                    <Text style={{fontSize: 20 ,marginTop: "3%" }} onPress={closeModal}>닫기</Text>   
                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    background: {
        flex: 1,
    },
    bottomSheetContainer: {
        height: 150,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
})

export default NonUserBottomSheet;