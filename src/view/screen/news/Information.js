import React, { Component } from 'react';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import CameraRoll from "@react-native-community/cameraroll";
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import { Actions } from 'react-native-router-flux';
import { captureRef } from 'react-native-view-shot';
import { WEB_PATH } from '../../../config/Index';

import { Colors, Metrics } from '../../theme/Index';
import { Header, ReadMore } from '../../components/Index';
import { ScrollView } from 'react-native-gesture-handler';
import { Toast } from '../../common';
import { UserApi } from '../../../api';
import DeviceInfo from 'react-native-device-info';
import SelectTopTab from '../../components/SelectTopTab';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    Platform,
    PermissionsAndroid,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'
const TOPTABLIST = [
    { key: 1, name: '量化策略' },
    { key: 2, name: '我的量化 ' },
    { key: 3, name: '盈利日志' }
]
const defaultImgUrl = "https://reactnative.dev/img/tiny_logo.png";
class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        // this.onRefresh();
    };
    render() {
        return (
            <View style={{ flex: 1 }} >
                <Header title={'N W 量化'} isTabBar={true} />
                <SelectTopTab list={TOPTABLIST} onPress={this.selectTab} />
                
            </View>

        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    mobile: state.user.mobile,
    name: state.user.name,
    avatarUrl: state.user.avatarUrl,
    rcode: state.user.rcode
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Information);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
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