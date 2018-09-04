import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Account } from '../model/account';
import { House } from '../model/house';
import { FloorPlan } from '../model/floorPlan';
import { Tag } from '../model/tag';
import { Device, DeviceRecord } from '../model/device';
import { MobileDevice } from '../model/mobileDevice';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountCollection: AngularFirestoreCollection<Account>;
  private accountPaginateCollection: AngularFirestoreCollection<Account>;
  // private messaging = firebase.messaging().

  constructor(private database: AngularFirestore, private http: HttpClient) {
    this.database.firestore.settings({ timestampsInSnapshots: true });
    this.accountCollection = this.database.collection<Account>('accounts', ref => ref.orderBy('firebaseID'));
    this.accountPaginateCollection = this.database.collection<Account>('accounts', ref => ref.orderBy('firebaseID'));
  }



  getAccounts(): Observable<Account[]> {
    return this.accountCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(account => {
        const data = account.payload.doc.data() as Account;
        const id = account.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  getAccountsPaginate(): Observable<Account[]> {
    return this.accountPaginateCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(account => {
        const data = account.payload.doc.data() as Account;
        const id = account.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  getAccount(firebaseID: string): Observable<any> {
    return this.accountCollection.doc(firebaseID).valueChanges();
  }

  createAccount(user: firebase.User): Promise<Object> {
    console.log('1');
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/account-createAccount';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UTL ${token}`
      });

        return this.http.post(url, {}, { headers }).toPromise();
    });
  }


  getHouse(account: Account, houseId: string): Observable<Object> {
    return this.accountCollection.doc(account.firebaseID).collection('houses').doc(houseId).valueChanges();
  }

  createHouse(user: firebase.User, house: House): Promise<Object> {
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/account-createHouse';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UTL ${token}`
      });

      return this.http.post(url, { house }, { headers }).toPromise();
    });
  }

  deleteHouse(user: firebase.User, houseID: string): Promise<Object> {
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/account-deleteHouse';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UTL ${token}`
      });

      return this.http.post(url, { houseID }, { headers }).toPromise();
    });
  }

  updateHouse(user: firebase.User, houseID: string, house: House): Promise<Object> {
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/account-updateHouse';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UTL ${token}`
      });

      return this.http.post(url, { houseID, house }, { headers }).toPromise();
    });
  }

  setIotDeviceConfig(user: firebase.User, device: Device, houseID: string, floorPlanID: string) {
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/pubSub-setIotDeviceConfig';
      const headers = new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': `UTL ${token}`
      });
      console.log(device);
      return this.http.post(url, { device, houseID, floorPlanID }, { headers }).toPromise();
    });
  }

  getTags(account: Account, houseID: string, floorPlanID: string): Observable<Tag[]> {
    const tagCollection = this.accountCollection.doc(account.firebaseID).collection('tags', ref => 
      ref.where('houseID', '==' , houseID).where('floorPlanID', '==', floorPlanID));
    return tagCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(item => {
        const data = item.payload.doc.data() as Tag;
        const $key = item.payload.doc.id;
        return { $key, ...data };
      });
    }));
  }

  getHouses(account: Account): Observable<House[]> {
    const houseCollection = this.accountCollection.doc(account.firebaseID).collection('houses');
    return houseCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(item => {
        const data = item.payload.doc.data() as House;
        const $key = item.payload.doc.id;
        return { $key, ...data };
      });
    }));
  }

  getMobileDevices(account: Account): Observable<MobileDevice[]> {
    const mobileDeviceCollection = this.accountCollection.doc(account.firebaseID).collection('mobileDevices');
    return mobileDeviceCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(item => {
        const data = item.payload.doc.data() as MobileDevice;
        const $key = item.payload.doc.id;
        return { $key, ...data };
      });
    }));
  }

  testNotification(user: firebase.User, mobileDevice: MobileDevice): Promise<Object> {
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/account-testNotification';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UTL ${token}`
      });

      return this.http.post(url, { mobileDevice }, { headers }).toPromise();
    });
  }

  createFloorPlan(user: firebase.User, houseID: string, floorPlan: FloorPlan): Promise<Object> {
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/account-createFloorPlan';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UTL ${token}`
      });

      return this.http.post(url, { houseID, floorPlan }, { headers }).toPromise();
    });
  }

  deleteDevice(user: firebase.User, device: any): Promise<Object> {
    return user.getIdToken().then(token => {
      const url = 'https://us-central1-horinglih-cbf0e.cloudfunctions.net/device-deleteDevice';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `UTL ${token}`
      });

      return this.http.post(url, { device }, { headers }).toPromise();
    });
  }

  getFloorPlans(account: Account, houseID: string): Observable<FloorPlan[]> {
    const floorPlanCollection = this.accountCollection.doc(account.firebaseID)
                                .collection<House>('houses').doc(houseID).collection<FloorPlan>('floorPlans', ref => ref.orderBy('floor'));
    return floorPlanCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(item => {
        const data = item.payload.doc.data() as FloorPlan;
        const $key = item.payload.doc.id;
        return { $key, ...data };
      });
    }));
  }

  getFloorPlan(account: Account, houseID: string, floorPlanID: string): Observable<any> {
    const floorPlanCollection = this.accountCollection.doc(account.firebaseID).collection('houses').doc(houseID).collection('floorPlans');
    return floorPlanCollection.doc(floorPlanID).valueChanges();
  }

  getDevices(account: Account, houseID: string, floorPlanID: string): Observable<Device[]> {
    const deviceCollection = this.accountCollection.doc(account.firebaseID)
                              .collection<House>('houses').doc(houseID).collection<FloorPlan>('floorPlans').doc(floorPlanID)
                              .collection<Device>('devices');
    
    return deviceCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(item => {
        const data = item.payload.doc.data() as Device;
        const $key = item.payload.doc.id;
        return { $key, ...data }
      });
    }));
  }

  getDeviceRecords(account: Account, houseID: string, floorPlanID: string, deviceID: string): Observable<DeviceRecord[]> {
    const routerRecordCollection = this.accountCollection.doc(account.firebaseID)
                                    .collection<House>('houses').doc(houseID).collection<FloorPlan>('floorPlans').doc(floorPlanID)
                                    .collection<Device>('devices').doc(deviceID)
                                    .collection<DeviceRecord>('deviceRecords', ref => ref.orderBy('timestamp', 'desc').limit(3));

    return routerRecordCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(item => {
        const data = item.payload.doc.data() as DeviceRecord;
        const $key = item.payload.doc.id;
        return { $key, ...data };
      });
    }));
  }

  async uploadFloorPlan(user: firebase.User, houseId: string, account: Account,
                        houseAddress: string, imageFile: File, floorPlan: FloorPlan): Promise<any> {

    const accountRef = firebase.storage().ref().child(`${account.firebaseID}/${houseAddress}/${floorPlan.floor} `);
    const uploadTask = accountRef.put(imageFile);

    await uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) => {
      console.log('wait');
    },
    (error) => {
      console.log('error: ' + error);
    },
    async () => {
      console.log('upload complete');
      floorPlan.imageUrl = await this.getFloorPlanUrl(account, houseAddress, floorPlan);
      await this.createFloorPlan(user, houseId, floorPlan);
    });
  }

  async getFloorPlanUrl(account: Account, houseAddress: string, floorPlan: FloorPlan): Promise<string> {
    const accountRef = firebase.storage().ref().child(`${account.firebaseID}/${houseAddress}/${floorPlan.floor} `);
    let imageUrl = '';
    await accountRef.getDownloadURL().then(url => {
      imageUrl = url;
      return imageUrl;
    }).catch(error => console.log('get error from imageUrl: ' + error));
    return imageUrl;
  }

}
