import { HashConnect, HashConnectTypes, MessageTypes } from '@hashgraph/sdk';

class HashConnectService {
  private hashconnect: HashConnect | null = null;
  private appMetadata: HashConnectTypes.AppMetadata = {
    name: "Space Fighters",
    description: "Play epic space battles and earn NFT rewards on Hedera",
    icon: window.location.origin + "/spacpic.jpg",
    url: window.location.origin
  };

  async init() {
    try {
      this.hashconnect = new HashConnect();
      
      // Set up event listeners
      this.hashconnect.pairingEvent.on((pairingData) => {
        console.log('HashPack paired:', pairingData);
      });

      this.hashconnect.disconnectionEvent.on(() => {
        console.log('HashPack disconnected');
      });

      this.hashconnect.connectionStatusChangeEvent.on((state) => {
        console.log('HashPack connection state:', state);
      });

      // Initialize
      const initData = await this.hashconnect.init(this.appMetadata, "testnet", false);
      console.log('HashConnect initialized:', initData);

      return initData;
    } catch (error) {
      console.error('Error initializing HashConnect:', error);
      throw error;
    }
  }

  async connect() {
    if (!this.hashconnect) {
      await this.init();
    }

    try {
      // Open pairing modal
      this.hashconnect!.openPairingModal();
      
      // Wait for pairing
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 60000); // 60 seconds timeout

        this.hashconnect!.pairingEvent.once((pairingData) => {
          clearTimeout(timeout);
          resolve(pairingData);
        });
      });
    } catch (error) {
      console.error('Error connecting HashPack:', error);
      throw error;
    }
  }

  getPairingData() {
    return this.hashconnect?.hcData;
  }

  getAccountId(): string | null {
    const pairingData = this.getPairingData();
    return pairingData?.accountIds?.[0] || null;
  }

  async disconnect() {
    if (this.hashconnect) {
      await this.hashconnect.disconnect();
      this.hashconnect = null;
    }
  }

  async sendTransaction(transaction: any) {
    if (!this.hashconnect) {
      throw new Error('HashConnect not initialized');
    }

    try {
      const response = await this.hashconnect.sendTransaction(
        this.getAccountId()!,
        transaction
      );
      return response;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  getHashConnect() {
    return this.hashconnect;
  }
}

export const hashConnectService = new HashConnectService();
