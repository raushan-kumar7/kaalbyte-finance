// import * as ImagePicker from 'expo-image-picker';
// import { Alert } from 'react-native';

// export const useImageUpload = () => {
//   const pickImage = async (): Promise<string | null> => {
//     // 1. Request Permissions
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (status !== 'granted') {
//       Alert.alert(
//         'Permission Required', 
//         'We need access to your gallery to update your profile picture.'
//       );
//       return null;
//     }

//     // 2. Launch Picker
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1], // Square for Profile
//       quality: 0.7,   // Compression for faster upload
//     });

//     if (!result.canceled) {
//       return result.assets[0].uri;
//     }

//     return null;
//   };

//   return { pickImage };
// };

import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImageUpload = () => {
  const pickImage = async (): Promise<string | null> => {
    try {
      // 1. Request Permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required', 
          'We need access to your gallery to update your profile picture.'
        );
        return null;
      }

      // 2. Launch Picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Updated syntax for newer versions
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("ImagePicker Error:", error);
      Alert.alert("Error", "Could not open image library");
      return null;
    }
  };

  return { pickImage };
};