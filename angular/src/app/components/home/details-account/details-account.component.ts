import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StorageData} from "../../../interfaces/storage-data";
import {Wallet} from "../../../interfaces/wallet";
import {Subscription} from "rxjs/index";
import {CommonService} from "../../../services/common.service";
import {GenerateWalletService} from "../../../services/generate-wallet.service";

@Component({
  selector: 'app-details-account',
  templateUrl: './details-account.component.html',
  styleUrls: ['./details-account.component.scss']
})
export class DetailsAccountComponent implements OnInit, OnDestroy {

  @ViewChild('passwordRef') passwordRef;

  public storageData: StorageData;
  public currentWallet: Wallet;
  public view = ['public', 'private', 'show_private'];
  public currentView = this.view[0];
  public privateKey: string = null;
  public password: string = '';
  public incorrectPass: boolean = false;
  public addressCopied: boolean = false;
  public privateKeyCopied: boolean = false;

  private chrome = window['chrome'];
  private sub1: Subscription;

  constructor(
    private ref: ChangeDetectorRef,
    private commonService: CommonService,
    private generateWalletService: GenerateWalletService
    ) { }

  ngOnInit() {
    this.getStorageData();

    this.sub1 = this.commonService.chooseAccount$.subscribe(() => {
      this.getStorageData();
    });
  }

  getStorageData() {
    this.chrome.storage.local.get(null, (result:StorageData) => {
      this.storageData = result;
      this.currentWallet = this.storageData.wallets[this.storageData.currentWallet];
      this.back();
      this.ref.detectChanges();
    });
  }

  copyAddress() {
    this.commonService.copyText(this.currentWallet.publicKey);
    this.addressCopied = true;
    this.ref.detectChanges();
  }

  copyPrivateKey() {
    this.commonService.copyText(this.privateKey);
    this.privateKeyCopied = true;
    this.ref.detectChanges();
  }

  showPrivateKey() {
    this.currentView = this.view[1];
    setTimeout(() => {
      this.passwordRef.nativeElement.focus();
      this.ref.detectChanges();
    }, 0);
  }

  async confirm() {
    try {
      const result = await this.generateWalletService.getPrivateKey(this.currentWallet.publicKey, this.password);
      this.privateKey = (result && result.length > 50) ? result : '';
      this.incorrectPass = false;
      this.currentView = this.view[2];
    } catch (e) {
      this.incorrectPass = true;
    }
    this.ref.detectChanges();
  }

  back() {
    this.privateKey = null;
    this.password = '';
    this.incorrectPass = false;
    this.currentView = this.view[0];
    this.addressCopied = false;
    this.privateKeyCopied = false;
    this.ref.detectChanges();
  }

  ngOnDestroy() {
    this.sub1 && this.sub1.unsubscribe();
  }
}
