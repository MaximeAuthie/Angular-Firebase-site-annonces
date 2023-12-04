import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { Offer } from 'src/app/Interfaces/offer';

@Injectable({
  providedIn: 'root'
})

export class OffersService {

  //! Données (en privée pour le pas être modifiées depuis l'extérieur du service)
  private offers: Offer[] = [];

  offersSubject: BehaviorSubject<Offer[]> = new BehaviorSubject(<Offer[]>[]);

  //! Constructeur
  constructor(private db: AngularFireDatabase) {}

  //! Méthodes

  getOffers(): void {
    this.db.list('offers').query.limitToLast(10).once('value', snapshop => {
    // On récupère les 10 derniers éléments de la liste

      //? Récupérer un objet contenant les documents retournés par la requête
      const offerSnapshopValue = snapshop.val();

      //? Transformer l'objet offerSnapshopValue en array
      const offerArray = Object.keys(offerSnapshopValue).map((id) => ({id, ...offerSnapshopValue[id]}));
      // On construit ici un tableau en itérant sur un tableau d'id pour récupérer le contenu de chaque objet (document) dans le snapshot

      //? Mettre à jour la data "offers" du service
      this.offers = offerArray;

      //? Mettre à jour l'observable pour infomer les composants ayant souscrit que la liste des offres à été mise à jour
      this.dispachOffers();

    });
  }

  dispachOffers(): void {
    this.offersSubject.next(this.offers);
  }

  createOffer(offer: Offer): Promise<Offer> {
    return new Promise((resolve, reject) => {
      this.db.list('offers')
        .push(offer)
        .then(res => {
          const createOffer = {...offer, id: <string>res.key};
          this.offers.push(createOffer); // On ajoute l'offre à la data du service
          this.dispachOffers(); // On appelle la méthode permettant de mettre à jour l'observable
          resolve(createOffer); // On retourne l'offre créée
        })
        .catch(reject);
    })
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
