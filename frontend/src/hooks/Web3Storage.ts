// import { Web3Storage } from 'web3.storage';
// @ts-ignore
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

export const useWeb3Storage = () => ({
  async storeAsJson(content: any, fileName: string): Promise<string> {
    if (!process.env.REACT_APP_WEB3_STORAGE_TOKEN) {
      throw new Error('Web3storage token not defined');
    }

    const storage = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN });

    const stringifiedContent = JSON.stringify(content);
    const file = new File([stringifiedContent], fileName, { type: 'application/json' });
    return storage.put([file], { wrapWithDirectory: false });
  },
});
