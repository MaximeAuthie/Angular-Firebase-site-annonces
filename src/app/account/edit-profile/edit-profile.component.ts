import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnChanges, OnInit {

  @Input() currentUser!: User;

  usernameForm!: FormGroup;
  emailForm!: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private authService: AuthService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.initUsernameForm();
    this.initEmailForm();
  }

  initUsernameForm(): void {
    this.usernameForm = this.formBuilder.group({
      username: ['', Validators.required]
    })
  }

  initEmailForm(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onEditUsername(modal: any): void {

    //? Récupérer le nom de l'utilsateur actuel et l'ajouter dans le champs "username" du formulaire
    this.usernameForm.get('username')?.setValue(this.currentUser.displayName);

    //? Ouvrir la modal en la centrant sur la page
    this.modalService.open(modal, {centered: true});
  }

  onEditEmail(modal: any): void {

    //? Récupérer l'adresse email de l'utilisateur actuel et l'ajouter dans le champs "email" du formulaire
    this.emailForm.get('email')?.setValue(this.currentUser.email);

    //? Ouvrir la modal en la centrant sur la page
    this.modalService.open(modal, {centered: true});
  }

  onSubmitUsernameForm(): void {
    this.currentUser.updateProfile({displayName: this.usernameForm.value.username})
      .then(() => {

        //? Une fois la mise à jour terminée, on ferme toutes les modals ouvertes
        this.modalService.dismissAll()
      })
      .catch(console.error)
  }

  onSubmitEmailForm(): void {

    //? Il est indispensable de s'indentifier pour pouvoir modifuer l'adresse mail du compte
    this.authService.signinUser(<string>this.currentUser.email, this.emailForm.value.password)
      .then(() => {

        //? Une fois l'authentification auprès de Firebase réussie, on modifier l'adresse mail du compte
        this.currentUser.updateEmail(this.emailForm.value.email)
          .then(() => {
            this.modalService.dismissAll();
            this.emailForm.reset();
          })
          .catch(console.error)
      })
      .catch(console.error);
  }
}
