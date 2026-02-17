import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/screens/Home';
import SmartHeroGalleryScreen from './src/screens/SmartHeroGalleryScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SmartHeroGalleryScreen />
    </SafeAreaProvider>
  );
}

export default App;
