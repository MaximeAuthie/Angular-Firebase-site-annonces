import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
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
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {
    this.getOffersOn();
  }

  //! Méthodes

  getOffers(): void {
    this.db.list('offers').query.limitToLast(10).once('value', snapshop => {
    // On récupère les 10 derniers éléments de la liste

      //? Récupérer un objet contenant les documents retournés par la requête
      const offerSnapshopValue = snapshop.val();

      //? On vérifie si des offres sont renvoyées par la BDD pour éviter une erreur dans le navigateur s'il n'y a pas d'offres
      if (offerSnapshopValue) {
        //? Transformer l'objet offerSnapshopValue en array
        const offerArray = Object.keys(offerSnapshopValue).map((id) => ({id, ...offerSnapshopValue[id]}));
        // On construit ici un tableau en itérant sur un tableau d'id pour récupérer le contenu de chaque objet (document) dans le snapshot

        //? Mettre à jour la data "offers" du service
        this.offers = offerArray;
      }

      //? Mettre à jour l'observable pour infomer les composants ayant souscrit que la liste des offres à été mise à jour
        this.dispachOffers();

    });
  }

  getOffersOn():void {
    this.db.list('offers').query.limitToLast(10).on('value', snapshot => {

      //? Récupérer un objet contenant les documents retournés par la requête
      const offerSnapshopValue = snapshot.val();

      //? Transformer l'objet offerSnapshopValue en array
      const offersArray = Object.keys(offerSnapshopValue).map((id) => ({id, ...offerSnapshopValue[id]}));

      console.log(offersArray);

    })
  }

  dispachOffers(): void {
    this.offersSubject.next(this.offers);
  }

  async createOffer(offer: Offer, offerPhoto?: any): Promise<Offer> {
    console.log({offer, offerPhoto});

    try {
      console.log("try");
      //? Si l'utilisateur ajoute une photo, on l'upload avec la méthode privée uploadPhoto() qui nous retourne une URL
      const photoUrl = offerPhoto ? await this.uploadPhoto(offerPhoto) : '';


      //? On ajoute l'offre dans la BDD
      const response = await this.db.list('offers').push({...offer, photo: photoUrl});
      console.log(response);

      //? On créé une constante pour reconstituer l'offre et on l'ajoute à la data this.offers avant de la retourner
      const createdOffer = {...offer, photo: photoUrl, id: <string>response.key};
      this.offers.push(createdOffer); // On ajoute l'offre à la data du service
      this.dispachOffers(); // On appelle la méthode permettant de mettre à jour l'observable
      return createdOffer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  editOffer(offer: Offer, offerId: string): Promise<Offer> {
    return new Promise((resolve, reject)=> {
      this.db.list('offers').update(offerId, offer)
        .then(() => {
          const updatedOffer = {...offer, id: offerId};
          const offerToUpdateIndex = this.offers.findIndex((item) => item.id === offerId) // On ajoute l'offre à la data du service
          this.offers[offerToUpdateIndex] = updatedOffer;
          this.dispachOffers(); // On appelle la méthode permettant de mettre à jour l'observable
          resolve(updatedOffer); // On retourne l'offre créée
        })
        .catch((reject) => console.log(reject));
    })
  }

  deleteOffer(offerId: string): Promise<Offer> {
    return new Promise((resolve, reject) => {
      this.db.list('offers').remove(offerId)
        .then(() => {
          const offerToRemove = this.offers.findIndex((item) => item.id === offerId);
          this.offers.splice(offerToRemove,1);
          this.dispachOffers();
        })
        .catch((reject) => console.log(reject))
    })
  }

  private uploadPhoto(photo: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = this.storage.upload('offers/'+ Date.now().toString() + '-' +photo.name, photo); // on créé un chemin unique en concaténant le nom du fichier et la date d'upload
      upload
        .then((res) =>resolve(res.ref.getDownloadURL())) //On récupère ici l'URL du ffichier une fois qu'il a été upload dans Firebase
        .catch(reject);
    })
  }
}
