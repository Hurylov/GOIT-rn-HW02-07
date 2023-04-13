import React from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";

import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUserId, getUserPhoto } from "../../redux/auth/authSelectors";
import { AntDesign } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import { addComment, getAllComments } from "../../redux/posts/postsOperations";
import { FlatList } from "react-native";
import sortByProperty from "../../utils/sort";

const CommentsScreen = ({ route }) => {
  const { postId, image } = route.params;
  const userId = useSelector(getUserId);
  const userPhoto = useSelector(getUserPhoto);
  const [newComment, setNewComment] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (setComments) {
      const getCommentsData = { postId, setComments };
      dispatch(getAllComments(getCommentsData));
    }
  }, [setComments]);

  useEffect(() => {
    if (newComment) setDisabledBtn(false);
  }, [newComment]);

  const keyboardHide = () => {
    setIsKeyboardOpen(false);
    Keyboard.dismiss();
  };

  const addNewComment = () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const commentData = {
      timestamp: Date.now().toString(),
      text: newComment,
      userId: userId,
      postId,
      date,
      time,
      userPhoto,
    };
    dispatch(addComment(commentData));
    keyboardHide();
    setNewComment("");
    setDisabledBtn(true);
  };
  
  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View
            style={{
              ...styles.containerCommentsScreen,
              marginBottom: isKeyboardOpen ? -130 : 0,
            }}
          >
            <Image
              source={{ uri: image }}
              style={{
                height: 240,
                width: "100%",
                borderRadius: 8,
                marginBottom: 32,
              }}
            />

            <FlatList
              data={sortByProperty(comments, "timestamp")}
              keyExtractor={(item, indx) => indx.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    ...styles.commentWrap,
                    flexDirection:
                      item.userId !== userId ? "row" : "row-reverse",
                  }}
                >
                  <Image
                    source={{ uri: item.userPhoto }}
                    style={styles.commentPhoto}
                  />
                  <View
                    style={{
                      ...styles.commentTextWrapper,
                      borderTopLeftRadius: item.userId === userId ? 6 : 0,
                      borderTopRightRadius: item.userId === userId ? 0 : 6,
                    }}
                  >
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.commentDate}>
                      {item.date} | {item.time}
                    </Text>
                  </View>

                  <View style={styles.postItemAttr}></View>
                </View>
              )}
            />
            <View
              style={{
                ...styles.commentInputWrapper,
              }}
            >
              <TextInput
                placeholder="Комментировать..."
                placeholderTextColor="#BDBDBD"
                style={styles.commentInput}
                value={newComment}
                onChangeText={(value) => {
                  setNewComment(value);
                }}
                onFocus={() => {
                  setIsKeyboardOpen(true);
                }}
                onBlur={() => {
                  setIsKeyboardOpen(false);
                }}
              ></TextInput>
              <TouchableOpacity
                style={{
                  ...styles.addCommentBtn,
                  opacity: disabledBtn ? 0.5 : 1,
                }}
                onPress={addNewComment}
                disabled={disabledBtn}
              >
                <AntDesign name="arrowup" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CommentsScreen;
