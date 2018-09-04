import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from './../model/account';
import { House } from './../model/house';
import { FloorPlan } from '../model/floorPlan';
import { Tag, TagRecord } from '../model/tag';
import { MobileDevice } from '../model/mobileDevice';
import { Device } from '../model/device';

import { AccountService } from './../services/account.service';
import { GoogleMapService } from './../services/google-map.service';
import { FileService } from './../services/file.service';

import * as firebase from 'firebase';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  private authUser: Observable<firebase.User>;
  private user: firebase.User;

  loggedAccount: Account = null;
  accounts: Observable<Account[]>;
  houses: Observable<House[]>;
  mobileDevices: Observable<MobileDevice[]>;
  floorPlans: Observable<FloorPlan[]>;
  devices: Observable<Device[]>;
  tags: Observable<Tag[]>;
  seletedFloorPlan: FloorPlan;
  tagsLength: number;
  accountLength: number;
  isLogged = false;
  floorPlanImageVisible = false;
  floorPlanVisible = false;
  floorPlanSettingVisible = false;
  updateVisible = false;
  seletedHouse: string;
  seletedFloorPlanID: string;
  seletedSettingHouse: string;
  seletedHouseAddress: string;
  seletedHouseId = null;
  seletedSettingHouseId = null;
  seletedHouseIdFromButton: string;
  seletedFile: File;
  seletedFloor: number;

  allDevices: Array<Object> = [];
  allRecords: Array<Object> = [];

  intervalRef: any;

  deletePermission: Boolean;

  test: any;
  divWidth: number;
  divHeight: number;
  fireimgHeight: number;
  fireimgVisible: boolean;

  historys: any[] = [];

  imageUrl: string;

  destroy: Subscription;
  subItem: string ;

  lat: number;
  lng: number;
  zoomValue = 21;

  @Input() email;
  @Input() password;
  @Input() updateAddress: House = { address: null};
  @Input() newHouse: House = { address: null} ;
  @Input() floorPlan: FloorPlan = {
    imageUrl : null,
    filename : null,
    floor : null,
    upperLeft: { longitude: null, latitude: null },
    lowerRight: { longitude: null, latitude: null }
  };
  markers: Marker[] = [];

  constructor(private auth: AngularFireAuth,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private googleMapsService: GoogleMapService,
    private fileService: FileService,
    private __zone: NgZone) {
      this.authUser = this.auth.authState;
      this.authUser.subscribe(user => {
        if (user) {
          this.user = user;
          this.isLogged = true;
          this.accountService.getAccount(user.uid).subscribe(account => {
            if (this.loggedAccount && !account) {
              this.signOut();
            }
            this.loggedAccount = account;
            this.destroy = this.activatedRoute.params.subscribe(subItem => {
              this.subItem = subItem['subItem'];
              switch (this.subItem) {
                case 'monitor':
                  this.hideAll();
                  this.getDevices(this.loggedAccount);
                  break;
                case 'profile':
                  this.hideAll();
                  this.getAccounts();
                  break;
                case 'history':
                  this.hideAll();
                  this.getHistories(this.loggedAccount);
                  break;
                case 'wan-test':
                case 'advanced':
                  this.hideAll();
                  this.getHouses(this.loggedAccount);
                  break;
                case 'actionTest':
                  break;
                case 'offline':
                 break;
                case 'lowPower':
                  break;
                case 'notice':
                  this.hideAll();
                  this.getMobileDevices(this.loggedAccount);
                  break;
                default:
                  break;
              }
            });
          });
        } else {
          this.loggedAccount = null;
          this.isLogged = false;
          this.router.navigate(['/login']);
        }
      });
    }

  ngOnInit() {
  }

  signOut() {
    this.auth.auth.signOut().catch(error => console.log('Sign Out Error', error));
  }

  getAccounts(): void {
    this.accounts = this.accountService.getAccountsPaginate().pipe(map(accounts => {
      this.accountLength = accounts.length;
      return accounts.filter(account => {
        if (this.loggedAccount.firebaseID === account.firebaseID) {
          return true;
        }
        if (this.loggedAccount.role === 'manager') {
          return true;
        } else if (this.loggedAccount.role === 'staff') {
          return account.role !== 'manager';
        }
      });
    }));
  }

  getHouses(account: Account): void {
    this.houses = this.accountService.getHouses(account);
  }

  getFloorPlans(account: Account, houseId: string, address: string): void {
    this.hideAll();
    this.floorPlanVisible = true;
    this.seletedHouse = address;
    this.seletedHouseId = houseId;
    this.floorPlans = this.accountService.getFloorPlans(account, houseId);
  }

  addHouse(): void {
    this.accountService.createHouse(this.user, this.newHouse)
      .then(() => this.newHouse = { address: null })
      .catch(error => console.log('Add House Error', error));
  }

  updateHouse(houseId: string, house: House) {
    this.accountService.updateHouse(this.user, houseId, house)
      .then(() => {
        console.log('update success');
        this.updateAddress = { address: null };
        this.hideAll();
      })
      .catch(error => {
        console.log('update House Error', error);
        this.hideAll();
      });
  }

  deleteHouse(houseId: string): void {
    this.accountService.deleteHouse(this.user, houseId)
      .then(() => console.log('delete success'))
      .catch(error => console.log('Delete House Error', error));
  }

  showFloorPlan(houseID: string, floorPlan): void {
    this.clearAll();
    this.accountService.getFloorPlan(this.loggedAccount, houseID, floorPlan.$key).subscribe(seletedFloorPlan => {
      this.seletedFloorPlan = seletedFloorPlan;
      this.seletedFloor = this.seletedFloorPlan.floor;
      this.seletedFloorPlanID = floorPlan.$key;
      this.onImageLoad(this.seletedFloorPlan, houseID, floorPlan.$key);
      this.floorPlanImageVisible = true;
    });
    // this.googleMapsService.groundOverlay(this.floorPlanImageUrl);
  }

  showFloorDetail(account: Account, houseId: string, address: string): void {
    this.hideAll();
    this.floorPlanSettingVisible = true;
    this.seletedSettingHouse = address;            // (mapReady)="getLatLngByAddr(seletedHouse)"
    this.seletedSettingHouseId = houseId;
    console.log(this.seletedSettingHouse);
  }

  modifyHouse(address: string) {
    this.hideAll();
    this.seletedHouseAddress = address;
    this.updateAddress.address = address;
  }

  showUpdateButton(seletedHouseIdFromButton: string) {
    this.seletedHouseIdFromButton = seletedHouseIdFromButton;
  }

  hideUpdateButton() {
    this.seletedHouseIdFromButton = null;
  }

  getMobileDevices(account) {
    this.mobileDevices = this.accountService.getMobileDevices(account);
  }

  testNotification(mobileDevice: MobileDevice) {
    this.accountService.testNotification(this.user, mobileDevice);
  }

  wanTest() {
    prompt('全區測試，還沒做');
  }

  lanTest() {
    const messaging = firebase.messaging();
    messaging.requestPermission().then(() => {
      console.log('Notification permission granted.')
      return messaging.getToken()
    }).then(token => {
      console.log('token:', token);
    }).catch(error => console.log(error));

    messaging.onMessage(payload => {
      console.log('Message received. ', payload.notification.body);
    })
  }

  localTest(device) {
    if (device.type != 'Node') {
      this.accountService.setIotDeviceConfig(this.user, device, this.seletedHouseId, this.seletedFloorPlanID);
      alert('單一測試，送出');
    }
  }

  checkBox(): Boolean {
    const deleteCommand = prompt('請輸入 \'DELETE\' 刪除');
    if (deleteCommand === 'DELETE') {
      return true;
    } else {
      return false;
    }
  }

  testDelete(array: Array<any>, device) {
    let result = array.filter((element) => {
      return element.$key != device.MAC_address;
    })
    return result
  }

  deleteDevice(device) {
    this.deletePermission = this.checkBox();
    if (this.deletePermission) {
      this.accountService.deleteDevice(this.user, device).then(() => {
        this.allDevices = this.testDelete(this.allDevices, device);
      })
    } else {
      console.log('input delete failed');
    }
  }

  hideAll() {
    this.seletedHouseIdFromButton = null;
    this.seletedHouseAddress = null;
    this.updateVisible = false;
    this.mobileDevices = null;
    this.floorPlanVisible = false;
    this.floorPlanSettingVisible = false;
    this.floorPlanImageVisible = false;
    this.seletedHouseId = null;
    this.seletedSettingHouseId = null;
    this.seletedHouse = null;
    this.seletedFloorPlanID = null;
    this.seletedSettingHouse = null;
    this.floorPlan.upperLeft = null;
    this.floorPlan.lowerRight = null;
    this.floorPlan.floor = null;
    this.seletedFloorPlan = null;
    this.seletedFile = null;
    this.markers = [];
    this.seletedFloor = null;
    this.fireimgVisible = null;
    this.allDevices = [];
  }

  clearAll() {
    this.floorPlan.upperLeft = null;
    this.floorPlan.lowerRight = null;
    this.floorPlan.floor = null;
    this.seletedFile = null;
    this.allRecords = [];

  }

  onChoseLocation(event) {
    this.markers.push({
      latitude: event.coords.lat,
      longitude: event.coords.lng,
      draggable: true
    });
    this.floorPlan.upperLeft = this.markers[0];       // 左上  經緯度
    this.floorPlan.lowerRight = this.markers[1];      // 右下  經緯度

    if (this.markers.length > 2) {
      this.markers = [];
    }
  }

  uploadFile(event) {
    this.seletedFile = event.target.files[0];
  }

  async uploadFloorPlan(account: Account, houseAddress: string, houseID: string) {
    this.floorPlan.filename = this.seletedFile.name;
    await this.accountService.uploadFloorPlan(this.user, houseID, account, houseAddress, this.seletedFile, this.floorPlan);
  }

  getLatLngByAddr(address: string) {
    console.log('in');
    this.googleMapsService.getLatLan(address).subscribe(result => {
      this.__zone.run(() => {
        this.lat = result.lat();
        this.lng = result.lng();
      });
    },
    error => console.log(error),
    () => console.log('Geocoding completed'));
  }

  /* 取得使用者所有的裝置
  * 須注意新增或是刪除或是變更的時候會發生,subscribe
  */

  getDevices(account) {
    this.accountService.getHouses(account).subscribe(houses => {
      houses.map((house: any) => {
        this.accountService.getFloorPlans(account, house.$key).subscribe(floorPlans => {
          floorPlans.map((floorPlan: any) => {
            
            this.accountService.getDevices(account, house.$key, floorPlan.$key).subscribe(devices => {
              if (devices == null) {
                this.getDevices(account);
              }
              devices.map(device => {
                this.allDevices.push(device);
                this.allDevices = this.filterRepeat(this.allDevices);
              })
            })
          });
        });
      });
    });
    console.log(this.allDevices)
  }

  getHistories(account) {
    this.accountService.getHouses(account).subscribe(houses => {
      houses.map((house: any) => {
        this.accountService.getFloorPlans(account, house.$key).subscribe(floorPlans => {
          floorPlans.map((floorPlan: any) => {

            this.accountService.getDevices(account, house.$key, floorPlan.$key).subscribe(devices => {
              if (devices == null) {
                this.getHistories(account);
              }

              devices.map(device => {
                this.accountService.getDeviceRecords(account, house.$key, floorPlan.$key, device.MAC_address).subscribe(deviceRecords => {
                  deviceRecords.map(deviceRecord => {
                    this.allRecords.push(deviceRecord);
                    this.allRecords = this.filterRepeat(this.allRecords);
                  })
                })
              })
            })
          });
        });
      });
    });
  }

  exportExcel(data) {
    console.log('1');
    const name = 'test';
    const get = this.fileService.exportDataAsExcel(data, name);
    console.log(get.fileName);
    console.log(get.data);
    console.log(get);
  }

  /* 將array中重複的元素去除
  * @parameter: array
  * @步驟: 遍歷元素，找出 index number，用array最後一個的元素去覆蓋同樣 $key 的元素
  * @步驟: 遍歷元素將重複的去除
  */
  filterRepeat(array: Array<any>) {
    let elementNumber = array.map((element) => {
      return element.$key;
    }).indexOf(array[array.length - 1].$key);
    if (array[elementNumber].$key === array[array.length - 1].$key) {
      array.splice(elementNumber, 1, array[array.length - 1]);
    }
    const set = new Set();
    const result = array.filter(item => !set.has(item.$key) ? set.add(item.$key) : false);
    elementNumber = null;
    return result;
  }

  /* 取得此樓層的所有device
  * @parameter: loggedAccount, houseID, floorPlanID
  */
  getDevice(houseID, floorPlanID) {
    this.devices = this.accountService.getDevices(this.loggedAccount, houseID, floorPlanID);
    this.tags = this.accountService.getTags(this.loggedAccount, houseID, floorPlanID).pipe(map(tags => {
      this.tagsLength = tags.length;
      return tags;
    }))

    // this.tags.forEach(tag => console.log(tag))
  }

  /*
  * @parameter: longitude and latitude 為探測器經緯度
  * @variable: fireLeft and fireTop 為以左上角為基準的 pixel
  */
  calculateImgPosition(houseID, floorPlanID, floorPlan) {
    this.getDevice(houseID, floorPlanID);
  }

  onImageLoad(seletedFloorPlan: FloorPlan, houseID: string, floorPlanID: string) {
    const div = document.getElementById('imgBox');
    const img = new Image();
    img.src = this.seletedFloorPlan.imageUrl;
    img.addEventListener('load', () => {
      const proportion = img.height / img.width;
      this.divWidth = div.clientWidth;
      this.divHeight = this.divWidth * proportion;
      this.fireimgHeight = this.divWidth / 25;
      this.fireimgVisible = true;
      this.calculateImgPosition(houseID, floorPlanID, seletedFloorPlan);
      // console.log('this.fireimgHeight: ' + this.fireimgHeight);

      // console.log('this.divHeight: ' + this.divHeight);
      // console.log('image height: ' + img.height);
      // console.log('image width: ' + img.width);
      // console.log(document.body.clientWidth);
      // console.log(document.body.clientHeight);
      // console.log('div 的寬度: ' + div.clientWidth);
    });
    // const newImg = this.getImg(this.floorPlanImageUrl);
  }


}

interface Marker {
  latitude: number;
  longitude: number;
  draggable: boolean;
}
