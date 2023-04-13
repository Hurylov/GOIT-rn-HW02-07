import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import { Feather } from "@expo/vector-icons";

import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, getNumberOfComments } from "../../redux/posts/postsOperations";
import {
  getUserPhoto,
  getUserName,
  getUserEmail,
} from "../../redux/auth/authSelectors";
import sortByProperty from "../../utils/sort";
import FilledCircleIcon from "../../assets/FilledCircleIcon";

const PostsScreen = ({ navigation }) => {
  const userPhoto = useSelector(getUserPhoto);
  const userName = useSelector(getUserName);
  const userEmail = useSelector(getUserEmail);
  const [posts, setPosts] = useState([]);
  const [commentsNumObj, setCommentsNumObj] = useState({});
  const dispatch = useDispatch();

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


  return (
    <View style={styles.container}>
      <View style={styles.containerPostsScreen}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: userPhoto }}
            style={{ height: 60, width: 60, borderRadius: 16 }}
          />
          <View style={styles.userInfoTextCont}>
            <Text style={styles.userInfoTextName}>{userName}</Text>
            <Text style={styles.userInfoTextEmail}>{userEmail}</Text>
          </View>
        </View>
        <FlatList
          data={sortByProperty(posts, "timestamp")}
          keyExtractor={(item, indx) => indx.toString()}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <Image
                source={{ uri: item.photo }}
                style={{ height: 240, width: "100%", borderRadius: 8 }}
              />
              <Text style={styles.postItemName}>{item.photoName}</Text>
              <View style={styles.postItemAttr}>
                <TouchableOpacity
                  style={styles.postItemLinkMsg}
                  onPress={() =>
                    navigation.navigate("CommentsScreen", {
                      postId: item.postId,
                      image: item.photo,
                    })
                  }
                >
                  {commentsNumObj[item.postId] === 0?<Feather
                    name="message-circle"
                    size={24}
                    color="#BDBDBD"
                    style={{ marginRight: 6 }}
                  />:
                  <FilledCircleIcon
                    size={24}
                    color="#FF6C00"
                    style={{ marginRight: 6 }}
                  />}
                  <Text
                    style={{
                      ...styles.postItemLinkText,
                      color:
                        commentsNumObj[item.postId] === 0
                          ? "#BDBDBD"
                          : "#212121",
                    }}
                  >
                    {commentsNumObj[item.postId]}
                  </Text>
                </TouchableOpacity>
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
                    color="#BDBDBD"
                    style={{ marginRight: 3 }}
                  />
                  <Text
                    style={{
                      ...styles.postItemLinkText,
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
    </View>
  );
};

export default PostsScreen;
