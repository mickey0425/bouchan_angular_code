export class Device {
    parent: string;         // router MAC_address
    name: string;           // 給使用者
    deviceName: string;     // 給APP
    MAC_address: string;
    geoPoint: {
        longitude: number;
        latitude: number;
    };
    height: number;         // 高度，由APP設定得來
    type: string;           // 區別node，由APP設定得來
    voltage: number;        // 由上傳Record時做計算新增而來,設定完沒有這欄位
    thingStatus: string;    // 監聽最新一筆的record 裏頭的 thing，去做的顯示,一開始無
    icon: string;           
    timestamp: Date;        // 設定完成時間
}

export class DeviceRecord {
    mode: string;           // 因需判別出上傳或下載的紀錄，record必須有這欄位
    time: string;           // time sequence
    thing: string;          // 舊資料庫的 thing + information
    timestamp: Date;        // 上傳或下載的時間
    alarmType: string;      // 警報器類型
    sensorType: string;     // 感測器類型
    serialNumber: string;   // 序號
    status: string;
    sensorData: string;
    voltage: number;
}

