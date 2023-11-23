import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  //! Variables
  offerForm!: FormGroup

  offers: any[] = [];

  currentCar:any;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  //!Méthodes

  ngOnInit() {
    this.initOfferForm();
  }

  //? Initaliser le formulaire
  initOfferForm(): void {
    this.offerForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(25)]],
      brand: '',
      model: '',
      description: '',
      price : 0
    });
  }

  //? Soumettre le formulaire
  onSubmitOfferForm(): void {
    this.offers.push(this.offerForm.value);
    this.offerForm.reset();
  }

}
