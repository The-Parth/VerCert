import Header from '../../components/Header/Header';
import PasskeyAuth from '../../components/WebAuthn/Passkey';

export default function WebAuth() {
  return (
    <div>
      <Header />
      <PasskeyAuth />
    </div>
  );
}
