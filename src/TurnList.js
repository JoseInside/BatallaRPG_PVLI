'use strict';

function TurnList() {}



TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber = 0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative();
};

TurnList.prototype.next = function () {
  // Haz que calcule el siguiente turno y devuelva el resultado
  // según la especificación. Recuerda que debe saltar los personajes
  // muertos.
  //***
  this._turnIndex = this.turnNumber;
  this.activeCharacterId = this.list[this._turnIndex];

  var elegido = false;

  while (!elegido){
    this._turnIndex = this._turnIndex % this.list.length;

    if (!this._charactersById[this.list[this._turnIndex]].isDead()){
      this.activeCharacterId = this.list[this._turnIndex];
      elegido = true;
    }
    this._turnIndex++;
  }
  this.turnNumber++;
  
  //console.log(this._turnIndex, this._charactersById[this.activeCharacterId].isDead());

  var turn = {
    number : this.turnNumber, 
    party : this._charactersById[this.activeCharacterId].party, 
    activeCharacterId : this.activeCharacterId
  };

  return turn;
  
};

TurnList.prototype._sortByInitiative = function () {
  
  // Utiliza la función Array.sort(). ¡No te implementes tu propia
  // función de ordenación!
  //***
  var characters = [];
  var ini = [];

  for (var nombre in this._charactersById){
    characters.push ({name: nombre, initiative: this._charactersById[nombre].initiative});
  }

  characters.sort (function (a, b){
    if (a.initiative > b.initiative) return -1;
    else if (a.initiative < b.initiative) return 1;
    return 0;
  });

  for (var cont in characters){
    ini.push (characters[cont].name);
  }

  return ini;
};

module.exports = TurnList;