import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Google Cloud Console → OAuth 2.0 → Web Client ID
const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

export const configureGoogleSignin = () => {
  GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
};
