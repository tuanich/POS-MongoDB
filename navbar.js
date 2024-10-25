// components/Navbar.js
import { signIn, signOut, useSession } from 'next-auth/react';
import { View } from 'react-native-web';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <View>
      {console.log(session)}
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : !session ? (
        <button onClick={() => signIn()}>Sign In</button>
      ) : (
        <>
          <span>Welcome, {session.user.name}</span>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      )}
    </View>
  );
}