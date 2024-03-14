import { appConfig } from '../domain/config/appConfig';

class SecretUrlService {
  constructor(private whiteLists: string[]) {}
  validateSecretUrl(url: string) {
    return this.whiteLists.includes(url);
  }
}

export const secretUrlService = new SecretUrlService(appConfig.secretUrls);
