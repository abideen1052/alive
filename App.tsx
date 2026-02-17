import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SmartHeroGalleryScreen from './src/screens/SmartHeroGalleryScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <SmartHeroGalleryScreen />
    </SafeAreaProvider>
  );
}

export default App;
