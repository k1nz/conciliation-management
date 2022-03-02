import requestInstance from '../index';
import * as MED from '@/types/mediation';

enum SYS_PREFIX {
  medOffice = '/med_office',
  mediator = '/mediator',
}

// 调解室
export const getMedOffice = (data?: MED.IReqGetMedOffice) => {
  return requestInstance.get<MED.IMedOfficeType>({
    url: `${SYS_PREFIX.medOffice}`,
    data,
  });
};
