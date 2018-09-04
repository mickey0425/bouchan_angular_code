export class Node {
    father: string;         // router MAC_address
    name: string;           // 給使用者
    deviceName: string;     // 給APP
    MAC_address: string;
    geoPoint: {
        longitude: number;
        latitude: number;
    };
    height: number;         // 高度，由APP設定得來
    type: string;           // 區別node，由APP設定得來
    thingStatus: string;    // 監聽最新一筆的record 裏頭的 thing，去做的顯示
    icon: string;
    timestamp: Date;        // 設定完成時間
}

// 之後的資料分析由 record 取得

export class NodeRecord {
    mode: string;           // 因需判別出上傳或下載的紀錄，record必須有這欄位
    time: string;
    thing: string;
    timestamp: Date;        // 上傳或下載的時間
}

