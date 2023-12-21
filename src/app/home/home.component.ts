import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OffersService } from '../services/offers.service';
import { Offer } from '../interfaces/offer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{

  offersSubscription!: Subscription;

  offers: Offer[] = [];

  constructor(
    private router: Router,
    private offerService: OffersService
  ) {}

  ngOnInit(): void {
      this.initOffers();
  }

  initOffers(): void {
    this.offersSubscription = this.offerService.offersSubject.subscribe({
      next: offers => this.offers = offers,
      error: console.error
    })

    //? Après avoir souscrit à this.offerService.offersSubject, on déclenche la méthode this.offerService.getOffers() pour récupérer la liste des offres depuis Firebase
    this.offerService.getOffers();
  }

  ngOnDestroy(): void {
      this.offersSubscription.unsubscribe();
  }

}
