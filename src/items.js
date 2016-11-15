'use strict';

function Item(name, effect) {
  this.name = name;
  this.effect = effect;
}

function Weapon(name, damage, extraEffect) {
  extraEffect = extraEffect || new Effect({});
  // Haz que Weapon sea subtipo de Item haciendo que llame al constructor de
  // de Item.
  //***
  Item.call (this, name, extraEffect);
  this.effect.hp = -damage;
  this.effect.mp = extraEffect.mp;
}
// Termina de implementar la herencia haciendo que la propiedad prototype de
// Item sea el prototipo de Weapon.prototype y recuerda ajustar el constructor.
//***
Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

function Scroll(name, cost, effect) {
  Item.call(this, name, effect);
  this.cost = cost;
  this.effect.hp = effect.hp;
}
Scroll.prototype = Object.create(Item.prototype);
Scroll.prototype.constructor = Scroll;

Scroll.prototype.canBeUsed = function (mp) {
  // El pergamino puede usarse si los puntos de maná son superiores o iguales
  // al coste del hechizo.
  if (this.cost <= mp)
    return true;
  else return false;
};

function Effect(variations) {
  for (var name in variations) {
      this[name] = variations[name];
   }
  for (var initiative in variations){
      this[initiative] = variations[initiative];
  }
  for (var hp in variations){
    this[hp] = variations[hp];
  }
  
  for (var mp in variations){
    this[mp] = variations[mp];
  }
   //***
  // Copia las propiedades que se encuentran en variations como propiedades de
  // este objeto.
}

module.exports = {
  Item: Item,
  Weapon: Weapon,
  Scroll: Scroll,
  Effect: Effect
};
