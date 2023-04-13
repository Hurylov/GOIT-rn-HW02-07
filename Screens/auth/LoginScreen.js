import { useEffect, useState } from "react";
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
} from "react-native";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../redux/auth/authOperations";
import * as Progress from "react-native-progress";
import { getIsLoading } from "../../redux/auth/authSelectors";

const initialState = {
  email: "",
  password: "",
};

const LoginScreen = ({ navigation }) => {
  const [loginState, setLoginState] = useState(initialState);
  const [secureEntry, setSecureEntry] = useState(true);
  const [inFocus, setInFocus] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

  const togglePass = () => {
    setSecureEntry(!secureEntry);
  };

  const onSignIn = (e) => {
    e.preventDefault();
    dispatch(signIn(loginState));
    setLoginState(initialState);
    setDisabledBtn(true);
  };

  const keyboardHide = () => {
    setIsKeyboardOpen(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (loginState.email && loginState.password) setDisabledBtn(false);
  }, [loginState.email.length, loginState.password.length]);

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
                  ...styles.containerLogin,
                  marginBottom: isKeyboardOpen ? -100 : 0,
                }}
              >
                <Text style={styles.title}>Войти</Text>

                <TextInput
                  placeholder="Адрес электронной почты"
                  style={{
                    ...styles.input,
                    borderColor: inFocus === "email" ? "#ff6c00" : "#E8E8E8",
                  }}
                  value={loginState.email}
                  onChangeText={(value) =>
                    setLoginState((prev) => ({ ...prev, email: value }))
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
                    value={loginState.password}
                    secureTextEntry={secureEntry}
                    onChangeText={(value) =>
                      setLoginState((prev) => ({ ...prev, password: value }))
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
                      onPress={onSignIn}
                      disabled={disabledBtn}
                    >
                      <Text
                        style={styles.buttonMainText}
                        onPress={keyboardHide}
                      >
                        Войти
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text
                        style={styles.link}
                        onPress={() => {
                          navigation.navigate("Registration");
                        }}
                      >
                        Нет аккаунта? Зарегистрироваться
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

export default LoginScreen;
