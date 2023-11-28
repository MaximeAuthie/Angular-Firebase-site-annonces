import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Offer } from 'src/app/Interfaces/offer';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  //! Variables
  offerForm!: FormGroup

  offers: Offer[] = [];

  currentCar:any;

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService
  ) {}


  //!Méthodes
  ngOnInit() {
    this.initOfferForm();
    this.offersService.getOffers().subscribe({
      next: (offers: Offer[]) => this.offers = this.offers,
      complete: () => console.log('Observable complete'),
      error: (error) => console.error(console.error(),
      )
    });
  }

  //? Initaliser le formulaire
  initOfferForm(): void {
    this.offerForm = this.formBuilder.group({
      index: [0],
      title: ['', [Validators.required, Validators.minLength(25)]],
      brand: '',
      model: '',
      description: '',
      price : 0
    });
  }

  //? Soumettre le formulaire et ajouter l'offre au tableau "offers"
  onSubmitOfferForm(): void {
    const offerIndex = this.offerForm.value.index;
    let offer = this.offerForm.value;

    // Vérifier s'il s'agit d'une création ou d'une mise à jour d'une annonce
    if ( offerIndex == null || offerIndex == undefined ) {
      delete offer.index;
      this.offers = this.offersService.createOffer(offer);
    } else {
      delete offer.index;
      this.offers = this.offersService.editOffer(offer, offerIndex);
    }

    // Réinitialiser le formulaire
    this.offerForm.reset();
  }

  //? Supprimer une offre
  onDeleteOffer(index: number):void {
    this.offers = this.offersService.deleteOffer(index);
  }

  //? Charger l'annonce à modifier dans le formualire
  onEditOffer(offer: Offer, index: number):void {
    this.offerForm.setValue({...offer, index}); //ici, je passe un objet en paramètre, dans lequel je déconstruis mon objet "offer" pour y ajouter "index"
  }
}
