import { Injectable } from 'angular2/core';

export class Hero {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

const HEROES = [
  new Hero(11, 'Mr. Nice'),
  new Hero(12, 'Narco'),
  new Hero(13, 'Bombasto'),
  new Hero(14, 'Celeritas'),
  new Hero(15, 'Magneta'),
  new Hero(16, 'RubberMan')
];

const heroesPromise = Promise.resolve(HEROES);

@Injectable()
export class HeroService {
  getHeroes() {
    return heroesPromise;
  }

  getHero(id) {
    return heroesPromise
      .then(heroes => heroes.filter(h => h.id === +id)[0]);
  }
}