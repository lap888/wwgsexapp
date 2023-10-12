import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import ByronKlineChart, {
  dispatchByronKline,
  KLineIndicator,
  CandleHollow,
} from 'react-native-kline';
// import axios from 'axios';

const BaseUrl = 'http://api.zhuwenbo.cc/v1';
const WsUrl = 'ws://49.233.210.12:1998/websocket';

const _data = [
  {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 3,
    count: 600,
    low: 0.1,
    vol: 9,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 3,
    count: 600,
    low: 0.1,
    vol: 9,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 3,
    count: 600,
    low: 0.1,
    vol: 9,
    id: new Date().valueOf().toString().substring(0, 10)
  }, {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 100,
    open: 0.7,
    close: 0.8,
    high: 0.1,
    count: 5600,
    low: 0.05,
    vol: 1.1,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 1,
    count: 8600,
    low: 0.5,
    vol: 2,
    id: new Date().valueOf().toString().substring(0, 10)
  },
  {
    amount: 1001,
    open: 0.9,
    close: 0.8,
    high: 3,
    count: 600,
    low: 0.1,
    vol: 9,
    id: new Date().valueOf().toString().substring(0, 10)
  }
];

export default class KLineT extends Component {
  state = {
    datas: _data,
    symbol: 'BTCUSDT',
    type: 'MIN_15',
  };
  // amount: number;
  // open: number;
  // close: number;
  // high: number;
  // id: number;
  // count: number;
  // low: number;
  // vol: number;
  ws = null;

  onMoreKLineData = async (params) => {
    console.log(' >> onMoreKLineData :', params);
    const { symbol, type } = this.state;
    // const res = await axios.get(
    //   `${BaseUrl}/kline?type=${type}&symbol=${symbol}&to=${params.id}`,
    // );
    var _data = [
      {
        amount: 100,
        open: 0.7,
        close: 0.8,
        high: 0.1,
        count: 5600,
        low: 0.05,
        vol: 1.1,
        id: new Date().valueOf().toString().substring(0, 10)
      },
      {
        amount: 1001,
        open: 0.9,
        close: 0.8,
        high: 1,
        count: 8600,
        low: 0.5,
        vol: 2,
        id: new Date().valueOf().toString().substring(0, 10)
      },
      {
        amount: 100,
        open: 0.7,
        close: 0.8,
        high: 0.1,
        count: 5600,
        low: 0.05,
        vol: 1.1,
        id: new Date().valueOf().toString().substring(0, 10)
      },
      {
        amount: 1001,
        open: 0.9,
        close: 0.8,
        high: 1,
        count: 8600,
        low: 0.5,
        vol: 2,
        id: new Date().valueOf().toString().substring(0, 10)
      },
      {
        amount: 1001,
        open: 0.9,
        close: 0.8,
        high: 3,
        count: 600,
        low: 0.1,
        vol: 9,
        id: new Date().valueOf().toString().substring(0, 10)
      }
    ];
    // const res = { data: _data };
    // if (!res || !res.data) {
    //   return;
    // }
    dispatchByronKline('add', _data);
  };

  async initKlineChart() {
    const { symbol, type } = this.state;
    // const res = await axios.get(
    //   `${BaseUrl}/kline?type=${type}&symbol=${symbol}`,
    // );
    // const res = "";
    // if (!res || !res.data) {
    //   return;
    // }
    this.setState({ datas: _data });
  }

  subscribeKLine = (event = 'subscribe') => {
    if (!this.ws) {
      return;
    }
    const { type, symbol } = this.state;
    const data = {
      event: event,
      data: `${type}/${symbol}`,
    };
    this.ws.send(JSON.stringify(data));
  };

  onWebSocketOpen = () => {
    this.subscribeKLine();
  };

  onWebSocketMessage = (evt) => {
    // console.log(' >> onWebSocketMessage:', evt.data);
    const { type, symbol } = this.state;
    const msg = JSON.parse(evt.data);
    const _type = `${type}/${symbol}`;
    if (!msg || msg.type !== _type || !msg.data) {
      return;
    }
    dispatchByronKline('update', [msg.data]);
  };

  componentDidMount() {
    this.initKlineChart();
    this.ws = new WebSocket(WsUrl);
    this.ws.onopen = this.onWebSocketOpen;
    this.ws.onmessage = this.onWebSocketMessage;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ByronKlineChart
          style={{ height: 400 }}
          datas={this.state.datas}
          onMoreKLineData={this.onMoreKLineData}
          indicators={[KLineIndicator.MainMA,KLineIndicator.VolumeShow]}
          limitTextColor={'#FF2D55'}
          // mainBackgroundColor={'#ffffff'}
          candleHollow={CandleHollow.NONE_HOLLOW}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});