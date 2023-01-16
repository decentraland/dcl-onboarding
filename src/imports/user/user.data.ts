
import * as ident from "@decentraland/Identity";
import { getPlatform, Platform } from "@decentraland/EnvironmentAPI"

// Only used locally
// Payload
type UserInfoDCL = {
    dclUserId: string
    wallet: string
    username: string
}

export class UserData {

    private static instanceRef: UserData;

    private userInfo: UserInfoDCL = {
        dclUserId: '',
        wallet: '',
        username: ''
    };

    private userData: ident.UserData = null;

    private platform: Platform = null

    private userId: string = null;
    private accessToken: string = null;

    private promiseUserData: Promise<ident.UserData>
    private promiseWallet: Promise<string>

    private constructor() { }
    // Singleton Instance of the Object
    static instance(): UserData { return this.instanceRef || (this.instanceRef = new this()); }

    
    async loadUserData(bForceLoad = false): Promise<UserInfoDCL>{
        if (this.userData && !bForceLoad) {
            return this.userInfo
        }
        if(!this.promiseUserData){
            this.promiseUserData = ident.getUserData()
        }
        if(!this.promiseWallet){
            this.promiseWallet = ident.getUserPublicKey()
        }

        this.userInfo.wallet = await this.promiseWallet
        this.userData = await this.promiseUserData

        this.userInfo.dclUserId = this.userData.userId

        this.userInfo.username = ''
        if (this.userData && this.userData.displayName) {
            this.userInfo.username = this.userData.displayName
        }
        return this.userInfo
    }

    async loadPlatform() {
        if(this.platform) return;
        
        this.platform = await getPlatform()
    }

    isDesktop() {
        if (!this.platform) {
            return false
        }
        return this.platform == Platform.DESKTOP
    }
    
    getUserData(): ident.UserData {
        return this.userData
    }
    
    getWallet(): string {
        return this.userInfo.wallet
    }
    getDclName(): string {
        return this.userInfo.username
    }
    getDclUserId(): string {
        if (this.getWallet()) {
            return this.getWallet()
        }
        return this.userInfo.dclUserId
    }

    getUserId(): string {
        return this.userId
    }

    getAccessToken(): string {
        return this.accessToken
    }

    userIsAuth(): boolean {
        return this.accessToken ? true : false;
    }

    setUserLogin(userId: string, token:string){
        this.userId = userId
        this.accessToken = token
    }
    
    isGuest() {
        if (this.getWallet()) {
            return false
        }
        return true
    }

}




