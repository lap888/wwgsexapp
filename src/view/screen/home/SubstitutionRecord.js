import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';
import { Send } from '../../../utils/Http';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

export default class SubstitutionRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailList: [],
            pageSize: 20,
            pageIndex: 1,
            totalPage: 0,
            refreshState: true,
            moreData: true
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        Send(`api/Coin/ExchangeRecord?PageIndex=1&PageSize=${this.state.pageSize}&ModifyType=5`, {}, 'get').then(res => {
            if (res.code == 200) {
                this.setState({
                    detailList: res.data,
                    totalPage: res.recordCount,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    detailList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }

    onFooterRefresh = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            let params = {
                pageIndex: that.state.pageIndex,
                pageSize: that.state.pageSize
            }
            Send(`api/Coin/ExchangeRecord?PageIndex=${this.state.pageIndex}&PageSize=${this.state.pageSize}&ModifyType=5`, {}, 'get').then(res => {
                if (res.code == 200) {
                    this.setState({
                        detailList: that.state.detailList.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.detailList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        detailList: [],
                        totalPage: 0,
                        refreshState: RefreshState.EmptyData
                    })
                }
            });
        });
    }

    keyExtractor = (item, index) => {
        return index.toString()
    }

    renderItem = (item, index) => {
        return (
            <View key={index} style={styles.item}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14 }} numberOfLines={2}>{item.modifyDesc}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: Colors.C10, }}>数量:  </Text>
                            <Text style={{ fontSize: 12, color: Colors.C12 }}>{item.incurred}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, color: Colors.C10, }}>时间</Text>
                        <Text style={{ fontSize: 12, color: Colors.C12, marginTop: 3 }}>{item.modifyTime}</Text>
                    </View>
                </View>
            </View>
        )
    }
    /**
         * 渲染列表
         */
    renderExRecord() {
        return (
            <RefreshListView
                ListHeaderComponent={() => {
                    return (
                        <View style={{ justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, color: Colors.C12, fontWeight:'600' }}>NW兑换Gas记录</Text>
                        </View>
                    )
                }}
                data={this.state.detailList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                refreshState={this.state.refreshState}
                onHeaderRefresh={this.onHeaderRefresh}
                onFooterRefresh={this.onFooterRefresh}
                // 可选
                footerRefreshingText='正在玩命加载中...'
                footerFailureText='我擦嘞，居然失败了 =.=!'
                footerNoMoreDataText='暂无数据 =.=!'
                footerEmptyDataText='暂无数据 =.=!'
            />
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={'兑换记录'} titleStyle={{ color: Colors.titleMainTxt }} backgroundColor={Colors.White} />
                {this.renderExRecord()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    headerView: {
        backgroundColor: Colors.Alipay,
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomColor: Colors.C13,
        borderBottomWidth: 10
    },
    item: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.C13,
        paddingHorizontal: 10
    },
})
