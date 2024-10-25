import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { COLORS, FONTS } from './source/constants';
import {
  GoogleSignin,
  GoogleSigninButton,

} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";



export default function GoogleSignIn({ signed }) {

  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "443531173003-c8d9buuqg2fvmoaait9qo69ihlp6tu46.apps.googleusercontent.com",
      iosClientId:
        "443531173003-apd3et6pn4em1mf1evqqsrhknkpu2pa3.apps.googleusercontent.com"
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const signIn = async () => {
    //  console.log("Pressed sign in");

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //console.log("User Info: ", userInfo.data);
      setUserInfo(userInfo.data.user);
      signed(userInfo.data.user, GoogleSignin);
      setError();
    } catch (e) {
      setError(e);
    }
  };

  const logout = () => {
    setUserInfo(undefined);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtWelcome}>Welcome to POS</Text>
      {/*console.log(JSON.stringify(error))*/}
      {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
      {userInfo ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}

          onPress={signIn}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  txtWelcome: {

    //   fontWeight: "bold",
    color: COLORS.primary, ...FONTS.h2,
    padding: 20,
  },
});