import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, NativeModules, Platform, Image, Alert, ToastAndroid } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Actions } from 'react-native-router-flux';
import Cookie from 'cross-cookie';
import CryptoJS from 'crypto-js';
import * as WeChat from 'react-native-wechat-lib';
import { connect } from 'react-redux';

import { SetPay, SET_USERINFO } from '../../../redux/ActionTypes';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import Advert from '../advert/Advert';
import { Toast } from '../../common';
import { UserApi } from '../../../api';
import { AUTH_SECRET, API_PATH } from '../../../config/Index';
const AliPay = NativeModules.AliPayModule;
const AlipayIos = NativeModules.Alipay;

const { RNMobad } = NativeModules;

class PayPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num: props.totalWatch,
            rule: ''
        };
    }

    componentDidMount() {
        Send(`api/system/CopyWriting?type=real_name_rule`, {}, 'get').then(res => {
            if (res.code === 200) {
                this.setState({ rule: res.data });
            }
        });
    }



    aliPay() {
        Send('api/HavePayOrder', {}, 'get').then(res => {
            if (res.code == 200) {
                this.props.setPay(true);
                //接口更新数据
                Actions.push('Certification')
            } else {
                Send('api/GenerateAppUrl', {}, 'get').then(res => {
                    if (res.code == 200) {
                        //生成订单
                        let orderStr = res.data;
                        if (Platform.OS == "ios") {
                            AlipayIos.pay(orderStr).then((response) => {
                                let { resultStatus, memo, result } = response;
                                if (resultStatus == "9000") {
                                    result = JSON.parse(result);
                                    let out_trade_no = result.alipay_trade_app_pay_response.out_trade_no;
                                    Send('api/PayFlag?outTradeNo=' + out_trade_no, {}, 'get').then(res => {
                                        if (res.code == 200) {
                                            this.props.setPay(true);
                                            //接口更新数据
                                            Actions.push('Certification')
                                        } else {
                                            Toast.tipTop(res.message)
                                        }
                                    });
                                } else {
                                    Toast.tipTop(memo)
                                }
                            });
                        } else {
                            AliPay.payV2(orderStr, (response) => {
                                let { resultStatus, memo, result } = JSON.parse(response);
                                if (resultStatus == "9000") {
                                    result = JSON.parse(result);
                                    let out_trade_no = result.alipay_trade_app_pay_response.out_trade_no;
                                    Send('api/PayFlag?outTradeNo=' + out_trade_no, {}, 'get').then(res => {
                                        if (res.code == 200) {
                                            this.props.setPay(true);
                                            //接口更新数据
                                            Actions.push('Certification')
                                        } else {
                                            Toast.tipTop(res.message)
                                        }
                                    });
                                } else {
                                    Toast.tipTop(memo)
                                }
                            });
                        }
                    } else {
                        Toast.tipTop(res.message)
                    }
                })
            }
        });
    }

    Sign = (api, token, timeSpan) => {
        let params = [];
        params.push(api.toUpperCase());
        params.push(token.toUpperCase());
        params.push(timeSpan);
        params.push(AUTH_SECRET.toUpperCase());//服务端分发对应key
        params.sort();
        let utf8Params = CryptoJS.enc.Utf8.parse(params.join(''));
        let sign = CryptoJS.MD5(utf8Params).toString(CryptoJS.enc.Hex).substring(5, 29);
        return sign;
    }

    seeAd = () => {
        const callback = (res) => {
            if (res) {
                Send(`api/RealNameAd`, {}, 'get').then(res => {
                    if (res.code === 200) {
                        this.setState({ num: res.data.totalWatch ? res.data.totalWatch : this.state.num + 1 })
                        this.props.resetUserInfo({ totalWatch: res.data.totalWatch })
                    }
                });
            } else {
                // this.feiMaAD();
                setTimeout(() => {
                    Send(`api/RealNameAd`, {}, 'get').then(res => {
                        if (res.code === 200) {
                            this.setState({ num: res.data.totalWatch ? res.data.totalWatch : this.state.num + 1 })
                            this.props.resetUserInfo({ totalWatch: res.data.totalWatch })
                        }
                    });
                }, 10000)
            }
        }
        if (Platform.OS === 'android') {
            Advert.rewardVideo(callback)
        } else {
            // RNMobad.showAd();
            Toast.tip('ios暂时不支持');
        }
    }

    useNewTicket = () => {
        if (this.props.isPay) {
            Actions.push('Certification')
        } else {
            UserApi.useTicket()
                .then((data) => {
                    if (data.code === 200) {
                        this.props.setPay(true);
                        Actions.replace('Certification')
                    } else {
                        Toast.tip(data.message)
                    }
                }).catch((err) => console.log('err', err))
        }

    }
    /**
       * 
       */
    onRightPress() {
        if (!this.props.logged) {
            Actions.push("Login");
            return;
        }
        Actions.push('NewTicket')
    }
    render() {
        return (
            <View style={{ backgroundColor: Colors.White, flex: 1 }}>
                <Header title="实名认证" rightText="去买券" rightStyle={{ color: Colors.black }} rightIconSize={20} onRightPress={() => this.onRightPress()} />
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginTop: 60, marginBottom: 40, alignItems: 'center' }}>
                        {/* <Icon name="idcard" color={Colors.main} size={80} /> */}
                        <Icon name="ios-ribbon-sharp" size={80} color={Colors.main} />
                        <Text style={{ color: Colors.main, fontWeight: 'bold', marginTop: 20, fontSize: 20 }}>您正在进行NW量化实名认证...</Text>
                        {/* <Text style={{ color: Colors.main, marginTop: 10, fontSize: 18 }}>账户更安全</Text> */}
                    </View>
                    <TouchableOpacity
                        style={styles.btnView}
                        onPress={this.useNewTicket}>
                        <Icon name="ios-ribbon-sharp" size={25} color={Colors.White} />
                        <Text style={{ fontSize: 18, color: Colors.White, marginLeft: 10, }}>{`实名认证`}</Text>
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 20, marginTop: 40, marginTop: 50, fontSize: 14, color: Colors.mainTab }}>{this.state.rule}</Text>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    name: state.user.name,
    isPay: state.user.isPay,
    totalWatch: state.user.totalWatch,
});
const mapDispatchToProps = dispatch => ({
    setPay: (isPay) => dispatch({ type: SetPay, payload: { isPay: isPay } }),
    resetUserInfo: userInfo => dispatch({ type: SET_USERINFO, payload: { userInfo } }),
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.C8 },
    ruleContainer: { flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 20 },
    ruleText: { marginTop: 10, fontSize: 14, lineHeight: 19, color: Colors.C16 },
    verticalLine: { height: 12, width: 12, borderRadius: 25, backgroundColor: Colors.C6, marginTop: 2 },
    btnView: { borderRadius: 5, marginTop: 10, borderColor: Colors.main, borderWidth: 0, height: 40, backgroundColor: Colors.main, width: Metrics.screenWidth * 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    alipayBtn: { borderRadius: 25, borderColor: Colors.main, borderWidth: 1, height: 50, width: Metrics.screenWidth * 0.7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
});

export default connect(mapStateToProps, mapDispatchToProps)(PayPage);
