import BigNumber from 'bignumber.js';

interface IUseUtils {
  formatWei: (input: BigNumber) => string;
  areAddressesEqual: (a1: string, a2: string) => boolean;
  isValidAddress: (address: string) => boolean;
}

export const useUtils = (): IUseUtils => ({
  formatWei(input: BigNumber): string {
    const parsed = parseInt(input.dividedBy(1000000000).toString(), 10);
    return new Intl.NumberFormat().format(parsed) + ' gwei';
  },
  areAddressesEqual(a1: string, a2: string): boolean {
    return (a1 || '').trim().toLowerCase() === (a2 || '').trim().toLowerCase();
  },
  isValidAddress(address: string): boolean {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
    } else {
      // Should validate checksum, but let's assume it's valid :)
      return true;
    }
  },

});
