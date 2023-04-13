import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../redux/auth/authOperations";
import * as Progress from "react-native-progress";
import { getIsLoading } from "../../redux/auth/authSelectors";

const initialState = {
  photo: "",
  name: "",
  email: "",
  password: "",
};

const RegistrationScreen = ({ navigation }) => {
  const [registrationState, setRegistrationState] = useState(initialState);
  const [secureEntry, setSecureEntry] = useState(true);
  const [inFocus, setInFocus] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

  const togglePass = () => {
    setSecureEntry(!secureEntry);
  };

  const onRegister = (e) => {
    e.preventDefault();
    dispatch(signUp(registrationState));
    setRegistrationState(initialState);
    setDisabledBtn(true);
  };

  const addUserPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }
    setRegistrationState((prev) => ({ ...prev, photo: result.assets[0].uri }));
  };

  const keyboardHide = () => {
    setIsKeyboardOpen(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (
      registrationState.photo &&
      registrationState.name &&
      registrationState.email &&
      registrationState.password
    )
      setDisabledBtn(false);
  }, [registrationState]);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/img/PhotoBG.png")}
          style={styles.bgImg}
        >
          {isLoading ? (
            <Progress.Pie
              progress={0.35}
              size={100}
              color={"#ff6c00"}
              style={{
                flex: 1,
                color: "#ff6c00",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
              <View
                style={{
                  ...styles.containerRegistration,
                  marginBottom: isKeyboardOpen ? -45 : 0,
                }}
              >
                {registrationState.photo.length <= 0 ? (
                  <View style={styles.photoPlaceholder}>
                    <TouchableOpacity
                      style={{ ...styles.photoAdd }}
                      onPress={addUserPhoto}
                    >
                      <Image
                        source={require("../../assets/img/img_x_org.png")}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Image
                      source={{ uri: registrationState.photo }}
                      style={{ width: 120, height: 120, borderRadius: 16 }}
                    />
                    <TouchableOpacity
                      style={{ ...styles.photoAdd }}
                      onPress={addUserPhoto}
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
                <Text style={styles.title}>Регистрация</Text>
                <TextInput
                  placeholder="Логин"
                  style={{
                    ...styles.input,
                    borderColor: inFocus === "name" ? "#ff6c00" : "#E8E8E8",
                  }}
                  value={registrationState.name}
                  onChangeText={(value) =>
                    setRegistrationState((prev) => ({ ...prev, name: value }))
                  }
                  onFocus={() => {
                    setIsKeyboardOpen(true);
                    setInFocus("name");
                  }}
                  onBlur={() => {
                    setIsKeyboardOpen(false);
                    setInFocus("");
                  }}
                />

                <TextInput
                  placeholder="Адрес электронной почты"
                  style={{
                    ...styles.input,
                    borderColor: inFocus === "email" ? "#ff6c00" : "#E8E8E8",
                  }}
                  value={registrationState.email}
                  onChangeText={(value) =>
                    setRegistrationState((prev) => ({ ...prev, email: value }))
                  }
                  onFocus={() => {
                    setIsKeyboardOpen(true);
                    setInFocus("email");
                  }}
                  onBlur={() => {
                    setIsKeyboardOpen(false);
                    setInFocus("");
                  }}
                />
                <View>
                  <TextInput
                    placeholder="Пароль"
                    style={[
                      styles.input,
                      {
                        ...styles.lastInput,
                        marginBottom: isKeyboardOpen ? 32 : 43,
                        borderColor:
                          inFocus === "password" ? "#ff6c00" : "#E8E8E8",
                      },
                    ]}
                    value={registrationState.password}
                    secureTextEntry={secureEntry}
                    onChangeText={(value) =>
                      setRegistrationState((prev) => ({
                        ...prev,
                        password: value,
                      }))
                    }
                    onFocus={() => {
                      setIsKeyboardOpen(true);
                      setInFocus("password");
                    }}
                    onBlur={() => {
                      setIsKeyboardOpen(false);
                      setInFocus("");
                    }}
                  />
                  <Text style={styles.showPassLogin} onPress={togglePass}>
                    Показать
                  </Text>
                </View>
                {!isKeyboardOpen && (
                  <>
                    <TouchableOpacity
                      style={{
                        ...styles.buttonMain,
                        opacity: disabledBtn ? 0.5 : 1,
                      }}
                      onPress={onRegister}
                      disabled={disabledBtn}
                    >
                      <Text
                        style={styles.buttonMainText}
                        onPress={keyboardHide}
                      >
                        Зарегистрироваться
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text
                        style={styles.link}
                        onPress={() => {
                          navigation.navigate("Login");
                        }}
                      >
                        Уже есть аккаунт? Войти
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </KeyboardAvoidingView>
          )}
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default RegistrationScreen;
