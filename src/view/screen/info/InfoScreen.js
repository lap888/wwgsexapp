import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';
import { SystemApi } from '../../../api';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';

export default class InfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabType: 1,
            msgList: [],
            pageIndex: 1,
            pageSize: 20,
            refreshState: ''
        };
    }

    componentDidMount() {
        this.getMessage()
    }

    getMessage = () => {
        const { pageIndex, pageSize, tabType } = this.state;
        SystemApi.getNotices({pageIndex: pageIndex, pageSize: pageSize, Type: tabType})
        .then((data) => {
            this.setState({
                msgList: pageIndex === 1 ? data : this.state.data.concat(data),
                refreshState: data.length < pageSize ? RefreshState.EmptyData : RefreshState.Idle
            })
        }).catch((err) => {
            this.setState({ msgList: [], refreshState: RefreshState.EmptyData })
        })
    }

    selectTopBar = (value) => {
        this.setState({tabType: value, pageIndex: 1}, () => {
            this.getMessage()
        })
    }

    onHeaderRefresh = () => {
        this.setState({ RefreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            this.getMessage();
        });
    }

    onFooterRefresh = () => {	
        this.setState({ refreshState: RefreshState.FooterRefreshing, pageIndex: this.state.pageIndex + 1 }, () => {
            this.getMessage();
        });
    }

    render() {
        const { msgList, tabType } = this.state;
        return (
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={'消息'} isTabBar={true}/>
                <View style={{flexDirection: 'row', height: 50, }}>
                    <TouchableOpacity style={styles.topTab} onPress={() => this.selectTopBar(1)}>
                        <View style={styles.topTabBtn}>
                            <Text style={tabType === 1 ? styles.topBarText1 : styles.topBarText0 }>系统消息</Text>
                        </View>
                        <View style={tabType === 1 ? styles.topTabXian1 : styles.topTabXian0 } />
                    </TouchableOpacity>
                    <View style={{height: 50, width: 1, backgroundColor: Colors.backgroundColor}} />
                    <TouchableOpacity style={styles.topTab} onPress={() => this.selectTopBar(2)}>
                        <View style={styles.topTabBtn}>
                            <Text style={tabType === 2 ? styles.topBarText1 : styles.topBarText0 }>活动公告</Text>
                        </View>
                        <View style={tabType === 2 ? styles.topTabXian1 : styles.topTabXian0} />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <RefreshListView 
                        data={msgList}
                        keyExtractor={(item, index) => index + ''}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity style={styles.item} onPress={() => Actions.MessageDetail({ msgData: item, flag: tabType === 1 ? 'system' : 'active' })}>
                                {/* {tabType == 1 && <Image source={require('../../images/xitongTZ.png')} />}
                                {tabType == 2 && <Image source={require('../../images/huodongTZ.png')} />} */}
                                <View style={{flex: 1, marginLeft: 10}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                        <Text style={{flex: 1, fontSize: 14, lineHeight: 15, color: Colors.fontColor}} numberOfLines={1}>{item.title}</Text>
                                    </View>
                                        <Text style={{marginTop: 5, fontSize: 12, lineHeight: 13, color: Colors.grayFont1}} >{item.updatedAt}发布</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        refreshState={this.state.refreshState}
                        onHeaderRefresh={this.onHeaderRefresh}
                        onFooterRefresh={this.onFooterRefresh}
                        // 可选
                        footerRefreshingText='正在玩命加载中...'
                        footerNoMoreDataText='我是有底线的'
                        footerEmptyDataText='我是有底线的'
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    topTab: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.White
    },
    topTabBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topBarText0: {
        fontSize: 14,
        color: Colors.fontColor
    },
    topBarText1: {
        fontSize: 14,
        color: Colors.main
    },
    topTabXian0: {
        height: 2,
        width: 70,
        backgroundColor: Colors.White
    },
    topTabXian1: {
        height: 2,
        width: 70,
        backgroundColor: Colors.main
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        marginTop: 5,
        backgroundColor: Colors.White
    },
})