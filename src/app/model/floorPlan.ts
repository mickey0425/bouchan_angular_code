export class FloorPlan {
    imageUrl: string;       // 從 firestore 取得的 url
    filename: string;       // 平面圖上傳時的檔案名稱
    floor: number;          // 樓層
    upperLeft: {
        longitude: number;
        latitude: number;
    };
    lowerRight: {
        longitude: number;
        latitude: number;
    };
}
