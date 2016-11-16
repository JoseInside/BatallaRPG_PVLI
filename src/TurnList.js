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
  
  this.turnNumber++;
  
  this._turnIndex++;
  this.activeCharacterId = this.list[this._turnIndex];

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  while (this._turnIndex < 2 && (this._charactersById[this.activeCharacterId].isDead && this._charactersById[this.activeCharacterId].isDead != undefined)){   
    this._turnIndex++;
    this.activeCharacterId = this.list[this._turnIndex];
  }
  console.log(this._turnIndex, this._charactersById[this.activeCharacterId].isDead);

  var turn = {number : this.turnNumber, party : this._charactersById[this.activeCharacterId].party, activeCharacterId: this.activeCharacterId};
  
  if (this._turnIndex === 2)
    this._turnIndex = -1;

  return turn;

};

TurnList.prototype._sortByInitiative = function () {
  
  // Utiliza la función Array.sort(). ¡No te implementes tu propia
  // función de ordenación!
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

  //characters.sort();

  for (var cont in characters){
    ini.push (characters[cont].name);
  }

  return ini;
};

module.exports = TurnList;
