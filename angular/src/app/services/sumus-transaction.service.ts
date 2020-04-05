import { Injectable } from '@angular/core';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class SumusTransactionService {

  constructor() {}

  makeTransferAssetTransaction(signerPrivateKey: string, toAddress: string, token: string, amount: string, nonce: number) {
    const singer = window['mint'].Signer.FromPK(signerPrivateKey);
    const tx = singer.SignTransferAssetTx(nonce, toAddress, token, amount);

    return {
      txData: tx.Data,
      txDigest: tx.Digest,
      txName: tx.Name
    }
  }

  feeCalculate(mnt: string = '0', gold: string = '0', token: string): string {
    if (token.toUpperCase() === 'MNT') {
      return '0.02';
    }

    if (!window.hasOwnProperty('BigInt')) {
      return '0';
    }

    const BigInt = window['BigInt'];
    const _gold = this.toBigInt(gold);
    const _mnt = this.toBigInt(mnt);
    let fee;

    const mnt10 = BigInt("10000000000000000000");
    const mnt1000 = BigInt("1000000000000000000000");
    const mnt10000 = BigInt("10000000000000000000000");
    const maxFeeFor10k = BigInt("2000000000000000");
    const minFee = BigInt("20000000000000");

    if (_gold == 0) return '0';

    if (_mnt < mnt10) {
      fee = _gold / BigInt(1000); // 0.1%
    }
    else if (_mnt >= mnt10 && _mnt < mnt1000) {
      fee = BigInt(3) * _gold / BigInt(10000); // 0.03%
    }
    else if (_mnt >= mnt1000 && _mnt < mnt10000) {
      fee = BigInt(3) * _gold / BigInt(100000); // 0.003%
    }
    else if (_mnt >= mnt10000) {
      fee = BigInt(3) * _gold / BigInt(100000); // 0.003%

      if (fee > maxFeeFor10k) {
        fee = maxFeeFor10k;
      }
    }

    if (fee < minFee) {
      fee = minFee;
    }

    return new BigNumber(fee).div(Math.pow(10, 18)).toString();
  }

  toBigInt(value: string) {
    let parts = value.toString().split('.');
    let result;

    if (parts.length > 1) {
      let rightPart = parts[1];
      for (let i = parts[1].length; i < 18; i++) {
        rightPart += '0';
      }
      result = parts[0] + rightPart.slice(0, 18);
    } else {
      let leftPart = parts[0];
      for (let i = 0; i < 18; i++) {
        leftPart += '0';
      }
      result = leftPart;
    }
    return window['BigInt'](result);
  }

}
