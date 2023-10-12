import React, { Component } from 'react';
import { View, ToastAndroid, TouchableOpacity, Image, StyleSheet, Keyboard } from 'react-native';
import { Container, Content, Text, Input, Form, Item } from 'native-base';
import { connect } from 'react-redux';
import { Header } from '../../../components/Index';
import { SET_USERINFO, SET_USERNAME } from '../../../../redux/ActionTypes';
import { Actions } from 'react-native-router-flux';
import { Colors, Metrics } from '../../../theme/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';

const verify = /^[0-9a-zA-Z\u4e00-\u9fa5]*$/;

class EditUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: ''
        };
    }
    submit() {
        Keyboard.dismiss();
        let name = this.state.nickName;
        params = { name: name, uId: this.props.userId }

        /* 为空验证 */
        if (name.length === 0) {
            Toast.tipTop('昵称不能为空');
            return ;
        }

        /* 格式验证(必须是数字、字母或汉字) */
        if (!name.match(verify)) {
            Toast.tipTop('昵称格式不正确');
        }
        /* 长度验证 */
        if (name.length > 15) {
            Toast.tipTop('昵称不能超过15位');
        }

        var that = this;
        Send("api/User/ModifyUserName?name=" + name, {}, 'get').then(res => {
            if (res.code == 200) {
                Toast.tipTop('修改昵称成功');
                Actions.pop();
                that.props.resetUserInfo(res.data);
            } else {
                Toast.tipTop(res.message);
            }
        });
    }

    render() {
        return (
            <Container>
                <Header title="修改昵称" rightText="保存" rightStyle={{ color: Colors.black }} onRightPress={() => this.submit()} />
                <Content>
                    <View style={{ padding: 5, paddingLeft: 15, backgroundColor: "#ffffff" }}>
                        <Text style={{ color: Colors.main, fontSize: 12, }}>
                            提示: 昵称必须是数字、字母或汉字
						</Text>
                    </View>
                    <Form>
                        <Item>
                            <Input placeholder="请输入1-15位的新昵称" onChangeText={(value) => this.setState({ nickName: value })} />
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
    resetUserInfo: name => dispatch({ type: SET_USERNAME, payload: { name } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditUserInfo);
