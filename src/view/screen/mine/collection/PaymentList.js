import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import { Header } from '../../../components/Index';
import { Colors } from '../../../theme/Index';

export default class PaymentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [1,1,1],
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header title={'收款方式'} />
                <View style={{flex: 1, borderTopWidth: 5, borderTopColor: Colors.backgroundColor}}>
                    {this.state.list.map((item, index) => {
                        return (
                            <View style={{flexDirection: 'row', padding: 10,borderBottomWidth: 5, borderBottomColor: Colors.backgroundColor}}>
                                <View style={{flex: 1}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image style={{width: 20, height: 20, marginRight: 10}} source={require('../../../images/profile/biao.png')} />
                                        <Text style={{flex: 1}}>支付宝</Text>
                                        <Text style={{}} onPress={()=> {}}>编辑</Text>
                                    </View>
                                    <Text style={{fontSize: 14, color: Colors.greyText, marginTop: 10}}>郭东生</Text>
                                    <Text style={{fontSize: 14, color: Colors.blakText, marginTop: 10}}>13643343210</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
                <View style={{height: 50, paddingHorizontal: 10, marginBottom: 30}}>
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
