import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';
import { Colors, Metrics } from '../../theme/Index';
import { Header, Loading } from '../../components/Index';

export default class MessageDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			msgData: {},
			isLoad: false,
			webViewHeight: 300,
		};
	}

	webViewLoadedEnd = () => {
		this.webview.injectJavaScript(`
                const height = document.body.clientHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));
            `);
	}

	onMessage = (e) => {
		const data = JSON.parse(e.nativeEvent.data);
		if (data.height) {
			this.setState({
				webViewHeight: data.height < 500 ? 500 : data.height
			});
		}
	}
	renderContent() {
		let _html = `<!DOCTYPE html>
        <html>
        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <body>
        ${this.props.msgData.content}
        <script>
        function ResizeImages(){
          var myimg;
          for(i=0;i <document.images.length;i++){
            myimg = document.images[i];
            myimg.width = ${Metrics.screenWidth - 20};
          }
        }
        window.onload=function(){ 
          ResizeImages()
          window.location.hash = '#' + document.body.clientHeight;
          document.title = document.body.clientHeight;
        }
        </script></body></html>`
		return (
			<View style={{ flex: 1 }}>
				<ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
					<Text style={{ textAlign: "center", marginTop: 10, fontSize: 18 }}>
						{this.props.msgData.title ? this.props.msgData.title : ""}
					</Text>
					<Text style={{ fontSize: 12, padding: 10, color: "gray" }}>
						发布时间: {this.props.msgData.ceratedAt}
					</Text>
					{/* <Text style={{ fontSize: 13, letterSpacing: 1 }}>
						{`${this.props.flag === "system" ? this.props.msgData.content : this.props.msgData.content}`}
					</Text> */}
					<View style={{ height: this.state.webViewHeight }}>
						<WebView
							ref={(ref) => this.webview = ref}
							style={{ flex: 1, height: this.state.webViewHeight }}
							source={{ html: _html }}
							originWhitelist={["*"]}
							onMessage={this.onMessage}
							onLoadEnd={this.webViewLoadedEnd}
							javaScriptEnabled={true}
						/>
					</View>
				</ScrollView>
			</View>
		)
	}
	render() {
		return (
			<SafeAreaView style={Styles.contentContainer}>
				<Header title={this.props.flag === "system" ? "系统消息" : "活动公告"} />
				{this.renderContent()}
			</SafeAreaView>
		);
	}
}
const Styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		backgroundColor: "#FFFFFF"
	}
});
