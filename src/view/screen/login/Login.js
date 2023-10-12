import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, ImageBackground, TextInput, Keyboard, Platform, ScrollView } from 'react-native';
import Cookie from 'cross-cookie';
import DeviceInfo from 'react-native-device-info';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { LOGIN_SUCCESS } from '../../../redux/ActionTypes';
import { Colors } from '../../theme/Index';
import { CountDownButton, Header } from '../../components/Index';
import { ParamsValidate } from '../../../utils/Index';
import { Send } from '../../../utils/Http';
import Advert from '../advert/Advert';
import { Toast } from '../../common';
import { SystemApi, UserApi } from '../../../api';


class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			password: '',
			rMobile: '',
			rCode: '',
			rPassword: '',
			rPwd: '',
			rInvite: '',
			msgId: '',
			displayMobile: "none",
			displayPassword: "none",
			loginTab: 'login'
		};
	}
	_onChangeMobile = (inputData) => {
		this.setState({ displayMobile: "flex", mobile: inputData });
	}
	_onChangePassword = (inputData) => {
		this.setState({ displayPassword: "flex", password: inputData });
	}
	_onChangeRMobile = (inputData) => {
		this.setState({ displayMobile: "flex", rMobile: inputData });
	}
	_onChangeRCode = (inputData) => {
		this.setState({ displayPassword: "flex", rCode: inputData });
	}
	_onChangeRPassword = (inputData) => {
		this.setState({ displayMobile: "flex", rPassword: inputData });
	}
	_onChangeRPwd = (inputData) => {
		this.setState({ displayPassword: "flex", rPwd: inputData });
	}
	_onChangeRInvite = (inputData) => {
		this.setState({ displayPassword: "flex", rInvite: inputData });
	}

	Login = async () => {
		Keyboard.dismiss();
		const { mobile, password } = this.state;
		let mobileMsg = ParamsValidate('mobile', mobile);
		if (ParamsValidate('mobile', mobile) !== null) {
			Toast.tip(mobileMsg)
			return;
		}
		let passwordMsg = ParamsValidate('password', password);
		if (passwordMsg !== null) {
			Toast.tip(passwordMsg)
			return;
		}
		let deviceName = ''
		await DeviceInfo.getDeviceName()
			.then((name) => {
				deviceName = name;
			}).catch((err) => console.log('err', err));
		let params = {};
		params = this.state;
		params.version = DeviceInfo.getVersion();
		params.uniqueID = DeviceInfo.getUniqueId();
		params.systemName = Platform.OS === 'android' ? 'Android' : 'IOS';
		params.systemVersion = DeviceInfo.getSystemVersion();
		params.deviceName = deviceName;
		params.lat = this.props.location.latitude;
		params.lng = this.props.location.longitude;
		params.province = typeof this.props.location.province == 'object' ? '' : this.props.location.province;
		params.provinceCode = 0;
		params.city = this.props.location.city == 'object' ? '' : this.props.location.city;
		params.cityCode = this.props.location.cityCode == 'object' ? 0 : this.props.location.cityCode;
		params.area = this.props.location.district == 'object' ? '' : this.props.location.district;
		params.areaCode = this.props.location.adCode == 'object' ? 0 : this.props.location.adCode;

		UserApi.login(params)
			.then((data) => {
				this.props.loginSuccess(data.user);
				Cookie.set({ 'token': data.token });
				Cookie.set({ 'userId': data.user.id });
				Advert.setUserId(`s9${data.user.id}`)
				setTimeout(function () {
					Actions.replace("Index");
				}, 0);
			}).catch((err) => console.log('err', err))
	}

	registe = () => {
		const { rMobile, rCode, msgId, rPassword, rInvite } = this.state;
		const params = {
			"Mobile": rMobile,
			"MsgId": msgId,
			"VerifyCode": rCode,
			"InvitationCode": rInvite,
			"Password": rPassword,
			"NickName": `${rMobile}`
		}
		UserApi.signUp(params)
			.then((data) => {
				Toast.tip('注册成功')
				this.setState({
					loginTab: 'login',
					mobile: rMobile,
				})
			}).catch((err) => console.log('err', err))
	}

	/**
	 * 进入隐私政策界面
	 */
	PrivacyPolicy = () => {
		Send(`api/system/CopyWriting?type=pro_rule`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '隐私政策', rules: res.data });
		});
	}

	SendVcode = (shouldStartCountting) => {
		Keyboard.dismiss();
		let mobile = this.state.rMobile;
		// 手机号校验
		let msg = ParamsValidate('mobile', mobile);
		if (msg !== null) {
			Toast.tip(msg)
			return;
		}
		const params = { mobile: mobile, type: "signIn" }
		SystemApi.sendVcode(params)
			.then((data) => {
				this.setState({ msgId: data.msgId });
				Toast.tip('验证码已发送');
				setTimeout(() => { shouldStartCountting && shouldStartCountting(true) }, 0);
			}).catch((err) => setTimeout(() => { shouldStartCountting && shouldStartCountting(false) }, 0))
	}

	render() {
		const { loginTab, mobile, password, rMobile, rCode, rInvite, rPassword, rPwd } = this.state;
		return (
			<ScrollView style={{ flex: 1, backgroundColor: Colors.White }}>
				<Header title='欢迎加入牛蛙量化' />
				<ImageBackground style={{ height: 160, }} source={require('../../images/homeTitle.png')} >
					<View style={{ flex: 1 }} ></View>
					<View style={{ flexDirection: 'row', height: 40, }}>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => this.setState({ loginTab: 'login' })}>
							<Text style={{ fontSize: 18, color: Colors.White }}>登录</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => this.setState({ loginTab: 'regist' })}>
							<Text style={{ fontSize: 18, color: Colors.White }}>注册</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: 'row', height: 20 }}>
						<View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }} >
							{loginTab === 'login' && <View style={styles.sanjiao} />}
						</View>
						<View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }} >
							{loginTab === 'regist' && <View style={styles.sanjiao} />}
						</View>
					</View>
				</ImageBackground>
				{loginTab === 'login' ?
					<View style={{ paddingTop: 20 }}>
						<View style={styles.loginInput}>
							<TextInput
								style={styles.placeholderText}
								value={mobile}
								placeholder="请输入您的账号"
								textAlign={'center'}
								keyboardType='number-pad'
								onChangeText={this._onChangeMobile}
							/>
						</View>
						<View style={[styles.loginInput, { marginTop: 10 }]}>
							<TextInput
								style={styles.placeholderText}
								value={password}
								placeholder="请输入您的密码"
								textAlign={'center'}
								secureTextEntry={true}
								onChangeText={this._onChangePassword}
							/>
						</View>
						<TouchableOpacity style={styles.resetPwd} onPress={() => Actions.push('Password')}>
							<Text style={{ fontSize: 14, paddingTop: 10, paddingRight: 20, color: Colors.main }}>忘记密码</Text>
						</TouchableOpacity>
					</View> :
					<View style={{ paddingTop: 20, }}>
						<View style={styles.regist}>
							<TextInput
								style={styles.placeholderText}
								value={rInvite}
								placeholder="请输入邀请码"
								textAlign={'center'}
								onChangeText={this._onChangeRInvite}
								clearButtonMode="while-editing"
								returnKeyType="done"
							/>
						</View>
						<View style={[styles.regist, { marginTop: 10 }]}>
							<TextInput
								style={styles.placeholderText}
								value={rMobile}
								placeholder="请输入您的手机号"
								textAlign={'center'}
								keyboardType='number-pad'
								onChangeText={this._onChangeRMobile}
							/>

						</View>
						<View style={{ flexDirection: 'row' }}>
							<View style={[styles.regist, { flex: 1, marginTop: 10, marginRight: 0 }]}>
								<TextInput
									style={[styles.placeholderText]}
									value={rCode}
									placeholder="请输入验证码"
									textAlign={'center'}
									keyboardType='number-pad'
									onChangeText={this._onChangeRCode}
									clearButtonMode="while-editing"
									returnKeyType="done"
								/>
							</View>
							<View style={[{ marginTop: 10, paddingHorizontal: 15 }]}>
								<CountDownButton
									textStyle={{ color: Colors.main, fontSize: 14, fontWeight: 'normal' }}
									style={{ backgroundColor: Colors.White, height: 50, borderRadius: 0 }}
									buttonStyle={{ fontSize: 14, fontWeight: 'normal' }}
									timerCount={60}
									timerTitle={'获取验证码'}
									enable={rMobile.length > 10}
									onClick={(shouldStartCountting) => this.SendVcode(shouldStartCountting)}
									timerEnd={() => { this.setState({ state: '倒计时结束' }) }}
								/>
							</View>
						</View>
						<View style={[styles.regist, { marginTop: 10 }]}>
							<TextInput
								style={styles.placeholderText}
								value={rPassword}
								secureTextEntry={true}
								placeholder="请设置8-16位密码"
								textAlign={'center'}
								onChangeText={this._onChangeRPassword}
								clearButtonMode="while-editing"
								returnKeyType="done"
							/>
						</View>
						<View style={[styles.regist, { marginTop: 10 }]}>
							<TextInput
								style={styles.placeholderText}
								value={rPwd}
								secureTextEntry={true}
								placeholder="请再输入一次密码"
								textAlign={'center'}
								onChangeText={this._onChangeRPwd}
								clearButtonMode="while-editing"
								returnKeyType="done"
							/>
						</View>
					</View>}
				{loginTab === 'login' ?
					<TouchableOpacity style={styles.signInBtn} onPress={this.Login}>
						<Text style={{ padding: 15, color: "#ffffff" }}>登录</Text>
					</TouchableOpacity> :
					<TouchableOpacity style={styles.signInBtn} onPress={this.registe}>
						<Text style={{ padding: 15, color: "#ffffff" }}>注册</Text>
					</TouchableOpacity>}
			</ScrollView>
		);
	}
}
const mapStateToProps = state => ({
	location: state.user.location
});

