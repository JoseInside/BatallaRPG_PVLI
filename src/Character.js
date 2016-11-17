'use strict';

var dice = require('./dice');

function Character(name, features) {
  features = features || {};
  this.name = name;
  this.party = null;
  this.initiative = features.initiative || 0;
  this._defense = features.defense || 0;
  this.weapon = features.weapon || null;
  this._mp = features.mp || 0;
  this._hp = features.hp || 0;
  this.maxMp = features.maxMp || this._mp || 0;
  this.maxHp = features.maxHp || this._hp ||15;

 // this._mp = features.mp || 0;
 // this.maxMp = features.maxMp || this._mp;
} 

Character.prototype._immuneToEffect = ['name', 'weapon'];

Character.prototype.isDead = function () {
  // Rellena el cuerpo de esta función
  //***
  if (this.hp > 0)
    return false;
  else return true;

};

Character.prototype.applyEffect = function (effect, isAlly) {
  // Implementa las reglas de aplicación de efecto para modificar las
  // características del personaje. Recuerda devolver true o false según
  // si el efecto se ha aplicado o no.
  //***
  if (isAlly || this._defense <= dice.d100()){
    this.initiative += effect.initiative || 0;
    this.defense += effect.defense || 0; 

    this.hp +=  effect.hp || 0;
    this.maxHp += effect.maxHp || 0;

    this.mp += effect.mp || 0;
    this.maxMp += effect.maxMp || 0;

  }else return false;

  return true;
};

Object.defineProperty(Character.prototype, 'mp', {
  get: function () {
    return this._mp;
  },
  set: function (newValue) {
    this._mp = Math.max(0, Math.min(newValue, this.maxMp));
  }
});

Object.defineProperty(Character.prototype, 'hp', {
   get: function () {
    return this._hp;
  },
  set: function (newValue) {
    this._hp = Math.max(0, Math.min(newValue, this.maxHp));
  }
  // Puedes usar la mísma ténica que antes para mantener el valor de hp en el
  // rango correcto.
});

Object.defineProperty(Character.prototype, 'defense', {
   get: function () {
    return this._defense;
  },
  set: function (newValue) {
    this._defense = Math.max(0, Math.min(newValue, 100));
  }
});
// Puedes hacer algo similar a lo anterior para mantener la defensa entre 0 y
// 100.


module.exports = Character;
