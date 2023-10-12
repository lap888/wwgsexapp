import { number } from 'prop-types';
import React, { Component } from 'react';
import { View, Text, TextInput, Keyboard, TouchableOpacity, Image } from 'react-native';
import { CountDownButton, Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import { ParamsValidate } from '../../../../utils/Index';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

class AddPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            number: '',
            code: '',
            image: '',
        };
    }

    onChangeName = (value) => {
        this.setState({ name: value });
    }
    onChangeNumber = (value) => {
        this.setState({ number: value });
    }
    onChangeCode = (value) => {
        this.setState({ code: value });
    }

    SendVcode = (shouldStartCountting) => {
        Keyboard.dismiss();
        let that = this
        let mobile = this.state.mobile;
        // 手机号校验
        let msg = ParamsValidate('mobile', mobile);
        if (msg !== null) {
            Toast.tip(msg)
            return;
        }
        // 向后端发起请求 
        const params = { mobile: mobile, type: "signIn" }
        Send('api/SendVcode', params).then(res => {
            if (res.code == 200) {
                that.setState({ msgId: res.data.msgId });
                Toast.tip('验证码已发送');
                setTimeout(() => { shouldStartCountting && shouldStartCountting(true) }, 1);
            } else {
                Toast.tip(`${res.message || "验证码发送失败"}`);
                setTimeout(() => { shouldStartCountting && shouldStartCountting(false) }, 1);
            }
        });
    }

    render() {
        let { name, number, code, image } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header title={'收款方式'} />
                <View style={{ borderTopColor: Colors.backgroundColor, borderTopWidth: 5, paddingHorizontal: 20 }}>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: Colors.backgroundColor }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={'输入收款人姓名'}
                            onChangeText={this.onChangeName}
                            value={name}
                        />
                    </View>
                    <View style={{ height: 50, borderBottomWidth: 1, borderBottomColor: Colors.backgroundColor }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={'输入您的微信号'}
                            onChangeText={this.onChangeNumber}
                            value={number}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 1, borderBottomColor: Colors.backgroundColor }}>
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={'输入验证码'}
                            onChangeText={this.onChangeCode}
                            value={code}
                        />
                        <CountDownButton
                            textStyle={{ fontSize: 14, fontWeight: '600', color: Colors.main }}
                            style={{ backgroundColor: Colors.White, width: 90, color: Colors.main }}
                            buttonStyle={{ fontSize: 16 }}
                            timerCount={60}
                            enable={true}
                            timerTitle={'获取验证码'}
                            onClick={(shouldStartCountting) => this.SendVcode(shouldStartCountting)}
                            timerEnd={() => this.setState({ state: '倒计时结束' })} />
                    </View>
                    <View style={{marginTop: 15}}>
                        <Text>添加收款码</Text>
                        <View style={{height: 100, width: 100, marginTop: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 1, borderColor: Colors.greyText, borderStyle: 'dashed'}}>
                            {image == '' ?
                                <Icon name={'md-add'} size={50} color={Colors.backgroundColor}/> :
                                <Image />}
                        </View>
                    </View>
                </View>
                <View style={{height: 50, paddingHorizontal: 20, marginTop: 50}}>
                    <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 5 }}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => Actions.push('AddPayment')}>
                            <Text style={{ fontSize: 15, color: Colors.White, }}>添加</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    rcode: state.user.rcode,
    mobile: state.user.mobile,
});
const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(AddPayment);
