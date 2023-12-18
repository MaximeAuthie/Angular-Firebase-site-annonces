import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnChanges, OnInit {

  @Input() currentUser!: User;

  usernameForm!: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.initUsernameForm();
  }

  initUsernameForm(): void {
    this.usernameForm = this.formBuilder.group({
      username: ['', Validators.required]
    })
  }

  onEditUsername(modal: any): void {

    //? Récupérer le norm de l'utilsateur actuel et l'ajouter dans le champs "username" du formulaire
    this.usernameForm.get('username')?.setValue(this.currentUser.displayName);

    //? Ouvrir la modal en la centrant sur la page
    this.modalService.open(modal, {centered: true});
  }

  onSubmitUsernameFform(): void {
    this.currentUser.updateProfile({displayName: this.usernameForm.value.username})
      .then(() => {

        //? Une fois la mise à jour terminée, on ferme toutes les modals ouvertes
        this.modalService.dismissAll()
      })
      .catch(console.error)
  }
}
