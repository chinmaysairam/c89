import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import PostCard from "./PostCard";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";

let posts = require("./temp_posts.json");
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};
export default class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
           fontsLoaded: false,
           posts:[]
        };
    }
async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchPosts();
  }

  fetchPosts=()=>{
    firebase.database().ref("/posts/").on("values",(snapshot)=>{
let posts=[]
if(snapshot.val()){
Object.keys(snapshot.val()).forEach(function(key){
posts.push({
  key:key,
  value:snapshot.val()[key]
})
})
}
this.setState({posts:posts})
    })
  }

   

    renderItem = ({ item: post }) => {
        return <PostCard post={post} navigation={this.props.navigation} />;
    };

    keyExtractor = (item, index) => index.toString();

    render() {
      if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.appTitle}>
                    <View style={styles.appIcon}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={styles.iconImage}
                        ></Image>
                    </View>
                    <View style={styles.appTitleTextContainer}>
                        <Text style={styles.appTitleText}>Spectagram</Text>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.posts}
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );
    }
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row"
    },
    appIcon: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center"
    },
    iconImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
    },
    appTitleTextContainer: {
        flex: 0.8,
        justifyContent: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28),
    },
    cardContainer: {
        flex: 0.85
    }
});
