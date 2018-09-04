export class Tag {
    MAC_address: string;
    houseID: string;        // 現在的地址
    floorPlanID: string;    // 現在的樓層
    geoPoint: {
        longitude: number;
        latitude: number;
    };
    thingStatus: string;    // 監聽最新一筆的record 裏頭的 thing，去做的顯示
    voltage: number;
    icon: string;
    timestamp: Date;        // 設定完成時間
}

// 之後的資料分析由 record 取得

export class TagRecord {
    mode: string;           // 因需判別出上傳或下載的紀錄，record必須有這欄位
    time: string;
    houseID: string;        // 當時的地址
    floorPlanID: string;    // 當時的樓層
    geoPoint: {             // 移動軌跡紀錄
        longitude: number;
        latitude: number;
    };
    thing: string;          // 待使用
    timestamp: Date;        // 上傳或下載的時間
}
