import React from "react";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";

import styles from "../../styles/styles";
import {
  getUserId,
  getUserName,
  getUserPhoto,
} from "../../redux/auth/authSelectors";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { logOut, updatePhoto } from "../../redux/auth/authOperations";
import { Image } from "react-native";
import filterPostsByUserId from "../../utils/filterPostsByUserId";
import sortByProperty from "../../utils/sort";
import { useEffect } from "react";
import {
  getAllPosts,
  getNumberOfComments,
} from "../../redux/posts/postsOperations";
import FilledCircleIcon from "../../assets/FilledCircleIcon";

export const ProfileScreen = ({ navigation }) => {
  const userName = useSelector(getUserName);
  const userPhoto = useSelector(getUserPhoto);
  const userId = useSelector(getUserId);
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const [commentsNumObj, setCommentsNumObj] = useState({});

  useEffect(() => {
    if (setPosts) {
      dispatch(getAllPosts(setPosts));
    }
  }, [setPosts]);

  useEffect(() => {
    const commentsArrData = { posts, setCommentsNumObj };
    if (posts.length) {
      dispatch(getNumberOfComments(commentsArrData));
    }
  }, [posts]);

  const updateUserPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }
    const file = result.assets[0].uri;
    dispatch(updatePhoto(file));
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/img/PhotoBG.png")}
        style={styles.bgImg}
      >
        <View style={styles.containerProfile}>
          <TouchableOpacity
            style={styles.logoutBtnProfile}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          {userPhoto === null ? (
            <View style={styles.photoPlaceholder}>
              <TouchableOpacity
                style={{ ...styles.photoAdd }}
                onPress={updateUserPhoto}
              >
                <Image source={require("../../assets/img/img_x_org.png")} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Image
                source={{ uri: userPhoto }}
                style={{ width: 120, height: 120, borderRadius: 16 }}
              />
              <TouchableOpacity
                style={{ ...styles.photoAdd }}
                onPress={updateUserPhoto}
              >
                <Image
                  source={require("../../assets/img/img_x.png")}
                  style={{
                    transform: [{ rotate: "-45deg" }],
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.title}>{userName}</Text>
          <FlatList
            data={sortByProperty(
              filterPostsByUserId(posts, userId),
              "timestamp"
            )}
            keyExtractor={(item, indx) => indx.toString()}
            renderItem={({ item }) => (
              <View style={styles.postItem}>
                <Image
                  source={{ uri: item.photo }}
                  style={{ height: 240, width: "100%", borderRadius: 8 }}
                />
                <Text style={styles.postItemName}>{item.photoName}</Text>
                <View style={styles.postItemAttr}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.postItemLinkMsg}
                      onPress={() =>
                        navigation.navigate("CommentsScreen", {
                          postId: item.postId,
                          image: item.photo,
                        })
                      }
                    >
                      {commentsNumObj[item.postId] === 0 ? (
                        <Feather
                          name="message-circle"
                          size={24}
                          color="#BDBDBD"
                          style={{ marginRight: 6 }}
                        />
                      ) : (
                        <FilledCircleIcon
                          size={24}
                          color="#FF6C00"
                          style={{ marginRight: 6 }}
                        />
                      )}
                      <Text
                        style={{
                          ...styles.postItemLinkText,
                          color:
                            commentsNumObj[item.postId] === 0
                              ? "#FF6C00"
                              : "#212121",
                          marginRight: 24,
                        }}
                      >
                        {commentsNumObj[item.postId]}
                      </Text>
                    </TouchableOpacity>
                    <Feather
                      name="thumbs-up"
                      size={24}
                      color="#FF6C00"
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{ ...styles.postItemLinkText, color: "#FF6C00" }}
                    >
                      0
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.postItemLinkLoc}
                    onPress={() => {
                      navigation.navigate("MapScreen", {
                        latitude: item.location.latitude,
                        longitude: item.location.longitude,
                      });
                    }}
                  >
                    <Feather
                      name="map-pin"
                      size={24}
                      color="#FF6C00"
                      style={{ marginRight: 3 }}
                    />
                    <Text
                      style={{
                        ...styles.postItemLinkText,
                        color: "#212121",
                        textDecorationLine: "underline",
                      }}
                    >
                      {item.locationName}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;
