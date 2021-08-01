import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full',
  },

  {
    path: 'market',
    loadChildren: () =>
      import('./pages/market/market.module').then((m) => m.MarketPageModule),
  },
  {
    path: 'invest',
    loadChildren: () =>
      import('./pages/invest/invest.module').then((m) => m.InvestPageModule),
  },
  {
    path: 'trade',
    loadChildren: () =>
      import('./pages/trade/trade.module').then((m) => m.TradePageModule),
  },
  {
    path: 'game',
    loadChildren: () =>
      import('./pages/game/game.module').then((m) => m.GamePageModule),
  },
  {
    path: 'tower',
    loadChildren: () =>
      import('./pages/game/listgame/tower/tower.module').then(
        (m) => m.TowerPageModule
      ),
  },
  {
    path: 'knife',
    loadChildren: () =>
      import('./pages/game/listgame/knife/knife.module').then(
        (m) => m.KnifePageModule
      ),
  },
  {
    path: 'galaxy',
    loadChildren: () =>
      import('./pages/game/listgame/galaxy/galaxy.module').then(
        (m) => m.GalaxyPageModule
      ),
  },
  {
    path: 'crash',
    loadChildren: () =>
      import('./pages/game/listgame/crash/crash.module').then(
        (m) => m.CrashPageModule
      ),
  },
  {
    path: 'wheel',
    loadChildren: () =>
      import('./pages/game/listgame/wheel/wheel.module').then(
        (m) => m.WheelPageModule
      ),
  },
  {
    path: 'pick',
    loadChildren: () =>
      import('./pages/game/listgame/pick/pick.module').then(
        (m) => m.PickPageModule
      ),
  },
  {
    path: 'spin',
    loadChildren: () =>
      import('./pages/game/listgame/spin/spin.module').then(
        (m) => m.SpinPageModule
      ),
  },
  {
    path: 'shoot',
    loadChildren: () =>
      import('./pages/game/listgame/shoot/shoot.module').then(
        (m) => m.ShootPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
