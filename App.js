import * as React from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';


export default class App extends React.Component {
  state = {
    rollGranted: false,
    cameraGranted: false,
    image:null
  };

  componentDidMount() {
    this.getCameraPermissions();
  }

  async getCameraPermissions() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      this.setState({ cameraGranted: true });
    } else {
      this.setState({ cameraGranted: false });
      console.log('Uh oh! The user has not granted us permission.');
    }
    this.getCameraRollPermissions();
  }

  async getCameraRollPermissions() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      this.setState({ rollGranted: true });
    } else {
      console.log('Uh oh! The user has not granted us permission.');
      this.setState({ rollGranted: false });
    }
  }

  takePictureAndCreateAlbum = async () => {
    console.log('tpaca');
    const { uri } = await this.camera.takePictureAsync();
    console.log('uri', uri);
    const asset = await MediaLibrary.createAssetAsync(uri);
    console.log('asset', asset);
    MediaLibrary.createAlbumAsync('Expo', asset)
      .then(() => {
        Alert.alert('Album Creado!')
      })
      .catch(error => {
        Alert.alert('Un error ocurrio!')
      });
  };
    _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    let { image } = this.state;

    return (
      <>
      <View style={styles.container}>
        <Camera
          type={Camera.Constants.Type.back}
          style={{ flex: 1 }}
          ref={ref => {
            this.camera = ref;
          }}
        />
        <TouchableOpacity
          onPress={() =>
            this.state.rollGranted && this.state.cameraGranted
              ? this.takePictureAndCreateAlbum()
              : Alert.alert('Permissions not granted')
          }
          style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              Toma foto
            </Text>
          </View>

          
        </TouchableOpacity>
      </View>
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Ve la imagen que acabas de crear"
          onPress={this._pickImage}
        />
        {image &&
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: 200,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
  },
});
