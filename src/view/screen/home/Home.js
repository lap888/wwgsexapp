/*
 * @Author: top.brids 
 * @Date: 2019-12-01 21:55:56 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-06-15 16:40:18
 */

import React, { Component } from 'react';
import {
	View,
	PermissionsAndroid,
	FlatList,
	RefreshControl,
	ActivityIndicator, Text, BackHandler, ToastAndroid, Platform, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Keyboard, StatusBar, SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import WebView from 'react-native-webview';
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from 'react-redux';
import { UPDATE_NOTICE_INFO, UPDATE_USER, UPDATE_NOTICE_STATUS, UPDATE_USER_LOCATION } from '../../../redux/ActionTypes';
import { Colors, Metrics } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import { Toast } from '../../common';
import { ScrollView } from 'react-native-gesture-handler';
import { BoxShadow } from 'react-native-shadow';
import MathFloat from '../../../utils/MathFloat';
import Advert from '../advert/Advert';
import Swiper from 'react-native-swiper';
//new
import moment from 'moment';
import CameraRoll from "@react-native-community/cameraroll";
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import { WEB_PATH } from '../../../config/Index';
import { ReadMore } from '../../components/Index';
import { UserApi } from '../../../api';
import DeviceInfo from 'react-native-device-info';
import SelectTopTab from '../../components/SelectTopTab';
import Timeline from 'react-native-timeline-flatlist'

const TOPTABLIST = [
	{ key: 1, name: '快讯' },
	{ key: 2, name: '新闻' },
	{ key: 3, name: '量化宝' }
]
const defaultImgUrl = "https://reactnative.dev/img/tiny_logo.png";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			city: '加载中...',
			cnyPrice: "",
			amount: '',
			webViewHeight: 300,
			msgData: [],
			oneMsgData: '',
			historyFinishCount: 0,
			historyFinishOrderCount: 0,
			canUserCotton: 0,
			canUserCottonCoin: 0,//可用MBM
			sysMinPrice: 10,
			sysMaxPrice: 15,
			todayBuyCount: 0,
			noticeModalVisible: true,
			todayBuyOrderCount: 0,
			sellMinPrice: 0,
			sellMaxPrice: 0,
			minAmount: 1,
			maxAmount: 200,
			coinTitle: 'fabi',
			selectBar: 'BUY',
			modalVisible: false,
			tradePwd: '',
			optionLoading: false,
			orders: [{ "id": 0, "amount": 52, "price": 77.25519005908292, "type": 1, "step": 0.052674127229538154 }, { "id": 1, "amount": 56, "price": 85.94899817444046, "type": 1, "step": 0.05650663169608101 }, { "id": 2, "amount": 4, "price": 77.98335629005089, "type": 1, "step": 0.004628387441109072 }, { "id": 3, "amount": 2, "price": 82.19355423831931, "type": 1, "step": 0.002031395271708325 }, { "id": 4, "amount": 74, "price": 63.13401228863751, "type": 1, "step": 0.0741400053064545 }, { "id": 5, "amount": 55, "price": 79.76465078127677, "type": 2, "step": 0.05537814579865057 }, { "id": 6, "amount": 34, "price": 48.66115938835811, "type": 2, "step": 0.034537650347311974 }, { "id": 7, "amount": 91, "price": 51.28597124200021, "type": 2, "step": 0.09139984608697496 }, { "id": 8, "amount": 84, "price": 1.9755878423038498, "type": 2, "step": 0.0842190949786397 }, { "id": 9, "amount": 48, "price": 5.493288575241406, "type": 2, "step": 0.0480386454811379 }],

			isRefreshing: false,
			waiting: false,
			data: [],
			section: 1,
			pers: 12,
			id: 0,
			deviceUid: DeviceInfo.getUniqueId(),
			selectTap: 1,
			modalObtainedBuyListVisible: false,
			rowData: {},
			qrcodeUrl: `${WEB_PATH}?code=${this.props.code == "0" ? this.props.mobile : this.props.code}`,
		};
	}

	componentDidMount = () => {
		if (Platform.OS == "android") {
			BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
		}
		this.getTradeTotal();
		this.onRefresh();
		this.reloadMessage();
		//timer:todo
	};
	timerFun = () => {
		this.timer = setInterval(() => {
			var _datas = [];
			var i = 0;
			for (let index = 0; index < 5; index++) {
				var _data = {};
				var amount = this.randomFun('int', this.state.minAmount, this.state.maxAmount);
				var price = this.randomFun('float', this.state.sysMinPrice, this.state.sysMaxPrice);
				_data.id = i;
				_data.amount = amount;
				_data.price = price;
				_data.type = 1;
				_data.step = amount / 1000;
				_datas.push(_data);
				i++;
			}
			for (let index = 0; index < 5; index++) {
				var _data = {};
				var amount = this.randomFun('int', this.state.minAmount, this.state.maxAmount);
				var price = this.randomFun('float', this.state.sysMinPrice, this.state.sysMaxPrice);
				_data.id = i;
				_data.amount = parseInt(amount);
				_data.price = price;
				_data.type = 2;
				_data.step = amount / 1000;
				_datas.push(_data);
				i++;
			}
			this.setState({ orders: _datas });
		}, 3000);
	}
	webViewLoadedEnd = () => {
		this.webview.injectJavaScript(`
                const height = document.body.clientHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));
            `);
	}
	/**
	 * 加载系统消息
	 */
	reloadMessage() {
		let that = this;
		let params = {
			pageIndex: 1,
			type: 0,
		};
		Send("api/system/notices", params).then(res => {
			if (res.code == 200) {
				that.setState({
					msgData: res.data,
					oneMsgData: res.data[0],
				})
			} else {
				that.setState({
					msgData: [],
				})
			}
		});
	}
	onMessage = (e) => {
		const data = JSON.parse(e.nativeEvent.data);
		if (data.height) {
			this.setState({
				webViewHeight: data.height < 500 ? 500 : data.height
			});
		}
	}

	getTradeTotal = () => {
		Send("api/Trade/GetTradeTotal", {}, 'GET').then(res => {
			if (res.code == 200) {
				this.setState({
					historyFinishCount: res.data.historyFinishCount,
					historyFinishOrderCount: res.data.historyFinishOrderCount,
					canUserCottonCoin: res.data.canUserCottonCoin,
					canUserCotton: res.data.canUserCotton,
					sysMinPrice: res.data.sysMinPrice,
					sysMaxPrice: res.data.sysMaxPrice,
					todayBuyCount: res.data.todayBuyCount,
					todayBuyOrderCount: res.data.todayBuyOrderCount
				})
			} else {
				Toast.tipBottom(res.message)
			}
		});
	}
	randomFun = (method, min, max) => {
		if (method === 'int') {
			return parseInt(Math.random() * (max - min + 1) + min, 10);
		} else {
			return Math.random() * (max - min) + min;
		}
	}

	componentWillUnmount() {
		if (Platform.OS == "android") {
			BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
		}
		this.timer && clearTimeout(this.timer);
	}

	onBackAndroid = () => {
		if (Actions.currentScene != "Index") {
			Actions.pop();
			return true;
		} else {
			let time = new Date();
			this.lastBackPressed = this.thisBackPressed;
			this.thisBackPressed = time.getTime();
			if (this.lastBackPressed && this.lastBackPressed + 2000 >= this.thisBackPressed) {
				BackHandler.exitApp();
				return false;
			}
			ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
			return true;
		}
	};
	/**
	 * 获取用户户数据
	 */
	initData() {
		var that = this;
		Send("api/system/InitInfo", {}, 'GET').then(res => {
			if (res.code == 200) {
				that.props.updateUserInfo(res.data)
			} else {
				Toast.tipBottom(res.message)
			}
		});
	}
	onChangeCnyPrice = (i) => {
		this.setState({ cnyPrice: i });
	}
	onChangeAmount = (i) => {
		this.setState({ amount: i });
	}
	/**
	 * 获取发布买单总额
	 */
	getBuyLumpSum(flag) {
		let { amount, cnyPrice } = this.state;
		if (cnyPrice === 0 || !amount || !cnyPrice) {
			return "--";
		} else {
			if (flag == '1') {
				return (amount * cnyPrice).toFixed(4);
			} else {
				return (amount * cnyPrice * 7).toFixed(4);
			}
		}
	}
	/**
	 * 取消发布买单订单
	 */
	canclePublishBuyTransaction() {
		this.setState({ modalVisible: false, tradePwd: "" });
	}
	/**
	* 确定发布买单订单
	*/
	confirmPublishBuyTransaction() {
		Keyboard.dismiss();
		let { amount, cnyPrice, tradePwd } = this.state;
		if (cnyPrice <= 0) {
			Toast.tipBottom('请输入单价...');
			return;
		}
		if (cnyPrice < this.state.sysMinPrice || cnyPrice > this.state.sysMaxPrice) {
			Toast.tipBottom('挂单价不在指导价区间...');
			return;
		}
		if (amount <= 0) {
			Toast.tipBottom('请输入数量...');
			return;
		}
		if (amount < this.state.minAmount || amount > this.state.maxAmount) {
			Toast.tipBottom('挂单数量不在指导价区间...');
			return;
		}
		if (tradePwd.trim() == "") {
			Toast.tipBottom('交易密码不能为空...');
			return;
		}
		var that = this;
		if (!that.state.optionLoading) that.setState({ optionLoading: true });
		if (this.state.selectBar === 'SELL') {
			Send("api/Trade/StartSell", { amount, price: cnyPrice, tradePwd: tradePwd, locationX: 0, locationY: 0, userProvince: 0, userCity: 0, userArea: 0, cityCode: 0, areaCode: 0 }).
				then(res => {
					if (res.code == 200) {
						that.setState({ modalVisible: false, tradePwd: "" });
					}
					Toast.tipBottom(res.code == 200 ? "卖单发布成功" : res.message)
					// 关闭发布状态
					that.setState({ optionLoading: false });
				});
		}
		if (that.state.selectBar === 'BUY') {
			Send("api/Trade/StartBuy", { amount, price: cnyPrice, tradePwd: tradePwd, locationX: 0, locationY: 0, userProvince: 0, userCity: 0, userArea: 0, cityCode: 0, areaCode: 0 }).then(res => {
				if (res.code == 200) {
					that.setState({ modalVisible: false, tradePwd: "" });
				}
				Toast.tipBottom(res.code == 200 ? "买单发布成功" : res.message)
				// 关闭发布状态
				that.setState({ optionLoading: false });
			});
		}
	}
	/**
	   * 渲染发布买单Form表单
	   */
	renderModalPublishBuyList() {
		let { modalVisible, amount, selectBar, tradePwd, sysMinPrice, sysMaxPrice, sellMinPrice, sellMaxPrice, optionLoading } = this.state;
		return (
			<Modal animationType='slide' visible={modalVisible} transparent onRequestClose={() => { }}>
				<View style={{ flex: 1, backgroundColor: 'transparent' }}>
					<View style={Styles.modalBody}>
						<View style={{ marginTop: 30, marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={Styles.publishBuy}>{selectBar === 'SELL' ? '我要卖' : '我要买'}</Text>
						</View>
						<View style={Styles.modalBodyPrice}>
							<View style={Styles.modalBodyLeft}>
								<Text style={Styles.price}>单价</Text>
								{selectBar === 'SELL' && <Text style={Styles.price}>{`${this.state.coinTitle == 'bibi' ? '$' : '￥'}(${sellMinPrice}—${sellMaxPrice})`}</Text>}
								{selectBar === 'BUY' && <Text style={Styles.price}>{`${this.state.coinTitle == 'bibi' ? '$' : '￥'}(${sysMinPrice}—${sysMaxPrice})`}</Text>}
							</View>
							<View style={Styles.modalBodyRight}>
								<View style={Styles.textInputContainer}>
									<TextInput
										style={Styles.publishTextInput}
										placeholder="请输入交易价格"
										placeholderTextColor={Colors.White}
										underlineColorAndroid="transparent"
										keyboardType="numeric"
										value={`${this.state.cnyPrice}`}
										onChangeText={cnyPrice => this.setState({ cnyPrice })}
										returnKeyType="next"
										onSubmitEditing={() => this.refs.buyAmount.focus()}
									/>
								</View>
							</View>
						</View>
						<View style={Styles.modalBodyPrice}>
							<View style={Styles.modalBodyLeft}>
								<Text style={Styles.price}>数量</Text>
							</View>
							<View style={Styles.modalBodyRight}>
								<View style={Styles.textInputContainer}>
									<TextInput ref="buyAmount" style={Styles.publishTextInput} placeholder="请输入交易数量" placeholderTextColor={Colors.White} underlineColorAndroid="transparent" keyboardType="numeric"
										value={amount}
										onChangeText={amount => this.setState({ amount })}
										returnKeyType="next"
										onSubmitEditing={() => this.refs.buyTradePwd.focus()}
									/>
								</View>
							</View>
						</View>
						<View style={Styles.modalBodyPrice}>
							<View style={Styles.modalBodyLeft}>
								<Text style={Styles.price}>总价{`${this.state.coinTitle == 'bibi' ? '$' : '￥'}`}</Text>
							</View>
							<View style={Styles.modalBodyRight}>
								<View style={[Styles.textInputContainer, { justifyContent: 'center' }]}>
									<Text style={Styles.price}>{this.getBuyLumpSum('1')}</Text>
								</View>
							</View>
						</View>
						{this.state.coinTitle == 'bibi' ?
							<View style={Styles.modalBodyPrice}>
								<View style={Styles.modalBodyLeft}>
									<Text style={Styles.price}>折合人民币≈</Text>
								</View>
								<View style={Styles.modalBodyRight}>
									<View style={[Styles.textInputContainer, { justifyContent: 'center', backgroundColor: Colors.exchangeInput }]}>
										<Text style={Styles.price}>{this.getBuyLumpSum('2')}</Text>
									</View>
								</View>
							</View>
							:
							<View></View>}
						<View style={Styles.modalBodyPrice}>
							<View style={Styles.modalBodyLeft}>
								<Text style={Styles.price}>交易密码</Text>
							</View>
							<View style={Styles.modalBodyRight}>
								<View style={Styles.textInputContainer}>
									<TextInput ref="buyTradePwd" style={Styles.publishTextInput} secureTextEntry placeholder="请输入交易密码" placeholderTextColor={Colors.White} underlineColorAndroid="transparent" keyboardType="numeric"
										value={tradePwd}
										onChangeText={tradePwd => this.setState({ tradePwd })}
										returnKeyType="done"
										onSubmitEditing={() => this.confirmPublishBuyTransaction()}
									/>
								</View>
							</View>
						</View>
						<View style={Styles.modalFooter}>
							<TouchableOpacity disabled={optionLoading} onPress={() => this.canclePublishBuyTransaction()}>
								<View style={[Styles.publishConfirm, { backgroundColor: Colors.exchangeInput }]}>
									<Text style={Styles.publishConfirmText}>取消</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity disabled={optionLoading} onPress={() => this.confirmPublishBuyTransaction()}>
								<View style={[Styles.publishConfirm, { backgroundColor: Colors.mainTab }]}>
									<Text style={Styles.publishConfirmText}>{optionLoading ? '进行中...' : '确定'}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<View style={Styles.modalHeader} />
				</View>
			</Modal >
		)
	}
	/**
	 * 点击发布事件
	 */
	openPublishModal = () => {
		if (!this.props.userId) {
			Actions.push("Login");
			return;
		}
		// if (this.props.auditState !== 2) {
		//   Toast.tipBottom('请去实名...');
		//   return;
		// }
		let { amount, cnyPrice } = this.state;
		if (cnyPrice <= 0) {
			Toast.tipBottom('请输入单价...');
			return;
		}
		if (cnyPrice < this.state.sysMinPrice || cnyPrice > this.state.sysMaxPrice) {
			Toast.tipBottom('挂单价不在指导价区间...');
			return;
		}
		if (amount <= 0) {
			Toast.tipBottom('请输入数量...');
			return;
		}
		if (amount < this.state.minAmount || amount > this.state.maxAmount) {
			Toast.tipBottom('挂单数量不在指导价区间...');
			return;
		}

		this.setState({ modalVisible: true });
	}
	goExchange() {
		if (!this.props.userId) {
			Actions.push("Login");
			return;
		}
		// Actions.push("Information");
		Advert.rewardVideo((res) => {
			//挖矿
			if (res) {
				Send("api/Miner/DigMine", {}, 'get').
					then(res => {
						if (res.code == 200) {
							Toast.tipBottom('领取成功...', 10000)
						} else {
							Toast.tipBottom(res.message)
						}

					});
			}
		});

	}

	renderBroadcast() {
		return (
			<TouchableOpacity style={[Styles.bordercast, { marginHorizontal: 10 }]} onPress={() => Actions.Message({ idx: 0 })}>
				<Text style={{ color: Colors.main }}>公告</Text>
				<Icon name="ios-volume-medium" color={Colors.main} size={20} />
				<Swiper
					style={{ marginLeft: 10 }}
					key={this.state.msgData.length}
					height={20}
					loop={true}
					removeClippedSubviews={false}
					horizontal={true}
					autoplay={true}
					autoplayTimeout={20}
					showsPagination={false}
					showsButtons={false}
				>
					{this.state.msgData.map((item, key) =>
						<Text key={key} style={{ fontSize: 14, lineHeight: 21, color: Colors.grayFont }}>{item.title}</Text>
					)}
				</Swiper>
			</TouchableOpacity>
		)
	}
	/**
	 * 渲染系统公告Modal
	 */
	renderNoticeModal() {
		let _html = `<!DOCTYPE html>
        <html>
        <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <body>
        ${this.state.oneMsgData.content}
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
			<Modal animationType='slide' transparent visible={this.state.noticeModalVisible} onRequestClose={() => { }}>
				<View style={{ flex: 1, backgroundColor: "black", opacity: 0.3 }} />
				<View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ width: 280, height: 350, borderRadius: 10, backgroundColor: '#FFFFFF' }}>
						<Text style={{ textAlign: 'center', fontSize: 16, color: Colors.main, fontWeight: 'bold', marginTop: 20, }}>{this.state.oneMsgData.title}</Text>
						<Text style={{ fontSize: 12, padding: 10, paddingLeft: 15, color: "gray" }}>
							发布时间: {this.state.oneMsgData.ceratedAt}
						</Text>
						<ScrollView contentContainerStyle={{ padding: 5, paddingLeft: 5, paddingRight: 5 }}>
							<View style={{ height: this.state.webViewHeight, }}>
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
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
							<TouchableOpacity onPress={() => this.setState({ noticeModalVisible: false })}>
								<View style={{ marginTop: 6, height: 30, width: 100, marginRight: 5, borderRadius: 10, backgroundColor: Colors.main, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ fontSize: 14, color: Colors.C8 }}>关闭</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
	buyRender = () => {
		const shadowOpt = {
			height: 200,
			width: Metrics.screenWidth - 20,
			color: Colors.black,
			border: 5,
			radius: 5,
			opacity: 0.1,
			x: 1,
			y: 2,
			style: { marginVertical: 5, marginTop: -20, marginHorizontal: 10, }
		}
		return (
			<ScrollView style={Styles.container}>
				<View style={Styles.wiper}>
					<Image style={Styles.banner} source={require('../../images/homeTitle.png')} />
				</View>
				<BoxShadow setting={shadowOpt}>
					<View style={Styles.options}>
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, }}><Icon name="md-server-sharp" color={Colors.main} size={22} /><Text style={{ fontSize: 16 }}>历史成交总额</Text></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 10 }}><Text style={{ fontSize: 16, marginLeft: 5 }}>{this.state.historyFinishCount} NW</Text></View>
							</View>
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, }}><Icon name="md-server-sharp" color={Colors.main} size={22} /><Text style={{ fontSize: 16, marginLeft: 5 }}>历史成交量</Text></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 10 }}><Text style={{ fontSize: 16 }}>{this.state.historyFinishOrderCount}笔</Text></View>
							</View>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, }}><Icon name="md-server-sharp" color={Colors.main} size={22} /><Text style={{ fontSize: 16 }}>今日需求总额</Text></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 10 }}><Text style={{ fontSize: 16, marginLeft: 5 }}>{this.state.todayBuyCount} NW</Text></View>
							</View>
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }}>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, }}><Icon name="md-server-sharp" color={Colors.main} size={22} /><Text style={{ fontSize: 16, marginLeft: 5 }}>今日需求量</Text></View>
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 10 }}><Text style={{ fontSize: 16 }}>{this.state.todayBuyOrderCount} 笔</Text></View>
							</View>
						</View>
						<View style={{ flex: 1 }}>
							<TouchableOpacity style={{ height: 40, paddingHorizontal: 50, marginTop: 10, borderRadius: 20 }} onPress={() => { this.goExchange() }}>
								<LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 5 }}>
									<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
										<Text style={{ fontSize: 15, color: Colors.White, }}>领取量化宝收益</Text>
									</View>
								</LinearGradient>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1 }}>
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ fontSize: 12, fontWeight: 'bold', }}>今日产出:</Text>
								<Text style={{ fontSize: 18, color: Colors.main, fontWeight: 'bold', }}>{this.props.dayNum}</Text>
								<Text style={{ fontSize: 12, fontWeight: 'bold', }}> NW</Text>
							</View>
						</View>
					</View>
				</BoxShadow>
				{this.renderBroadcast()}
				<View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: Colors.LightGrey, borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: Colors.LightGrey, paddingVertical: 10 }}>
					<TouchableOpacity onPress={() => {
						Actions.push('Otc')
					}}>
						<LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 15 }}>
							<Text style={{ color: Colors.White, fontSize: 16, paddingHorizontal: 15, paddingVertical: 5 }}>快捷购买</Text>
						</LinearGradient>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {
						Actions.push('Substitution', { canUserCotton: this.state.canUserCottonCoin })
					}}>
						<LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 15 }}>
							<Text style={{ color: Colors.White, fontSize: 16, paddingHorizontal: 15, paddingVertical: 5 }}>兑换Gas</Text>
						</LinearGradient>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => {
						Actions.push('Otc')
					}}>
						<LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 25 }}>
							<Text style={{ color: Colors.White, fontSize: 16, paddingHorizontal: 15, paddingVertical: 5 }}>交易中心</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1, flexDirection: 'row', marginBottom: 50, }}>
					{/* 求购单列 */}
					<View style={{ flex: 1, }}>
						<View>
							<View style={{ flex: 1, padding: 10 }}>
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
									<Text>参考价格</Text>
									<Text>{`${this.state.sysMinPrice}-${this.state.sysMaxPrice}`}</Text>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, borderWidth: 1, borderColor: Colors.LightGrey, paddingHorizontal: 5, borderRadius: 5, }}>
									<View style={{ height: 50, flex: 1 }}>
										<TextInput
											value={this.state.cnyPrice}
											style={Styles.placeholderText}
											placeholder="价格"
											keyboardType="numeric"
											onChangeText={this.onChangeCnyPrice}
											clearButtonMode="while-editing"
											returnKeyType="done"
											onSubmitEditing={() => this.Login()} />
									</View>
									<Text style={{ color: Colors.black, fontWeight: 'bold', }}>CNY</Text>
								</View>
							</View>

							<View style={{ flex: 1, padding: 10 }}>
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
									<Text>数量</Text>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, borderWidth: 1, borderColor: Colors.LightGrey, paddingHorizontal: 5, borderRadius: 5, }}>
									<View style={{ height: 50, flex: 1 }}>
										<TextInput
											value={this.state.amount}
											style={Styles.placeholderText}
											placeholder={`数量(${this.state.minAmount}-${this.state.maxAmount})`}
											keyboardType="numeric"
											onChangeText={this.onChangeAmount}
											clearButtonMode="while-editing"
											returnKeyType="done"
											onSubmitEditing={() => this.Login()} />
									</View>
									<Text style={{ color: Colors.black, fontWeight: 'bold', }}>NW</Text>
								</View>
							</View>
							<View style={{ flex: 1 }}>
								{/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
										<Text>可用</Text>
										<Text>{`${this.state.canUserCottonCoin} NW`}</Text>
									</View> */}
								<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
									<Text style={{ fontWeight: 'bold', }}>交易额</Text>
									<Text style={{ fontWeight: 'bold', }}>{`${this.state.cnyPrice * this.state.amount} CNY`}</Text>
								</View>
							</View>
							<View style={{ flex: 1 }}>
								<TouchableOpacity style={{ height: 40, paddingHorizontal: 50, marginTop: 40, borderRadius: 20 }} onPress={this.openPublishModal}>
									<LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 5 }}>
										<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
											<Text style={{ fontSize: 15, color: Colors.White, }}>求 购</Text>
										</View>
									</LinearGradient>
								</TouchableOpacity>
							</View>
						</View>
						<View style={{ flex: 1 }}></View>
					</View>
					{/* 求购单列 */}

					<View style={{ flex: 1, }}>
						<View style={{ flexDirection: 'row', paddingHorizontal: 10, marginTop: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>
							<Text style={{ fontWeight: 'bold', }}>数量</Text>
							<Text style={{ fontWeight: 'bold', }}>价格  </Text>
						</View>
						{this.state.orders.map(item => {
							return (
								<View key={item.id}>
									<View style={Styles.jidubg}>
										<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, }}>
											<Text style={{ fontWeight: 'bold', color: item.type == 1 ? Colors.exRed : Colors.exGreen }}>{MathFloat.floor(item.amount, 4).toFixed(4)}</Text>
											<Text style={{ fontWeight: 'bold', color: item.type == 1 ? Colors.exRed : Colors.exGreen }}>{MathFloat.floor(item.price, 4)}</Text>
										</View>
									</View>
									<View style={[Styles.jidu, { width: (Metrics.screenWidth / 2) * item.step, backgroundColor: item.type == 1 ? Colors.exRed : Colors.exGreen }]} />
								</View>
							);
						})}
					</View>
				</View>
			</ScrollView>
		)
	}
	//==Add==//

	onRefresh = () => {
		this.setState({ isRefreshing: true, id: 0 }, () => {
			UserApi.recommendNews(`?section=${this.state.section}&pers=${this.state.pers}&id=0`, this.state.deviceUid).then(res => {
				this.setState({
					data: res.data,
					isRefreshing: false,
					id: res.data[res.data.length - 1].id
				});
			})
		});
	}

	onEndReached = () => {
		if (!this.state.waiting) {
			this.setState({ waiting: true });
			UserApi.recommendNews(`?section=${this.state.section}&pers=${this.state.pers}&id=${this.state.id}`, this.state.deviceUid).then(res => {
				this.setState({
					data: this.state.data.concat(res.data),
					waiting: false,
					id: res.data[res.data.length - 1].id
				});
			})
		}
	}

	renderFooter = () => {
		if (this.state.waiting) {
			return <ActivityIndicator />;
		} else {
			return <Text>~</Text>;
		}
	}
	renderDetail = (rowData, sectionID, rowID) => {
		let time = <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
			<Text style={[Styles.descriptionContainer]}>{moment(rowData.created_at).format('YYYY-MM-DD hh:mm:ss')}</Text>
			<TouchableOpacity style={{ flexDirection: 'row', marginRight: 20 }} onPress={() => {
				this.setState({ modalObtainedBuyListVisible: true, rowData: rowData });
			}}><Icon name="arrow-redo-sharp" style={{ fontSize: 16, color: Colors.main }} /><Text style={[Styles.share]}>分享</Text>
			</TouchableOpacity>
		</View>
		let title = <Text style={[Styles.title]}>{rowData.title}</Text>

		var desc = null;
		if (rowData.content != '' && rowData.content != undefined && rowData.content != null) {
			desc = <View style={Styles.descriptionContainer}><ReadMore numberOfLines={3}><Text style={[Styles.textDescription]}>{rowData.content}</Text></ReadMore></View>
		}
		return (
			<View style={{ flex: 1 }}>
				{time}
				{title}
				{desc}
			</View>
		)
	}
	selectTab = (item) => {
		this.setState({ selectTap: item.key, section: item.key }, () => {
			if (item.key != 3) {
				this.onRefresh()

				this.timer && clearTimeout(this.timer)
			} else {
				this.timerFun()
			}
			this.getTradeTotal()
		})
	}
	/**
	 * 取消分享
	 */
	cancleObtainedBuyTransaction() {
		this.setState({ modalObtainedBuyListVisible: false });
	}
	/**
	 * 保存
	 */
	confirmObtainedBuyTransaction() {
		this.saveImage()
	}
	/**
	 * 
	 * @param {*} num 星期
	 * @returns 
	 */
	getWeek = (num) => {
		let week = '';
		if (num == 1) {
			week = '星期一'
		} else if (num == 2) {
			week = '星期二'
		} else if (num == 3) {
			week = '星期三'
		} else if (num == 4) {
			week = '星期四'
		} else if (num == 5) {
			week = '星期五'
		} else if (num == 6) {
			week = '星期六'
		} else {
			week = '星期日'
		}
		return week;
	}

	/**
	 * 渲染二维码
	 */
	renderQRCode() {
		let invitCode = this.props.rcode == "0" ? this.props.mobile : this.props.rcode;
		let qrcodeUrl = `${WEB_PATH}?code=${invitCode}`;
		return (
			<View style={{ marginTop: 20, justifyContent: 'center', alignSelf: 'center' }}>
				<QRCode
					value={qrcodeUrl}
					logoSize={20}
					size={100}
					logoMargin={5}
					logoBorderRadius={10}
					logo={require('../../images/logo.png')}
				/>
			</View>
		)
	}
	saveImage = async () => {
		if (Platform.OS == 'ios') {
			this.snapshot()
		} else {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					{
						title: "NW量化想要使用您的相册存储权限",
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
				this.setState({ modalObtainedBuyListVisible: false });
			}).catch((err) => console.warn('err', err))
	}
	/**
	* 渲染分享
	*/
	renderModalCancleBuyList() {
		let { modalObtainedBuyListVisible } = this.state;
		return (
			<Modal animationType='slide' visible={modalObtainedBuyListVisible} transparent onRequestClose={() => { }}>
				<View style={{ flex: 1, backgroundColor: 'transparent' }}>
					<View style={Styles.modalBody1}>
						<View style={{ flex: 1 }}>
							<ScrollView contentContainerStyle={{ marginHorizontal: 20, marginTop: 20 }}>
								<View ref="shareViewShot" style={{ alignItems: 'center', justifyContent: 'center', width: Metrics.screenWidth - 50, backgroundColor: Colors.main, borderRadius: 5 }}>
									<Image style={{ width: 60, height: 40, marginTop: 30 }} source={require('../../images/before_nwlh_logo.png')}></Image>
									<Text style={{ fontSize: 40, marginTop: 20, fontWeight: 'bold', color: Colors.White }}>{'新闻快讯'}</Text>
									<Text style={{ color: Colors.White, marginTop: 10 }}>{moment(this.state.rowData.created_at).format('YYYY-MM-DD hh:mm')} {this.getWeek(moment(this.state.rowData.created_at).format('d'))}</Text>
									<View style={{ padding: 10, margin: 10, backgroundColor: Colors.White, borderRadius: 5, paddingBottom: 30, marginBottom: 30 }}>
										<Text style={{ color: Colors.main, marginBottom: 10, fontSize: 20, }}>{this.state.rowData.title}</Text>
										<Text style={{ color: Colors.main, marginBottom: 10, fontSize: 16, }}>{moment(this.state.rowData.created_at).format('YYYY-MM-DD hh:mm:ss')}</Text>
										<Text>{this.state.rowData.content}</Text>
										<View style={{ marginVertical: 20, alignItems: 'center' }}>
											{this.renderQRCode()}
											<Text style={{ color: Colors.main, marginTop: 20, fontSize: 16, }}>N W 量化您的加密货币管理工具</Text>
										</View>
									</View>
								</View>
							</ScrollView>
						</View>
					</View>
					<View style={Styles.modalHeader1}>
						<View style={Styles.modalFooter1}>
							<Text style={{ color: Colors.main, fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>分享</Text>
							<TouchableOpacity onPress={() => this.confirmObtainedBuyTransaction()}>
								<View style={{ alignItems: 'center' }}>
									<Icon name="arrow-down-circle-sharp" style={Styles.actionButtonIcon} />
									<Text style={{ color: Colors.lineColor }}>保存图片</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.cancleObtainedBuyTransaction()}>
								<View style={[Styles.publishConfirm1, { backgroundColor: Colors.Gainsboro, marginTop: 10 }]}>
									<Text style={Styles.publishConfirmText1}>取消</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		)
	}
	onPressArticleDetail = (id) => {
		UserApi.articleDetail(`?id=${id}`, this.state.deviceUid, id).then(res => {
			if (res.status == 10000) {
				Actions.push('NewDetail', { TDContent: res.data.content, title: res.data.title })
			} else {
				Toast.tipBottom(res.message)
			}
		});
	}
	renderItem = ({ item }) => {
		return (
			<TouchableOpacity onPress={() => {
				this.onPressArticleDetail(item.id)
			}} key={item.id.toString()} style={Styles.newsItem}>
				<View style={{ flex: 1, alignItems: 'flex-start', marginRight: 10 }}>
					<Text style={Styles.title}>{item.title}</Text>
					<Text style={Styles.descriptionContainer}>{moment(item.created_at).format('YYYY-MM-DD hh:mm:ss')}</Text>
				</View>
				<View><Image source={{ uri: item.cover == '' || item.cover == undefined ? defaultImgUrl : item.cover }} style={{ width: 90, height: 60 }}></Image></View>
			</TouchableOpacity>
		)
	}
	//==Add End//
	render() {
		return (
			<SafeAreaView style={Styles.container}>
				<StatusBar translucent={false} backgroundColor={Colors.White} barStyle='dark-content' />
				<SelectTopTab list={TOPTABLIST} onPress={this.selectTab} />
				{this.state.selectTap == 1 && <Timeline
					style={Styles.list}
					data={this.state.data}
					circleSize={10}
					circleColor={Colors.main}
					lineColor={Colors.main}
					showTime={false}
					timeContainerStyle={{ minWidth: 52, marginTop: 5 }}
					timeStyle={{ textAlign: 'left', color: Colors.main }}
					descriptionStyle={{ color: 'gray' }}
					options={{
						refreshControl: (
							<RefreshControl
								refreshing={this.state.isRefreshing}
								onRefresh={this.onRefresh}
							/>
						),
						renderFooter: this.renderFooter,
						onEndReached: this.onEndReached
					}}
					renderDetail={this.renderDetail}
					innerCircle={'dot'}
				/>}
				{/* 快讯 */}
				{this.state.selectTap == 2 && <View style={{ flex: 1 }}>
					<FlatList
						data={this.state.data}
						renderItem={this.renderItem}
						keyExtractor={item => item.id}
						refreshing={this.state.isRefreshing}
						onRefresh={this.onRefresh}
						onEndReachedThreshold={0.2}
						onEndReached={this.onEndReached}
					/>
				</View>}
				{this.state.selectTap == 3 && this.buyRender()}

				{this.renderModalCancleBuyList()}
				{this.renderModalPublishBuyList()}
				{this.renderNoticeModal()}
			</SafeAreaView>
		);
	}
}
const mapStateToProps = state => ({
	logged: state.user.logged,
	userId: state.user.id,
	mobile: state.user.mobile,
	level: state.user.level,
	candyH: state.user.candyH || 0,
	candyP: state.user.candyP,
	candyNum: state.user.candyNum,
	location: state.user.location,
	warnVersion: state.router.warnVersion,
	isReaded: state.notice.isReaded,
	id: state.notice.id,
	uuid: state.user.uuid,
	isDoTask: state.user.isDoTask,
	dayNum: state.user.dayNum,
	cotton: state.user.cotton,
	level: state.user.level,
	title: state.notice.title,
	content: state.notice.content,
	userBalanceNormal: state.user.userBalanceNormal,
	userBalanceLock: state.user.userBalanceLock,
	//add
	name: state.user.name,
	avatarUrl: state.user.avatarUrl,
	rcode: state.user.rcode
});

const mapDispatchToProps = dispatch => ({
	updateNoticeInfo: ({ id, title, content }) => dispatch({ type: UPDATE_NOTICE_INFO, payload: { id, title, content } }),
	updateNoticeStatus: () => dispatch({ type: UPDATE_NOTICE_STATUS }),
	updateUserLocatin: (location) => dispatch({ type: UPDATE_USER_LOCATION, payload: { location } }),
	updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })

});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
const Styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.White },
	wiper: { height: 200, overflow: "hidden" },
	bordercast: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		overflow: "hidden"
	},
	banner: { height: '100%', width: '100%' },
	options: {
		height: 200,
		width: Metrics.screenWidth - 20,
		borderRadius: 5,
		flexWrap: 'wrap',
		backgroundColor: Colors.White
	},
	placeholderText: {
		height: 50,
		fontSize: 16,
		flex: 1,
		fontWeight: 'bold',
	},
	jidubg: {
		height: 30,
	},
	jidu: {
		position: 'absolute',
		height: 30,
		backgroundColor: Colors.activeTintColor,
		opacity: 0.3,
		right: 0
	},
	modalHeader: { flex: 1, opacity: 0.6, backgroundColor: '#FFFFFF' },
	price: { fontSize: 14, color: Colors.White },
	modalBody: { paddingTop: Metrics.PADDING_BOTTOM, flexDirection: "column", justifyContent: 'flex-end', backgroundColor: Colors.exchangeBg, width: Metrics.screenWidth },
	publishBuy: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
	modalBodyPrice: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
	modalBodyLeft: { width: Metrics.screenWidth * 0.3, alignItems: 'flex-end' },
	modalBodyRight: { width: Metrics.screenWidth * 0.7, alignItems: 'flex-start' },
	textInputContainer: { marginLeft: 10, paddingLeft: 8, width: Metrics.screenWidth * 0.7 * 0.8, height: 40, borderRadius: 6, backgroundColor: Colors.exchangeInput },
	publishTextInput: { flex: 1, color: Colors.White },
	modalFooter: { flexDirection: 'row', marginTop: 20 },
	publishConfirm: { height: 60, width: Metrics.screenWidth * 0.5, justifyContent: 'center', alignItems: 'center' },
	publishConfirmText: { fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' },
	//add

	list: {
		flex: 1,
		marginTop: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	share: {
		fontSize: 14,
		fontWeight: 'bold',
		color: Colors.main
	},
	descriptionContainer: {
		flexDirection: 'row',
		paddingRight: 50
	},
	textDescription: {
		marginLeft: 10,
		color: 'gray'
	},
	modalHeader1: { flex: 1, backgroundColor: '#FFFFFF' },
	modalBody1: { flex: 3, opacity: 0.9, paddingTop: Metrics.PADDING_BOTTOM, flexDirection: "column", justifyContent: 'flex-end', backgroundColor: Colors.exchangeBg },
	modalFooter1: { marginTop: 1, alignItems: 'center' },
	publishConfirm1: { height: 40, width: Metrics.screenWidth * 0.6, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
	publishConfirmText1: { fontSize: 16, color: Colors.C12, fontWeight: 'bold' },
	image: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center"
	},
	actionButtonIcon: {
		fontSize: 40,
		height: 40,
		color: Colors.Alipay,
	},
	newsItem: {
		// backgroundColor: Colors.main,
		borderBottomWidth: 1,
		borderColor: Colors.Gainsboro,
		padding: 10,
		marginVertical: 5,
		marginHorizontal: 10,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	newsTitle: {
		fontSize: 32,
	}
});
