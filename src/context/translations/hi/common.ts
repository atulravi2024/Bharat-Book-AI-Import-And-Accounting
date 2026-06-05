import { sales } from './domains/sales';
import { inventory } from './domains/inventory';
import { system } from './domains/system';
import { ui } from './domains/ui';

export const common: Record<string, string> = {
  ...ui,
  ...sales,
  ...inventory,
  ...system,
};
