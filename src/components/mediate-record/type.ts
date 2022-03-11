import { GetPartsRequired } from '@/types/utils';
import * as BIZ from '@/types/business';

export type PartialPartyType = GetPartsRequired<Partial<BIZ.IParty>, 'partyId' | 'applicationDate'>;
