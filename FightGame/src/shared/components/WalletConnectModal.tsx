import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectModalProps {
  open: boolean;
  onMetaMaskConnect: () => void;
  onHashPackConnect: () => void;
  isConnecting: boolean;
}

export const WalletConnectModal = ({
  open,
  onMetaMaskConnect,
  onHashPackConnect,
  isConnecting,
}: WalletConnectModalProps) => {
  return (
    <Dialog open={open} modal={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connectez votre Wallet
          </DialogTitle>
          <DialogDescription>
            Pour jouer, vous devez connecter un wallet Web3
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={onMetaMaskConnect}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
              alt="MetaMask" 
              className="h-5 w-5 mr-2"
            />
            MetaMask
          </Button>
          
          <Button
            onClick={onHashPackConnect}
            disabled={isConnecting}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <img 
              src="https://www.hashpack.app/assets/logo-color.svg" 
              alt="HashPack" 
              className="h-5 w-5 mr-2"
            />
            HashPack
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Réseau : Hedera Testnet
        </p>
      </DialogContent>
    </Dialog>
  );
};
