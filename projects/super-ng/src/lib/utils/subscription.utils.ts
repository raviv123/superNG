import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable()
export class SubscriptionUtils implements OnDestroy {
    subscription: Subscription = new Subscription();

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    
}