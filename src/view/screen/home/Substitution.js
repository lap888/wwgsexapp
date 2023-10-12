import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Send } from '../../../utils/Http';
import { RegExp, Toast } from '../../common';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { btnAfterColor } from '../../theme/Colors';
class Substitution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Amount: '0',
            PayPwd: '',
            coinAmount: '',
            isLoading: true,
            num: 0
        };
    }


    setNum = () => {
        const { Amount, PayPwd } = this.state;
        if (Amount == '') {
            Toast.tip('请填写NW数量')
            return;
        }
        if (PayPwd == '') {
            Toast.tip('请填写支付密码')
            return;
        }
        Send(`api/Coin/CottonExCoin?cotton=${Amount}&passward=${PayPwd}`, {}, 'get').then(res => {
            if (res.code == 200) {
                let title = "兑换成功，点击确定进入兑换明细列表查看...";
                Alert.alert(
                    "消息提醒",
                    title,
                    [
                        {
                            text: "确定", onPress: () => {
                                Actions.push('SubstitutionRecord');
                            }
                        },
                        {
                            text: "取消", onPress: () => {

                            }
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                Toast.tipBottom(res.message)
            }
        })
    }

    onRightPress() {
        Actions.push('SubstitutionRecord');
    }
    canGetCottonCoin = (level, number) => {
        var getNum = 0;
        level = level.toString().toLowerCase();
        switch (level) {
            case 'lv1':
                getNum = (number * (1 - 0.5)).toFixed(4);
                break;
            case 'lv2':
                getNum = (number * (1 - 0.28)).toFixed(4);
                break;
            case 'lv3':
                getNum = (number * (1 - 0.26)).toFixed(4);
                break;
            case 'lv4':
                getNum = (number * (1 - 0.23)).toFixed(4);
                break;
            case 'lv5':
                getNum = (number * (1 - 0.2)).toFixed(4);
                break;
            default:
                getNum = (number * (1 - 0.5)).toFixed(4);
                break;
        }
        return getNum;
    }

    setAmount = (value) => {
        if (RegExp.integer.test(value) || value === '') {
            this.setState({ Amount: value })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={'兑换'} titleStyle={{ color: Colors.titleMainTxt, fontWeight: 'bold' }} backgroundColor={Colors.White} rightStyle={{ color: Colors.titleMainTxt }} rightText={'记录'} onRightPress={this.onRightPress} />
                <ScrollView style={{ paddingHorizontal: 20, marginTop: 10, flex: 1 }}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>数量</Text>
                        <View style={{ flexDirection: 'row', height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={`最低${1}NW起兑`}
                                value={this.state.Amount}
                                keyboardType={'number-pad'}
                                onChangeText={this.setAmount}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 13, color: Colors.C10 }}>{'NW'} ≈ {this.state.Amount} Gas</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 10, color: Colors.C10, marginTop: 5 }}>{`可用 ${this.props.canUserCotton} ${'NW'}`}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: Colors.C12 }}>交易密码</Text>
                        <View style={{ height: 50, borderBottomColor: Colors.C13, borderBottomWidth: 1, }}>
                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={'请输入交易密码'}
                                secureTextEntry={true}
                                value={this.state.PayPwd}
                                onChangeText={(value) => this.setState({ PayPwd: value })}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ height: 40, paddingHorizontal: 50, marginTop: 10, borderRadius: 20 }} onPress={() => { this.setNum() }}>
                        <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 5 }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, color: Colors.White, }}>兑  换</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    candyNum: state.user.candyNum,
});
const mapDispatchToProps = dispatch => ({
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(Substitution);


