import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar, Image, View, Text, DeviceEventEmitter } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import { isIphoneX } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/Ionicons";
import Cookie from 'cross-cookie';
import { Actions } from 'react-native-router-flux';

import Home from './home/Home';
import Mine from './mine/Mine'
import Colors from '../theme/Colors';
import { Send } from '../../utils/Http';
import { LOGOUT, UPDATE_USER } from '../../redux/ActionTypes';
import { Toast } from '../common';
import CoinF from './otc/CoinF';
import Otc from './otc/Otc';
import Information from './news/Information';


import MineScreen from './property/MineScreen';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "home",
            badgeValue: "···"
        };
    }

    componentDidMount() {
        this.updateUserInfo(-1);
    }

    /**
     * 刷新用户信息
     */
    updateUserInfo(key) {
        if (key !== -1) {
            if (["home", "mine", "jiaoyi", "zichan"].indexOf(key) === -1) return;
        }
        if (key == "zichan") {
            DeviceEventEmitter.emit('refranshZiChan')
        }
        if (!this.props.logged) {
            return;
        };
        var that = this;
        Send("api/system/InitInfo", {}, 'GET').then(res => {
            if (res.code == 200) {
                that.props.updateUserInfo(res.data)
            } else {
                Toast.tipBottom(res.message);
            }
        });
    }
    /**
     * 切换Tab
     * @param {*} key 
     */
    switchTab(key) {
        // 修改状态栏样式
        if (Platform.OS === 'android') {
            this.changeStatusBar(key)
        }
        this.updateUserInfo(key);
        this.setState({ selectedTab: key });
    }
    changeStatusBar(key) {
        // if (key === 'home') {
        //     StatusBar.setTranslucent(false);
        //     StatusBar.setBackgroundColor(Colors.main, true);
        //     // StatusBar.setBackgroundColor('transparent')
        // } else {
        //     StatusBar.setTranslucent(false);
        //     StatusBar.setBackgroundColor(Colors.White, true);
        // }
        StatusBar.setTranslucent(false);
        StatusBar.setBarStyle('dark-content');
        
        // StatusBar.setBackgroundColor(Colors.White, true);
    }

    /**
     * 渲染选项卡
     * @param {string} title 
     * @param {string} tabName 组件名字
     * @param {*} isBadge 
     */
    renderTabView(title, tabName, isBadge) {
        let unSelectIcon;
        let selectIcon;
        let tabPage;
        let iconPath;
        switch (tabName) {
            case 'home':
                unSelectIcon = require('../images/ionc/shouye0.png');
                selectIcon = require('../images/ionc/shouye1.png');
                iconPath = 'ios-home'
                tabPage = <Home />;
                break;

            case 'zixun':
                unSelectIcon = require('../images/ionc/fab0.png');
                selectIcon = require('../images/ionc/fabi1.png');
                iconPath = 'book'
                tabPage = <Information />;
                break;
            // case 'jiaoyi':
            //     unSelectIcon = require('../images/ionc/fab0.png');
            //     selectIcon = require('../images/ionc/fabi1.png');
            //     iconPath = 'ios-stats-chart-sharp'
            //     tabPage = <Otc />;
            //     break;
            case 'zichan':
                unSelectIcon = require('../images/ionc/zican0.png');
                selectIcon = require('../images/ionc/zican1.png');
                iconPath = 'ios-folder'
                tabPage = <MineScreen />;
                break;
            case 'mine':
                unSelectIcon = require('../images/ionc/bibi0.png');
                selectIcon = require('../images/ionc/bibi1.png');
                iconPath = 'ios-person'
                tabPage = <Mine />;
                break;
        }

        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tabName}
                title={title}
                titleStyle={styles.tabText}
                selectedTitleStyle={styles.tabTextSelected}
                renderIcon={() => <Icon name={`${iconPath}`} color={Colors.ubSelectBtn} size={22} />}
                renderSelectedIcon={() => <Icon name={`${iconPath}`} color={Colors.selectBtn} size={22} />}
                onPress={() => this.switchTab(tabName)}
                renderBadge={() => isBadge ? <View style={styles.badgeView}><Text style={styles.badgeText}>{this.state.badgeValue}</Text></View> : null}
            >
                {tabPage}
            </TabNavigator.Item>
        );
    }
    //自定义tabBar simple seal for tabNavigatorItem
    renderTabBarView() {
        return (
            <TabNavigator
                tabBarStyle={styles.tab}>
                {this.renderTabView('首页', 'home', false)}
                {this.renderTabView('策略', 'zixun', false)}
                {/* {this.renderTabView('交易', 'jiaoyi', false)} */}
                {this.renderTabView('资产', 'zichan', false)}
                {this.renderTabView('我的', 'mine', false)}
            </TabNavigator>
        );
    }

    render() {
        return (
            this.renderTabBarView()
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged
});

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch({ type: LOGOUT }),
    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })

});
export default connect(mapStateToProps, mapDispatchToProps)(Index);
const styles = StyleSheet.create({
    imagestyle: { width: 20, height: 20 },
    tabTextSelected: { color: Colors.mainTab, fontSize: 12, paddingTop: 0, fontWeight: 'bold' },
    tabText: { color: Colors.C10, fontSize: 12, fontWeight: 'bold' },
    tab: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: '#f0f0f0',
        backgroundColor: '#FFFFFF',
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50 + (isIphoneX() ? 15 : 0),
        paddingBottom: isIphoneX() ? 15 : 0,
    },
    badgeView: {
        width: 14,
        height: 14,
        backgroundColor: '#f85959',
        borderWidth: 1,
        marginLeft: 10,
        marginTop: 3,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 8,
    }
})

