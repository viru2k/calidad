import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PrimeNGConfig } from "primeng-lts/api";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  subscriptionTranslation: Subscription;

  constructor(
    public translate: TranslateService,
    public primeNGConfig: PrimeNGConfig
  ) {
    translate.addLangs(["es", "en", "fr"]);
    translate.setDefaultLang("es");
    this.translate.use("es");
    this.subscriptionTranslation = this.translate
      .stream("primeng")
      .subscribe((data) => {
        this.primeNGConfig.setTranslation(data);
      });
  }

  ngOnDestroy() {
    if (this.subscriptionTranslation) {
      this.subscriptionTranslation.unsubscribe();
    }
  }
  title = "calidad";
}

/*   constructor(private updates: SwUpdate){
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => document.location.reload());
    });
  } */
