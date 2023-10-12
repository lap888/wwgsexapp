import React, { Component } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, Keyboard, NativeModules
} from 'react-native';
// const AliPay = NativeModules.AliPayModule;
import { Actions } from 'react-native-router-flux';
import { Header } from '../../../components/Index';
import { connect } from 'react-redux';
import { LOGOUT } from '../../../../redux/ActionTypes';
import { Colors, Metrics } from '../../../theme/Index';
import { SetAlipay } from '../../../../redux/ActionTypes';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

class ModifyAlipay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alipay: "",
            enterAlipay: '',
            pwd: '',
            name: ''
        };
    }
    loginOut() {
        this.props.logout();
        Actions.Login({ relogin: "resetPwd" });
    }
    /**
     * 重置登陆密码
     */
    resetTradePed() {
        Keyboard.dismiss();

        let { alipay, enterAlipay, pwd, name } = this.state;
        /* 非空校验 */
        if (alipay.length === 0) {
            Toast.tipTop('支付宝为必填项')
            return;
        }
        if (name.length === 0) {
            Toast.tipTop('支付宝姓名不能为空')
            return;
        }
        if (pwd.length === 0) {
            Toast.tipTop('支付密码为必填项')
            return;
        }
        if (alipay !== enterAlipay) {
            Toast.tipTop('两次支付账号不一致')
            return;
        }
        Send(`api/User/Change`, { alipay: alipay, PayPwd: pwd, name: name })
            .then(res => {
                if (res.code == 200) {
                    Toast.tipTop('修改成功')
                    this.props.modifyAlipay(alipay);
                    Actions.pop();
                } else {
                    Toast.tipTop(res.message)
                }
            })
    }
    render() {
        return (
            <View style={styles.businessPwdPageView}>
                <Header title="修改支付宝" />
                <View style={{ flex: 1 }}>
                    <View style={styles.pwdViewStyle}>
                        <TextInput
                            style={styles.inputViewStyle}
                            placeholder="请输入支付宝使用者姓名"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                this.setState({
                                    name: text
                                })
                            }}
                        />
                        <TextInput
                            style={styles.inputViewStyle}
                            placeholder="请输入新支付宝"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            keyboardType='number-pad'
                            onChangeText={(text) => {
                                this.setState({
                                    alipay: text
                                })
                            }}
                        />
                        <TextInput
                            style={styles.inputViewStyle}
                            placeholder="请再次确认支付宝"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            keyboardType='number-pad'
                            onChangeText={(text) => {
                                this.setState({
                                    enterAlipay: text
                                })
                            }}
                        />
                        <TextInput
                            style={styles.inputViewStyle}
                            placeholder="请输入交易密码"
                            autoCapitalize="none"
                            clearButtonMode="always"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({ pwd: text })}
                        />
                        <View style={styles.submitView}>
                            <TouchableOpacity onPress={() => this.resetTradePed()}>
                                <View style={styles.submitBtn} >
                                    <Text style={{ padding: 15, color: "#ffffff" }}> 确认 </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
    modifyAlipay: (alipay) => dispatch({ type: SetAlipay, payload: { alipay: alipay } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyAlipay);

// 样式
const styles = StyleSheet.create({
    businessPwdPageView: {
        flex: 1,
        backgroundColor: Colors.White,
    },
    pwdViewStyle: {
        padding: 10,
    },
    inputViewStyle: {
        height: 48,
        paddingLeft: 10,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: Colors.backgroundColor,
    },
    submitView: {
        height: Metrics.screenHeight * 0.4,
        justifyContent: 'center',
        alignItems: "center",
    },
    submitBtn: {
        backgroundColor: Colors.mainTab,
        width: Metrics.screenWidth * 0.6,
        alignItems: "center",
        borderRadius: 8,
    },
})