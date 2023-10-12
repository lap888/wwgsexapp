import React, { Component } from 'react';
import { View, Text, ImageBackground, Image, Pressable, Alert, TouchableOpacity } from 'react-native';
import { Header, BigButton } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import TicketItem from './TicketItem';
import { UserApi } from '../../../../api';
import { Toast } from '../../../common';
import { Actions } from 'react-native-router-flux';

export default class NewTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            list: [],
            kg: true,
        };
    }

    componentDidMount() {
        this.getTiketInfo()
    }

    getTiketInfo = () => {
        UserApi.ticketInfo()
            .then((data) => {
                this.setState({
                    data: data,
                    list: data.package,
                })
            }).catch((err) => console.log('err', err))
    }

    exchangeTicket = (type) => {
        const data = this.ticketItem.state.selected;
        if (data == '') {
            Toast.tip('请选择需要要买的认证券类型')
            return;
        }
        Alert.alert(
            "购买提示",
            `您确定购买${data.shares}张认证券吗？`,
            [
                {
                    text: "确定", onPress: () => {
                        UserApi.exchangeTicket({ shares: data.shares, payType: type })
                            .then((data) => {
                                Toast.tip('购买成功,请去订单付款...');
                                this.onRightPress();
                                this.getTiketInfo();
                            }).catch((err) => console.log('err', err))
                    }
                },
                { text: "取消", onPress: () => { } },
            ],
            { onDismiss: () => { } }
        )

    }

    setTicketState = () => {
        UserApi.ticketState()
            .then((data) => {
                this.getTiketInfo()
            }).catch((err) => console.log('err', err))
    }

    /**
   * 进入交易规则界面
   */
    onRightPress() {
        Actions.push("BusinessPageTick", { businessType: 2, coinType: "RZQ" });
    }

    renderHeader = () => {
        const { data } = this.state;
        return (
            <View style={{ padding: 15 }}>
                <ImageBackground style={{ paddingHorizontal: 20, width: Metrics.screenWidth - 30, height: (Metrics.screenWidth - 30) / 4.73 }} source={require('../../../images/mine/wallet/xinrenquan.png')}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={{ flex: 1 }} onPress={() => { Actions.push('TicketDetailList') }}>
                            <Text style={{ fontSize: 12, color: Colors.White, lineHeight: 22 }}><Text style={{ fontSize: 20 }}>{data.balance}</Text>张</Text>
                            <Text style={{ fontSize: 12, color: Colors.White, }}>满1张可用</Text>
                            <Text style={{ fontSize: 10, color: Colors.White, }}>查看使用明细</Text>
                        </Pressable>
                        <View style={{ flex: 3, justifyContent: 'center', paddingLeft: 10 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={{ fontSize: 15, color: Colors.fontColor, lineHeight: 17 }}>认证券</Text>
                                <Text style={{ fontSize: 12, color: Colors.grayFont, marginLeft: 5 }}>有效期：永久有效</Text>

                            </View>
                            <View style={{ paddingTop: 2, height: 30, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1, fontSize: 12, color: Colors.grayFont }}>实名专用可自己使用可下级使用</Text>
                                <Pressable onPress={this.setTicketState}>
                                    {data.state == 1 && <Image style={{ width: 30 }} resizeMode={'contain'} source={require('../../../images/mine/wallet/kgkai.png')} />}
                                    {data.state == 0 && <Image style={{ width: 30 }} resizeMode={'contain'} source={require('../../../images/mine/wallet/kgguan1.png')} />}
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title={'认证券'} rightText={'订单'} rightStyle={{ color: Colors.black }} onRightPress={() => this.onRightPress()} />
                {this.renderHeader()}
                <TicketItem ref={ticket => this.ticketItem = ticket} data={this.state.list} />
                {/* <BigButton style={{marginTop: 20}} name={'糖果兑换'} onPress={() => this.exchangeTicket(0)}/> */}
                <BigButton style={{ marginTop: 40 }} name={'确认购买'} onPress={() => this.exchangeTicket(1)} />
            </View>
        );
    }
}
