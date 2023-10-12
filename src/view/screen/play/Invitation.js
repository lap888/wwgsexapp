import React, { Component } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, ImageBackground, Image, Platform } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { WEB_PATH } from '../../../config/Index';
import { color } from 'react-native-reanimated';

class Invitation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrcodeUrl: `${WEB_PATH}?code=${this.props.code == "0" ? this.props.mobile : this.props.code}`,
        }
    }
    /**
     * HeaderRight点击事件
     */
    onRightPress() {
        this.saveImage()
    }

    saveImage = async () => {
        if (Platform.OS == 'ios') {
            this.snapshot()
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "哟哟吧想要使用您的相册存储权限",
                        message:
                            "没有您的存储权限将不能保存到相册",
                        buttonNeutral: "以后询问",
                        buttonPositive: "好的"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("允许");
                    this.snapshot()
                } else {
                    console.log("不允许");
                }
            } catch (err) {
                console.warn(err);
            }
        }

    };

    snapshot = () => {
        if (!this.refs.shareViewShot) return;
        captureRef(
            this.refs.shareViewShot, {
            format: 'jpg',
            quality: 1,
            result: "tmpfile"
        })
            .then((uri) => {
                return CameraRoll.save(uri)
            })
            .then((res) => {
                Toast.tipTop('已保存到相册，快去分享吧')
            }).catch((err) => console.warn('err', err))
    }

    /**
     * 渲染二维码
     */
    renderQRCode() {
        let invitCode = this.props.rcode == "0" ? this.props.mobile : this.props.rcode;
        let qrcodeUrl = `${WEB_PATH}?code=${invitCode}`;
        return (
            <View ref="shareViewShot" style={{ flex: 1, backgroundColor: 'transparent' }}>
                <ImageBackground
                    source={require('../../images/inviter3.png')}
                    resizeMode={'stretch'}
                    style={{ flex: 1, width: Metrics.screenWidth }}
                >
                    <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                        <View style={{ flex: 1,justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                            {/* <Text style={{ fontSize: 20, color: Colors.White, marginTop: 10, fontWeight: 'bold' }}>NW量化 让阅读更有价值</Text> */}
                        </View>
                        <View style={{ marginTop: 50, justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                            <QRCode
                                value={qrcodeUrl}
                                logoSize={30}
                                size={120}
                                logoMargin={5}
                                logoBorderRadius={10}
                                logo={require('../../images/logo.png')}
                            />

                        </View>
                        <View style={{ justifyContent: 'center', alignSelf: 'center', flexDirection: 'row', flex: 1, }}>
                            <Text style={{ fontSize: 15, color: Colors.White, marginTop: 10, fontWeight: 'bold' }}>邀请码:</Text>
                            <Text style={{ fontSize: 15, color: Colors.White, marginTop: 10, fontWeight: 'bold' }}>{invitCode}</Text>
                        </View>

                    </View>

                </ImageBackground>
            </View>
        )
    }

    render() {
        return (
            <View style={Styles.container}>
                <Header title="邀请好友" rightText="保存" rightStyle={{ color: Colors.black }} rightIconSize={20} onRightPress={this.saveImage} />
                {this.renderQRCode()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    mobile: state.user.mobile,
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    rcode: state.user.rcode
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Invitation);

const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.mainTab },
    layout: { flexDirection: "row", paddingLeft: 10 },
    userPhoto: { width: 80, height: 80, borderRadius: 40, marginRight: 10 },
    layoutFont: { marginTop: 6, color: '#ffffff', fontSize: 17 },
    shareContainer: { position: 'absolute', backgroundColor: '#FFFFFF', height: 156, left: 0, right: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    shareHeader: { alignSelf: 'center', padding: 20, fontSize: 16, fontWeight: "400" },
    shareBody: { flexDirection: 'row', paddingTop: 20 },
    shareItem: { justifyContent: 'center', alignItems: 'center', paddingLeft: 20 },
    shareImage: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
    shareText: { marginTop: 6 },
    shareFooter: { alignSelf: 'center', padding: 20 },
    shareFooterText: { fontSize: 16, fontWeight: "400" },
});
