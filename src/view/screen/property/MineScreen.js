import React, { Component } from 'react';
import { View, Text, NativeModules, StyleSheet, ScrollView, TouchableWithoutFeedback, Linking, Image, ImageBackground, Platform, TouchableOpacity, StatusBar, Pressable, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
// import { Toast } from 'native-base';
import Toast from '../../common/Toast';
import Cookie from 'cross-cookie';
import { Colors, Metrics } from '../../theme/Index';
import { LOGOUT, UPDATE_USER } from '../../../redux/ActionTypes';
import { AUTH_SECRET, API_PATH, Env, Version } from '../../../config/Index';
import MathFloat from '../../../utils/MathFloat';
import { PROFILE_BAR } from '../../../config/Constants';
import { Send } from '../../../utils/Http';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header, ScrollTopBar } from '../../components/Index';
import LegalCoin from './LegalCoin';
import Currency from './Currency';
import { Coin } from '../../../api';


class MineScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			eyes: true
		};
	}

	/**
		 * 渲染用户收益
		 */
	renderProfile() {
		return (
			<View style={Styles.profile}>
				{PROFILE_BAR.map(item => {
					let { key, title, router } = item;
					let value = (this.props[key] == 'undefined' || this.props[key] == null) ? 0 : this.props[key];
					if (key === 'candyH') {
						value = value.toFixed(2);
					} else if (key === 'candyP' || key === 'candyNum') {
						value = value.toFixed(2);//
					} else if (key === 'balance') {
						value = MathFloat.floor(this.props.userBalanceNormal, 2) + MathFloat.floor(this.props.userBalanceLock, 2);
						value = value.toFixed(2);
					} else {
						value = '¥' + MathFloat.floor(value, 2);
					}
					return (
						<TouchableWithoutFeedback key={key} onPress={() => {
							Actions.push(this.props.logged ? router : 'Login')
						}}>
							<View style={Styles.profileItem}>
								<Text style={[Styles.profileText]}>{value}</Text>
								<Text style={Styles.profileTitle}>{title}</Text>
							</View>
						</TouchableWithoutFeedback>
					)
				})}
			</View>
		)
	}
	/**
	 * 渲染变色版
	 */
	renderGradient() {
		let { avatar, nickname, rcode } = this.props;
		return (
			<LinearGradient colors={[Colors.mainTab, Colors.LightG]} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }} style={Styles.gradient}>
			</LinearGradient>
		)
	}
	onClickLevelBar() {
		if (this.props.logged) {
			Send(`api/system/CopyWriting?type=userlevel`, {}, 'get').then(res => {
				Actions.push('CommonRules', { title: '会员等级', rules: res.data });
			});
		} else {
			Actions.push('Login');
		}
	}
	/**
		 * 渲染用户等级Bar
		 */
	renderLevelBar() {
		let { golds, level } = this.props;
		let LEVEL_CLASS = ["LV0", "LV1", "LV2", "LV3", "LV4", "LV5", "LV6", "LV7", "LV8", "LV9"];
		return (
			<TouchableWithoutFeedback onPress={() => this.onClickLevelBar()}>

			</TouchableWithoutFeedback>
		)
	}
	/**
		 * 交易Bar 点击事件
		 */
	handleTransactionBar(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('businessType')) {
				Actions.push('BusinessPage', { businessType: item['businessType'] });
			} else {
				Actions.push(item['router']);
			}
		} else {
			Actions.push('Login');
		}
	}
	/**
		 * 渲染交易Bar
		 */
	renderTransaction() {
		return (
			<View style={Styles.barContainer}>

			</View>
		)
	}
	/**
		 * 渲染基本信息
		 */
	renderBasicInfo() {
		return (
			<View style={Styles.barContainer}>

			</View>
		)
	}
	/**
		 * 联系QQ客服
		 */
	onClickQQ() {
		Send(`api/system/CopyWriting?type=call_me`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '联系我们', rules: res.data });
		});
	}
	/**
		 * 服务Bar 点击事件
		 */
	handleServiceBar(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('router')) {
				if (item['router'] === 'CommonRules') {
					this.onServicePress()
				} else if (item['router'] === 'qq') {
					this.onClickQQ();
				} else {
					Actions.push(item['router']);
				}
			} else {
				if (item['key'] === '0') this.onClickQQ();
			}
		} else {
			Actions.push('Login');
		}
	}
	onServicePress() {
		Send(`api/system/CopyWriting?type=day_q`, {}, 'get').then(res => {
			Actions.push('CommonRules', { title: '常见问题', rules: res.data });
		});
	}
	/**
		 * 渲染我的服务
		 */
	renderService() {
		let SERVICE_BAR = [
			{ key: "0", title: "联系我们", icon: 'qq', router: 'qq' },
			{ key: "1", title: "常见问题", icon: 'server', router: 'CommonRules' },
		];
		return (
			<View style={Styles.barContainer}>

			</View>
		)
	}
	/**
		 * 服务Bar 点击事件
		 */
	handleServiceYoBang(item) {
		if (this.props.logged) {
			if (item.hasOwnProperty('router')) {
				if (item['router'] === 'CommonRules') {
					this.onServicePress()
				} else {
					Actions.push(item['router']);
				}
			} else {
				if (item['key'] === '0') this.onClickQQ();
			}
		} else {
			Actions.push('Login');
		}
	}
	/**
		 * 渲染
		 */
	renderHeader() {
		const { eyes } = this.state;
		return (
			<View style={{ margin: 10, height: 160 }}>
				<ImageBackground style={{ height: '100%', width: '100%', borderRadius: 10 }} imageStyle={{ borderRadius: 10 }} source={require('../../images/zichanbg1.png')} >
					<View style={{ marginLeft: 20, marginTop: 20, }}><Text style={{ fontSize: 16, color: Colors.White, fontWeight: 'bold' }}>可用NW</Text></View>
					<View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontSize: 30, color: Colors.White, fontWeight: 'bold' }}>{this.props.canUserCoin}</Text></View>
					<View style={{ marginLeft: 20, marginTop: 30 }}><Text style={{ fontSize: 16, color: Colors.White, fontWeight: 'bold' }}>冻结:{this.props.frozenUserCoin}NW</Text></View>
				</ImageBackground>
			</View>
		)
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Header title={'我的资产'} titleStyle={{ color: Colors.titleMainTxt }} isTabBar={true} backgroundColor={Colors.White} />
				{this.renderHeader()}
				<LegalCoin eyes={this.state.eyes} isFocus={true} />
			</View>
		);
	}
}
const mapStateToProps = state => ({
	name: state.user.name,
	isPay: state.user.isPay,
	alipayUid: state.user.alipayUid,
	logged: state.user.logged,
	userId: state.user.id,
	level: state.user.level,
	rcode: state.user.rcode,
	golds: state.user.golds,
	mobile: state.user.mobile,
	nickname: state.user.name,
	avatar: state.user.avatarUrl,
	balance: state.dividend.userBalance,
	candyH: state.user.candyH || 0,
	candyP: state.user.candyP,
	candyNum: state.user.candyNum,
	userBalanceNormal: state.dividend.userBalanceNormal,
	userBalanceLock: state.dividend.userBalanceLock,
	balanceUserCoin: state.user.balanceUserCoin,
	canUserCoin: state.user.canUserCoin,
	frozenUserCoin: state.user.frozenUserCoin,
});
const mapDispatchToProps = dispatch => ({
	logout: () => dispatch({ type: LOGOUT }),
	updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);

const styles = StyleSheet.create({
	headerTab: { width: (Metrics.screenWidth - 70) / 3, borderWidth: 0.5, borderColor: '#84c8fb', height: 30, justifyContent: 'center', alignItems: 'center' },
});