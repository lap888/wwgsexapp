import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Coin } from '../../../../api';
import { Loading, Toast } from '../../../common';
import { Header } from '../../../components/Index';
import SelectTopTab from '../../../components/SelectTopTab';
import { Colors } from '../../../theme/Index';
import { Send } from "../../../../utils/Http";
import Icon from "react-native-vector-icons/Ionicons";

const TOPTABLIST = [
    { key: 1, name: '我的量化宝' },
    { key: 2, name: '兑换量化宝' },
    { key: 0, name: '过期量化宝' }
]
export default class MiningMachineryShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasksList: [],
            selectTap: 1,
            isLoading: true
        };
    }

    componentDidMount() {
        this.getTasksList(1)
    }

    getTasksList = (status) => {
        Coin.getTasksShop(status)
            .then((data) => {
                this.setState({
                    tasksList: data,
                    isLoading: false
                })
            }).catch((err) => this.setState({ isLoading: false }))
    }

    exchange = (mid) => {
        this.setState({ isLoading: true }, () => {
            Coin.exchange(mid)
                .then((data) => {
                    Toast.tip('兑换成功');
                    this.setState({ isLoading: false })
                }).catch((err) => this.setState({ isLoading: false }))
        })
    }

    selectTab = (item) => {
        this.setState({ selectTap: item.key })
        this.getTasksList(item.key)
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'量化宝商店'} titleStyle={{ color: Colors.titleMainTxt, fontWeight: 'bold' }} backgroundColor={Colors.White} />
                <SelectTopTab list={TOPTABLIST} onPress={this.selectTab} />
                <ScrollView style={{ flex: 1 }}>
                    {this.state.tasksList.length > 0 && this.state.tasksList.map((item, index) => {
                        return (
                            (item.storeShow || this.state.selectTap == 1) && <View key={index} style={{ backgroundColor: Colors.White, marginTop: 10, marginHorizontal: 15 }}>
                                <View style={{ flex: 1, borderRadius: 5, flexDirection: 'row' }}>
                                    <View style={{ flex: 2, justifyContent: 'center', paddingVertical: 10, alignItems: 'center' }}>
                                        <Icon name="logo-ionitron" size={50} color={item.colors} />
                                        <Text style={{ marginTop: 10, fontSize: 14, fontWeight: 'bold', }}>{item.baseName}</Text>
                                        <Text style={{ marginTop: 10, fontSize: 14, }}>{item.unitPrice} NW /个</Text>
                                        {this.state.selectTap == 2 && item.isExchange == true &&
                                            <TouchableOpacity style={{ height: 30, marginTop: 10, borderRadius: 20 }} onPress={() => { this.exchange(item.baseId) }}>
                                                <LinearGradient colors={[Colors.btnBeforColor, Colors.btnAfterColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 5 }}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, }}>
                                                        <Text style={{ fontSize: 15, color: Colors.White, }}>兑换</Text>
                                                    </View>
                                                </LinearGradient>
                                            </TouchableOpacity>}
                                    </View>
                                    <View style={{ flex: 3, paddingHorizontal: 20, paddingBottom: 10, paddingTop: 10, }}>
                                        <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 12, color: Colors.C10 }}>限量</Text>
                                            <Text style={{ fontSize: 12, }}>{item.maxHave}</Text>
                                        </View>

                                        {this.state.selectTap == 2 &&
                                            <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                                <Text style={{ fontSize: 12, color: Colors.C10 }}>周期</Text>
                                                <Text style={{ fontSize: 12, }}>{item.activeDuration}</Text>
                                            </View>
                                        }


                                        <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 12, color: Colors.C10 }}>总释放</Text>
                                            <Text style={{ fontSize: 12, }}>{item.totalOut}</Text>
                                        </View>

                                        <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 12, color: Colors.C10 }}>日释放</Text>
                                            <Text style={{ fontSize: 12, }}>{item.dayOut}</Text>
                                        </View>

                                        <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 12, color: Colors.C10 }}>活跃度</Text>
                                            <Text style={{ fontSize: 12, }}>{item.active}</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                            <Text style={{ fontSize: 12, color: Colors.C10 }}>手续费</Text>
                                            <Text style={{ fontSize: 12, }}>{item.honorValue}%</Text>
                                        </View>
                                        {
                                            this.state.selectTap != 2 &&
                                            <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                                <Text style={{ fontSize: 12, color: Colors.C10 }}>开始时间</Text>
                                                <Text style={{ fontSize: 12, }}>{item.beginDate}</Text>
                                            </View>
                                        }
                                        {
                                            this.state.selectTap != 2 &&
                                            <View style={{ marginVertical: 5, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                                <Text style={{ fontSize: 12, color: Colors.C10 }}>结束时间</Text>
                                                <Text style={{ fontSize: 12, }}>{item.expiryDate}</Text>
                                            </View>
                                        }
                                    </View>
                                </View>

                                {/* <View style={[styles.areaChoice, { borderTopColor: item.colors, borderLeftColor: item.colors, borderRightColor: item.colors }]} /> */}
                            </View>
                        )
                    })}
                    <View style={{ height: 20 }} />
                </ScrollView>
                { this.state.isLoading && <Loading />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    toptn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    topText: {
        color: Colors.greyText,
        fontSize: 13
    },
    topNum: {
        color: Colors.blakText,
        fontSize: 15
    },
    btn: {
        width: 170,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.greyText
    },
    areaChoice: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 8,
        borderTopColor: '#999',
        borderLeftColor: '#999',
        borderBottomColor: '#fff',
        borderRightColor: '#999',
        marginLeft: 8,
    },
})
