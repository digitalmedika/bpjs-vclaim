import { BaseApi } from '../core/base.js';
import type { VClaimType } from '../core/types.js';

export abstract class VClaimBaseApi extends BaseApi {
  protected type: VClaimType = 'vclaim';
}
