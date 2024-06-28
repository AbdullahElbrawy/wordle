// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import ARKit from 'react-native-arkit';
// import axios from 'axios';

// export default function ARScreen() {
//   const [word, setWord] = useState('');

//   useEffect(() => {
//     // Fetch word related to the user's current location
//     axios.get('http://192.168.1.100:30000/geolocationWord?location=New York') // Example location
//       .then(response => setWord(response.data.word))
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <View style={styles.container}>
//       <ARKit style={styles.arView}>
//       <ARKit
//         style={{ flex: 1 }}
//         planeDetection={ARKit.ARPlaneDetection.Horizontal}
//         lightEstimationEnabled
//         onPlaneDetected={(anchor) => console.log('Plane detected!', anchor)}
//         onPlaneUpdated={(anchor) => console.log('Plane updated!', anchor)}
//       />
//       </ARKit>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   arView: {
//     flex: 1,
//   },
// });
