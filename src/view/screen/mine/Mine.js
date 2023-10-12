import React, { Component } from 'react';
import { View, Text, NativeModules, StyleSheet, ScrollView, TouchableWithoutFeedback, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
// import { Toast } from 'native-base';
import { Colors, Metrics } from '../../theme/Index';
import { LOGOUT, UPDATE_USER } from '../../../redux/ActionTypes';
import { Send } from '../../../utils/Http';
import { EncryptionMobile } from '../../../utils/Index';
import { API_PATH, Version, Env } from '../../../config/Index';
import Icon from "react-native-vector-icons/Ionicons";


// 交易

class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  /**
   * 渲染变色版
   */
  renderGradient() {
    let { avatar, mobile } = this.props;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', margin: 10, marginBottom: 50, }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* <Image source={{ uri: avatar }} style={Styles.avatar} /> */}
          <Image source={require('../../images/logo.png')} style={Styles.avatar} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', }}>{this.props.logged ? `${EncryptionMobile(mobile)}` : '请授权登录'}</Text>
          </View>

          {this.props.logged ?
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableWithoutFeedback style={{ borderRadius: 10 }} onPress={() => { Actions.push('Login') }}>
                <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 40, marginTop: 10, width: 100, borderRadius: 5 }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, color: Colors.White, fontWeight: 'bold', }}>切换账号</Text>
                  </View>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View> :
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableWithoutFeedback style={{ borderRadius: 10 }} onPress={() => { Actions.push('Login') }}>
                <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 40, marginTop: 10, width: 100, borderRadius: 5 }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, color: Colors.White, fontWeight: 'bold', }}>登录</Text>
                  </View>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View>}

        </View>
      </View>
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

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          {this.renderGradient()}
          <TouchableOpacity style={Styles.labelContainer} onPress={() => Actions.push('MiningMachineryShop')}>
            <Icon name="logo-ionitron" size={25} color={Colors.black} />
            <Text style={Styles.lableTxt}>量 化 宝</Text>
            <View style={Styles.btnRight}>
              <Text style={[Styles.lableTxt, { color: Colors.greyText }]}></Text>
              <Icon name="ios-chevron-forward" size={20} color={Colors.greyText} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.labelContainer} onPress={() => Actions.push('MyTeam')}>
            <Icon name="md-speedometer" size={25} color={Colors.black} />
            <Text style={Styles.lableTxt}>我的团队</Text>
            <View style={Styles.btnRight}>
              <Text style={[Styles.lableTxt, { color: Colors.greyText }]}></Text>
              <Icon name="ios-chevron-forward" size={20} color={Colors.greyText} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.labelContainer} onPress={() => Actions.push('PayPage')}>
            <Icon name="key-sharp" size={25} color={Colors.black} />
            <Text style={Styles.lableTxt}>API管理</Text>
            <View style={Styles.btnRight}>
              <Text style={[Styles.lableTxt, { color: Colors.greyText }]}></Text>
              <Icon name="ios-chevron-forward" size={20} color={Colors.greyText} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.labelContainer} onPress={() => Actions.push('Invitation')}>
            <Icon name="people-sharp" size={25} color={Colors.black} />
            <Text style={Styles.lableTxt}>邀请好友</Text>
            <View style={Styles.btnRight}>
              <Text style={[Styles.lableTxt, { color: Colors.greyText }]}></Text>
              <Icon name="ios-chevron-forward" size={20} color={Colors.greyText} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.labelContainer} onPress={() => Actions.push('UserInfo')}>
            <Icon name="settings" size={25} color={Colors.black} />
            <Text style={Styles.lableTxt}>安全设置</Text>
            <View style={Styles.btnRight}>
              <Text style={[Styles.lableTxt, { color: Colors.greyText }]}></Text>
              <Icon name="ios-chevron-forward" size={20} color={Colors.greyText} />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center", bottom: 50, }}>
          <Text style={{ color: Colors.LightGrey }}>{`当前版本 ${Env === 'dev' ? 'dev' : ''} ${Version}`}</Text>
        </View>
      </SafeAreaView>
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
  userBalanceLock: state.dividend.userBalanceLock
});
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: LOGOUT }),
  updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(Mine);

const Styles = StyleSheet.create({
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: Colors.C8 },
  nickname: { fontSize: 18, color: Colors.C8, fontWeight: '500' },
  inviteCode: { fontSize: 15, color: Colors.C8, },
  setting: { paddingLeft: 30, paddingBottom: 30, paddingTop: 20, alignItems: 'flex-end' },
  version: { marginTop: 2, fontSize: 14, color: Colors.C8 },
  profile: { flexDirection: 'row', alignItems: 'center' },
  profileItem: { flex: 1, alignItems: 'center' },
  profileTitle: { marginTop: 2, fontSize: 16, color: Colors.C8 },
  profileText: { fontSize: 14, color: Colors.C8 },
  level: { height: 70, width: Metrics.screenWidth - 30, borderRadius: 15, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.C8 },
  levelText: { fontSize: 19, color: Colors.mainTab, fontWeight: 'bold' },
  contributionValueText: { marginTop: 4, fontSize: 14, color: Colors.C0 },
  levelPropaganda: { fontSize: 15, color: Colors.C10 },
  icon: { width: 30, height: 30 },
  barContainer: { width: Metrics.screenWidth - 30, borderRadius: 15, alignSelf: 'center', backgroundColor: Colors.C8, marginTop: 15 },

  barTitle: { fontSize: 15, color: Colors.C10, fontWeight: '500' },

  barMore: { textAlign: 'right', fontSize: 14, color: Colors.C10 },
  barBody: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 14 },
  barBodyItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  barText: { marginTop: 6, fontSize: 14, color: Colors.C10 },
  badge: { position: 'absolute', left: 20, top: -2 },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 65,
    marginLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LightGrey
  },
  lableTxt: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  btnRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: "center"
  }
});