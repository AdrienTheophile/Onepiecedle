import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Personnage } from './services/personnage';
import { PersonnageModel } from './models/personnage.model';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ResultatTentative } from './models/tentative.model';
import { ResultatsComparaison } from './models/comparaison.model';
import { FormatNombrePipe } from './pipes/format-nombre-pipe';
import { ORDRE_ARCS } from './constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, FormatNombrePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})

export class App implements OnInit {
  protected readonly title = signal('onepiecedle');

  //barre de chargement
  isLoading = true;
  loadingMessage = "Chargement des personnages ...";

  readonly urlImages = 'https://onepiecedle-api.onrender.com/images/';

  constructor(private personnageService: Personnage) {}

  //jeux avec les personnages
  personnages: PersonnageModel[] = [];
  personnagesAffiches: PersonnageModel[] = [];

  public searchInput = new FormControl('');

  public solution: PersonnageModel | null = null;
  public tentatives: ResultatTentative[] = [];

  public partieGagnee: boolean = false;

  indexClavier = -1; //aucun élément

  ngOnInit(): void {
    this.personnageService.getPersonnages().subscribe((data) => {
      this.personnages = data;

      let save = localStorage.getItem('savegame')

      if(save) {
        let donnees = JSON.parse(save);
        this.solution = donnees.solution;
        this.tentatives = donnees.tentatives;
        this.partieGagnee = donnees.partieGagnee;
        if(donnees.partieGagnee){
          this.searchInput.disable()
        }
        console.log('Solution : ', donnees.solution.nom);
      }

      else {
        const index = Math.floor(Math.random() * data.length);
        this.solution = data[index];
        console.log('Solution : ', this.solution.nom);
        this.sauvegarderPartie();
      }

      this.isLoading = false;

    });

    this.searchInput.valueChanges.subscribe((saisie) => {
      const filtrage = saisie?.toLowerCase();
      if (!filtrage) {
        this.personnagesAffiches = [];
      } else {
        this.personnagesAffiches = this.personnages.filter((personnage) =>
          personnage.nom.toLowerCase().includes(filtrage)
        );
      }
      this.indexClavier = -1;
    });
  }

  public selectionnerPersonnage(personnageChoisi: PersonnageModel) {
    const resCompar = this.comparerPersonnages(personnageChoisi);
    let resTenter: ResultatTentative = {
      personnage: personnageChoisi,
      comparaison: resCompar,
    };
    this.tentatives.unshift(resTenter);

    if (personnageChoisi.id === this.solution?.id) {
      this.partieGagnee = true;
      this.searchInput.disable();
    }

    this.searchInput.setValue('');
    const i = this.personnages.findIndex((p) => p.id === personnageChoisi.id);
    if (i > -1) this.personnages.splice(i, 1);

    this.sauvegarderPartie();
  }

  private comparerPersonnages(personnageChoisi: PersonnageModel): ResultatsComparaison {
    let resultats: ResultatsComparaison = {
      genre: 'incorrect',
      affiliation: 'incorrect',
      fruitDuDemon: 'incorrect',
      haki: 'incorrect',
      prime: 'lower',
      hauteur: 'lower',
      origine: 'incorrect',
      premierArc: 'earlier',
    };

    if (this.solution) {
      resultats.genre = this.solution.genre === personnageChoisi.genre ? 'correct' : 'incorrect';
      resultats.affiliation =
        this.solution.affiliation === personnageChoisi.affiliation ? 'correct' : 'incorrect';
      resultats.fruitDuDemon =
        this.solution.fruitDuDemon === personnageChoisi.fruitDuDemon ? 'correct' : 'incorrect';
      resultats.prime =
        this.solution.prime === personnageChoisi.prime
          ? 'correct'
          : this.solution.prime > personnageChoisi.prime
          ? 'higher'
          : 'lower';

      if (
        this.solution.haki.length == personnageChoisi.haki.length &&
        this.solution.haki.every((element, i) => element === personnageChoisi.haki[i])
      )
        resultats.haki = 'correct';
      else if (personnageChoisi.haki) {
        for (let i = 0; i < personnageChoisi.haki.length; i++) {
          if (this.solution.haki.includes(personnageChoisi.haki[i])) resultats.haki = 'partial';
        }
      } else resultats.haki = 'incorrect';

      resultats.hauteur =
        this.solution.hauteur === personnageChoisi.hauteur
          ? 'correct'
          : this.solution.hauteur > personnageChoisi.hauteur
          ? 'higher'
          : 'lower';
      resultats.origine =
        this.solution.origine === personnageChoisi.origine ? 'correct' : 'incorrect';

      const indexSolution = ORDRE_ARCS.indexOf(this.solution.premierArc);
      const indexTentative = ORDRE_ARCS.indexOf(personnageChoisi.premierArc);

      resultats.premierArc =
        indexSolution === indexTentative
          ? 'correct'
          : indexSolution > indexTentative
          ? 'later'
          : 'earlier';
    }

    return resultats;
  }

  public gererClavier(event: KeyboardEvent) {
    console.log(this.indexClavier);
    if(this.personnagesAffiches.length > 0){

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault(); // Empêche le curseur de bouger dans l'input (optionnel)
          if (!(this.indexClavier == this.personnagesAffiches.length - 1)) {
            this.indexClavier++;
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (this.indexClavier > 0) {
            this.indexClavier--;
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (this.indexClavier >= 0) {
            let perso = this.personnagesAffiches[this.indexClavier];
            this.selectionnerPersonnage(perso);
            console.log(perso.nom);
          }
          break;
      }

    }
  }

  public sauvegarderPartie(){
    const donnees = { solution : this.solution, tentatives: this.tentatives, partieGagnee: this.partieGagnee}
    localStorage.setItem('savegame', JSON.stringify(donnees))
  }

  public relancerPartie() {
    localStorage.removeItem('savegame');

    this.tentatives = [];
    this.partieGagnee = false;
    this.indexClavier = -1;
    this.searchInput.enable();

    //nouveau personnage au hasard
    if (this.personnages.length > 0) {
      const index = Math.floor(Math.random() * this.personnages.length);
      this.solution = this.personnages[index];
      console.log('Nouvelle Solution : ', this.solution.nom);

      this.sauvegarderPartie();
    }

  }

}
