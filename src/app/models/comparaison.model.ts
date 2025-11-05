export interface ResultatsComparaison {
  genre: 'correct' | 'incorrect';
  affiliation: 'correct' | 'incorrect';
  fruitDuDemon: 'correct' | 'incorrect';
  haki: 'correct' | 'partial' | 'incorrect';
  prime: 'correct' | 'lower' | 'higher';
  hauteur: 'correct' | 'lower' | 'higher';
  origine: 'correct' | 'incorrect';
  premierArc: 'correct' | 'earlier' | 'later';
}
