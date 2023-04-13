import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";

import styles from "../../styles/styles";
import { Camera } from "expo-camera";
import uploadPostImg from "../../firebase/uploadPostImg";

import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../../redux/auth/authSelectors";
import { addPost } from "../../redux/posts/postsOperations";


const initialState = {
  photo: "",
  name: "",
  locationName: "",
};

const CreatePostsScreen = ({ navigation }) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [postState, setPostState] = useState(initialState);
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const userId = useSelector(getUserId);
  const dispatch = useDispatch();

  const keyboardHide = () => {
    setIsKeyboardOpen(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    if (camera) {
      const incomePhoto = await camera.takePictureAsync();
      await MediaLibrary.createAssetAsync(incomePhoto.uri);
      setPostState((prev) => ({ ...prev, photo: incomePhoto.uri }));
    }
  };

  const onPublicPost = async () => {
    let current = await Location.getCurrentPositionAsync({});
    const currentLocation = {
      latitude: current.coords.latitude.toString(),
      longitude: current.coords.longitude.toString(),
    };
    navigation.navigate("Posts");
    const postUrl = await uploadPostImg(postState.photo, userId); //Передаём на сервер картинку поста
    const newPost = {
      timestamp: Date.now().toString(),
      photo: postUrl,
      photoName: postState.name,
      location: currentLocation,
      locationName: postState.locationName,
      userId,
    };
    dispatch(addPost(newPost));
    setPostState(initialState);
    setDisabledBtn(true);
  };

  const onRemoveForm = () => {
    setPostState(initialState);
  };

  useEffect(() => {
    if (postState.photo && postState.name && postState.locationName) {
      setDisabledBtn(false);
    }
  }, [
    postState.photo.length,
    postState.name.length,
    postState.locationName.length,
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View style={styles.containerCreatePostScreen}>
            <View style={styles.cameraPlaceholder}>
              <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ref={(ref) => {
                  setCamera(ref);
                }}
              >
                <TouchableOpacity style={styles.cameraIcon} onPress={takePhoto}>
                  <Image
                    source={require("../../assets/img/CameraIconGrey.png")}
                  />
                </TouchableOpacity>
                {postState.photo && (
                  <View style={styles.takenPhoto}>
                    <Image
                      source={{ uri: postState.photo }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                )}
              </Camera>
            </View>
            {!postState.photo ? (
              <Text style={styles.photoStatus}>Загрузите фото</Text>
            ) : (
              <Text style={styles.photoStatus}>Редактировать фото</Text>
            )}
            <View style={styles.photoNameInput}>
              <TextInput
                placeholder="Название..."
                style={styles.photoInputText}
                value={postState.name}
                onChangeText={(value) =>
                  setPostState((prev) => ({ ...prev, name: value }))
                }
                onFocus={() => {
                  setIsKeyboardOpen(true);
                }}
                onBlur={() => {
                  setIsKeyboardOpen(false);
                }}
              ></TextInput>
            </View>
            <View style={styles.photoLocationInput}>
              <Feather
                name="map-pin"
                size={24}
                color="#BDBDBD"
                style={{ marginRight: 4 }}
              />
              <TextInput
                placeholder="Местность..."
                style={styles.photoInputText}
                value={postState.locationName}
                onChangeText={(value) =>
                  setPostState((prev) => ({ ...prev, locationName: value }))
                }
                onFocus={() => {
                  setIsKeyboardOpen(true);
                }}
                onBlur={() => {
                  setIsKeyboardOpen(false);
                }}
              ></TextInput>
            </View>
            <TouchableOpacity
              style={
                !disabledBtn
                  ? styles.buttonMain
                  : { ...styles.buttonMain, backgroundColor: "#F6F6F6" }
              }
              onPress={onPublicPost}
              disabled={disabledBtn}
            >
              <Text
                style={
                  !disabledBtn
                    ? styles.buttonMainText
                    : { ...styles.buttonMainText, color: "#BDBDBD" }
                }
                onPress={keyboardHide}
              >
                Опубликовать
              </Text>
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={styles.buttonDel} onPress={onRemoveForm}>
                <Feather name="trash-2" size={24} color="#BDBDBD" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePostsScreen;
