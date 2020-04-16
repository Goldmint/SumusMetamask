import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { AccountComponent } from "./components/home/account/account.component";
import { CreateAccountComponent } from "./components/home/create-account/create-account.component";
import { AuthComponent } from "./components/auth/auth.component";
import { DetailsAccountComponent } from "./components/home/details-account/details-account.component";
import { SendTokensComponent } from "./components/home/send-tokens/send-tokens.component";
import { BackupComponent } from "./components/home/backup/backup.component";
import { AuthGuard } from "./services/auth.guard";
import { NewWalletComponent } from "./components/auth/new-wallet/new-wallet.component";
import { ConfirmTransactionComponent } from "./components/auth/confirm-transaction/confirm-transaction.component";
import { ApproveAddressComponent } from "./components/home/approve-address/approve-address.component";
import { ImportAccountComponent } from './components/home/import-account/import-account.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'new-wallet', component: NewWalletComponent },
      { path: 'confirm-transaction', component: ConfirmTransactionComponent },
    ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'account', component: AccountComponent },
      { path: 'create-account', component: CreateAccountComponent },
      { path: 'import-account', component: ImportAccountComponent },
      { path: 'account-details', component: DetailsAccountComponent },
      { path: 'send-tokens/:id', component: SendTokensComponent },
      { path: 'send-tokens/:id/:address', component: SendTokensComponent },
      { path: 'send-tokens/:id/:address/:amount', component: SendTokensComponent },
      { path: 'backup', component: BackupComponent },
      { path: 'approve-address', component: ApproveAddressComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