const mapDispatchToProps = dispatch => ({
	loginSuccess: userInfo => dispatch({ type: LOGIN_SUCCESS, payload: { userInfo } }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
	signInBtn: {
		backgroundColor: Colors.main,
		alignItems: "center",
		marginTop: 50,
		marginHorizontal: 20,
		borderRadius: 25
	},
	loginInput: {
		height: 50,
		marginHorizontal: 20,
		backgroundColor: Colors.backgroundColor,
		borderRadius: 25,
		marginTop: 30,
		alignItems: 'center'
	},
	regist: {
		height: 50,
		backgroundColor: Colors.backgroundColor,
		borderRadius: 25,
		marginTop: 30,
		marginHorizontal: 20,
		alignItems: 'center'
	},
	resetPwd: {
		alignItems: 'flex-end',
	},
	placeholderText: {
		flex: 1,
		fontSize: 14,
	},
	text: {
		fontSize: 16,
		color: '#ffffff',
	},
	imagestyle: {
		width: 80,
		height: 80,
		borderRadius: 5,
	},
	clearIcon: {
		width: 20,
		height: 20
	},
	sanjiao: {
		width: 0,
		height: 0,
		borderWidth: 10,
		borderColor: Colors.transparent1,
		borderBottomColor: '#FFFFFF'
	},
})