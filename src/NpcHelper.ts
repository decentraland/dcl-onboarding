import { IClaimProvider } from "./claiming-dropin/claiming/defaultClaimProvider";

class NpcHelper{
    public targetNpc : IClaimProvider;

    public collectNpcReward() : void {
        if(this.targetNpc === null || this.targetNpc === undefined) return;
        this.targetNpc.isCollected = true;
        this.targetNpc = null;
    }
}

export const npcHelper = new NpcHelper();