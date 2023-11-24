import { Injectable } from '@angular/core';
import { Offer } from 'src/app/Interfaces/offer';

@Injectable({
  providedIn: 'root'
})

export class OffersService {

  //! Données (en privée pour le pas être modifiées depuis l'extérieur du service)
  private offers: Offer[] = [
    {
      title: 'renault Captur 1.5L DCI 175000 km',
      brand: 'Renault',
      model: 'Captur',
      description: 'Bon état général',
      price : 5000
    }
  ];

  //! Constructeur
  constructor() { }

  //! Méthodes

  getOffers(): Offer[] {
    return this.offers;
  }

  createOffer(offer: Offer): Offer[] {
    this.offers.push(offer);
    return this.offers;
  }

  editOffer(offer: Offer, index: number): Offer[] {
    this.offers[index] = offer;
    return this.offers;
  }

  deleteOffer(offerIndex: number): Offer[] {
    this.offers.splice(offerIndex, 1);
    return this.offers;
  }

}
