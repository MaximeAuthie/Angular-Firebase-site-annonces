import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Offer } from 'src/app/Interfaces/offer';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {

  //! Variables
  offerForm!: FormGroup

  offers: Offer[] = [];

  currentCar:any;

  subscription!: Subscription;

  currentOfferPhotoFile!: any;

  currentOfferPhotoUrl!: string;

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService
  ) {}


  //!Méthodes
  ngOnInit() {
    this.initOfferForm();
    this.subscription = this.offersService.offersSubject.subscribe({
      next: (offers: Offer[]) => this.offers = offers,
      complete: () => console.log('Observable complete'),
      error: (error) => console.error(error)
    });
    this.offersService.getOffers();
  }

  //? Initaliser le formulaire
  initOfferForm(): void {
    this.offerForm = this.formBuilder.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(25)]],
      photo: [],
      brand: '',
      model: '',
      description: '',
      price : 0
    });
  }

  //? Soumettre le formulaire et ajouter l'offre au tableau "offers"
  onSubmitOfferForm(): void {
    const offerId = this.offerForm.value.id;
    let offer = this.offerForm.value;

    // Vérifier s'il s'agit d'une création ou d'une mise à jour d'une annonce
    if (!offerId || offerId && offerId === '') {
      delete offer.index;
      console.log("create");

      this.offersService.createOffer(offer, this.currentOfferPhotoFile).then((res) => console.log(res)).catch(console.error);
    } else {
      delete offer.index;
      this.offersService.editOffer(offer, offerId).catch(console.error);
    }

    // Réinitialiser le formulaire
    this.offerForm.reset();

    // Réinitialiser la data this.currentPḧotoFile pour que l'image qu'il stocke ne soit pas ajouté à la procahin soumission du formulaire
    this.currentOfferPhotoFile= null;

  }

  //? Supprimer une offre
  onDeleteOffer(offerId?: string):void { // ici on type offeId comme un string ou un undifined
    if (offerId) {
      this.offersService.deleteOffer(offerId).catch(console.error);
    } else {
      console.error('An id must be provided');
    }
  }

  //? Méthode servant à interpréter un changement dans l'input d'ajout d'un fichier
  onChangeOfferPhoto($event: any): void {

    // Stocker le fichier sélectionné dans la data this.currentOfferPhotoFile
    this.currentOfferPhotoFile = $event.target.files[0];

    // Stocker l'url temporaire du fichier dans la data this.currentOfferPhotoUrl
    const fileReader = new FileReader(); // Permet de lire le contenu d'un fichier de manière asynchrone
    fileReader.readAsDataURL(this.currentOfferPhotoFile); // Permet d'obtenir une url du fichier
    fileReader.onloadend = (event) => {
      this.currentOfferPhotoUrl = <string>event.target?.result;
    }; // Une fois que la lecture du fichier est terminée, on affecte le résultat à la data this.currentOfferPhotoUrl
  }

  //? Charger l'annonce à modifier dans le formualire
  onEditOffer(offer: Offer):void {
    this.offerForm.setValue({
      id: offer.id ? offer.id : '',
      title: offer.title ? offer.title : '',
      brand: offer.brand ? offer.brand : '',
      model: offer.model ? offer.model : '',
      price: offer.price ? offer.price : 0,
      description: offer.description ? offer.description : ''
    }); //ici, je passe un objet en paramètre, dans lequel je déconstruis mon objet "offer" pour y ajouter "index"
  }

  //? Action à réaliser lors de la destruction du composant
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
