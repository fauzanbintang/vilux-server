import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

export const ImageKitProvider: Provider = {
  provide: 'IMAGEKIT',
  useFactory: (configService: ConfigService) => {
    const publicKey = configService.get('PUBLIC_KEY');
    const privateKey = configService.get('PRIVATE_KEY');
    const urlEndpoint = configService.get('URL_ENDPOINT');

    return new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  },
  inject: [ConfigService],
};
