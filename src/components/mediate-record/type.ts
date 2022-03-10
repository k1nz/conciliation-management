import { GetPartsRequired } from '@/types/utils';
import * as BIZ from '@/types/business';

export type PartyPropType = Array<GetPartsRequired<Partial<BIZ.IParty>, 'partyId' | 'applicationDate'>>;
