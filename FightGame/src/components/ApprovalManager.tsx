import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ShieldCheck, ShieldX, Loader2, AlertTriangle } from 'lucide-react';
import { useNFTApproval } from '@/hooks/useNFTApproval';

interface ApprovalManagerProps {
  wallet: any;
  onApprovalStatusChange?: (isApproved: boolean) => void;
  compact?: boolean;
}

export const ApprovalManager = ({ wallet, onApprovalStatusChange, compact = false }: ApprovalManagerProps) => {
  const {
    isApprovedForAll,
    isCheckingApproval,
    approveMarketplace,
    revokeMarketplaceApproval,
    checkApprovalStatus,
  } = useNFTApproval(wallet);

  useEffect(() => {
    if (wallet?.address) {
      checkApprovalStatus();
    }
  }, [wallet?.address]);

  useEffect(() => {
    if (onApprovalStatusChange) {
      onApprovalStatusChange(isApprovedForAll);
    }
  }, [isApprovedForAll, onApprovalStatusChange]);

  if (!wallet?.address) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>
          Please connect your wallet to manage NFT approvals.
        </AlertDescription>
      </Alert>
    );
  }

  if (isCheckingApproval) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Checking approval status...</span>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur rounded-lg border border-border/50">
        {isApprovedForAll ? (
          <>
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-500">Marketplace Approved</p>
              <p className="text-xs text-muted-foreground">You can list your NFTs</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={revokeMarketplaceApproval}
            >
              Revoke
            </Button>
          </>
        ) : (
          <>
            <ShieldX className="h-5 w-5 text-amber-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-500">Approval Required</p>
              <p className="text-xs text-muted-foreground">Approve to list NFTs</p>
            </div>
            <Button
              variant="hero"
              size="sm"
              onClick={approveMarketplace}
            >
              <Shield className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>NFT Marketplace Approval</CardTitle>
            <CardDescription>
              Authorize the marketplace to transfer your NFTs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isApprovedForAll ? (
          <>
            <Alert className="border-green-500/50 bg-green-500/10">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">Marketplace Approved</AlertTitle>
              <AlertDescription className="text-green-400/80">
                The marketplace is authorized to transfer your NFTs. You can now list your NFTs for sale.
              </AlertDescription>
            </Alert>

            <div className="bg-card/30 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-semibold">What does this mean?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>You can list any of your NFTs on the marketplace</li>
                <li>The marketplace can transfer NFTs only when someone buys them</li>
                <li>You remain the owner until a sale is completed</li>
                <li>You can revoke this approval at any time</li>
              </ul>
            </div>

            <Button
              variant="outline"
              onClick={revokeMarketplaceApproval}
              className="w-full"
            >
              <ShieldX className="mr-2 h-4 w-4" />
              Revoke Marketplace Approval
            </Button>
          </>
        ) : (
          <>
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-500">Approval Required</AlertTitle>
              <AlertDescription className="text-amber-400/80">
                Before listing NFTs, you must approve the marketplace to transfer them on your behalf.
                This is a one-time transaction.
              </AlertDescription>
            </Alert>

            <div className="bg-card/30 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold">Why is this needed?</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <p>The marketplace contract needs permission to transfer your NFT to buyers</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <p>This approval is secure and follows ERC-721 standards</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <p>You only need to approve once for all your NFTs</p>
                </div>
              </div>
            </div>

            <Button
              variant="hero"
              onClick={approveMarketplace}
              className="w-full"
              size="lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Approve Marketplace
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              A transaction will be sent to your wallet for approval
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
