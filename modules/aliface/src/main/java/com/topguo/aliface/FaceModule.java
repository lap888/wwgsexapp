package com.topguo.aliface;

import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import com.aliyun.aliyunface.api.ZIMCallback;
import com.aliyun.aliyunface.api.ZIMFacade;
import com.aliyun.aliyunface.api.ZIMFacadeBuilder;
import com.aliyun.aliyunface.api.ZIMResponse;



public class FaceModule extends ReactContextBaseJavaModule {
    private static final String TAG = FaceModule.class.getSimpleName();
    public FaceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ZIMFacade.install(getCurrentActivity());
    }

    @Override
    public String getName() {
        return "ZIMFacade";
    }

    // /**
    //  * 获取 认证url and id
    //  * @param certName
    //  * @param certNo
    //  * @param successCallback
    //  * @param errorCallback
    //  */
    // @ReactMethod
    // public void getZimFace (String certName, String certNo, final Callback successCallback, final Callback errorCallback) {

    //     String url = "https://d.yoyoba.cn/apiV2/FaceInit";
    //     // String url = "http://192.168.1.21:5000/apiV2/FaceInit";
    //     MediaType MediaTypeJSON = MediaType.parse("application/json; charset=utf-8");

    //     Map<String, String> map = new HashMap<String, String>();
    //     map.put("certName",certName);
    //     map.put("certNo",certNo);
    //     String json= JSON.toJSONString(map);
    //     RequestBody requestBody=RequestBody.create(MediaTypeJSON,json);

    //     final Request request = new Request.Builder()
    //             .url(url)
    //             .post(requestBody)
    //             .build();

    //     new Thread(new Runnable() {
    //         @Override
    //         public void run() {
    //             new OkHttpClient().newCall(request).enqueue(new okhttp3.Callback() {
    //                 @Override
    //                 public void onFailure(Call call, IOException e) {
    //                     Log.e(TAG, "onFailure");
    //                     errorCallback.invoke(false);
    //                 }

    //                 @Override
    //                 public void onResponse(Call call, Response response) throws IOException {
    //                     if (response.isSuccessful()) {
    //                         String responseString = response.body().string();
    //                         Log.e(TAG, responseString);
    //                         successCallback.invoke(responseString);
    //                     } else {
    //                         Log.e(TAG, "onResponse error" + response.body().string());

    //                         errorCallback.invoke(false);
    //                     }
    //                 }
    //             });
    //         }
    //     }).start();
    // }
    /**
      * 获取 获取设备信息
      * @param successCallback
      */
     @ReactMethod
     public void getMetaInfos (final Callback successCallback) {
         String metaInfos = ZIMFacade.getMetaInfos(getCurrentActivity());
         successCallback.invoke(metaInfos);
     }

    

    /**
     * identify interface for android
     * @param certifyUrl 服务端返回认证链接
     * @param certifyId 刷脸认证唯一标识，请从刷脸认证服务端认证初始化接口获取
     * @param callback 认证结果的回调接口
     */
    @ReactMethod
    public void verify (String certifyUrl, String certifyId, final Callback callback) {
        ZIMFacade zimFacade = ZIMFacadeBuilder.create(getCurrentActivity());
        zimFacade.verify(certifyId, true, new ZIMCallback() {
            @Override
            public boolean response(ZIMResponse response) {

                if (null != response && 1000 == response.code) {
                            // 认证成功
                            Log.e(TAG, "认证成功");
                            callback.invoke(true);
                        } else {
                            // 认证失败
                            Log.e(TAG, "认证失败");
                            callback.invoke(false);
                        }
                    return true;
                }

        });
    }

//     /**
//      * identify interface for android
//      * @param certifyUrl 服务端返回认证链接
//      * @param certifyId 刷脸认证唯一标识，请从刷脸认证服务端认证初始化接口获取
//      * @param callback 认证结果的回调接口
//      */
//     @ReactMethod
//     public void verify (String certifyUrl, String certifyId, final Callback callback) {
//         // 封装认证数据
//         JSONObject requestInfo = new JSONObject();
//         requestInfo.put("url", certifyUrl);
//         requestInfo.put("certifyId", certifyId);
//         ServiceFactory.build().startService(getCurrentActivity(), requestInfo, new ICallback() {
//             @Override
//             public void onResponse(Map<String, String> response) {
// //                Log.e("支付宝返回resultStatus",JSON.toJSONString(response));
//                 if (null != response&&response.get("resultStatus").equals("9000")) {
//                     Log.e(TAG, "认证成功");
//                     callback.invoke(true);
//                 } else {
//                     Log.e(TAG, "认证失败");
//                     callback.invoke(false);
//                 }
//             }
//         });
//     }

}
