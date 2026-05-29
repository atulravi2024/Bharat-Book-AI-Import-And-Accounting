import { auth } from './auth';
import { dashboard } from './dashboard';
import { header } from './header';
import { imports } from './imports';
import { masters } from './masters';
import { navigation } from './navigation';
import { reports } from './reports';
import { settings } from './settings';
import { transactions } from './transactions';
import { audit } from './audit';
import { system } from './system';
import { vouchers } from './vouchers';
import { support } from './support';
import { datetime } from './datetime';
import { ui } from './ui';
import { inventory } from './inventory';
import { finance } from './finance';
import { common } from './common';

const hi: Record<string, string> = {
  ...auth,
  ...dashboard,
  ...header,
  ...imports,
  ...masters,
  ...navigation,
  ...reports,
  ...settings,
  ...transactions,
  ...audit,
  ...system,
  ...vouchers,
  ...support,
  ...datetime,
  ...ui,
  ...inventory,
  ...finance,
  ...common,
};

export default hi;
