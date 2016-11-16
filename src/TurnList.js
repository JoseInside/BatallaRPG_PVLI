'use strict';

function TurnList() {}

TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber = 0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative(charactersById);
};

TurnList.prototype.next = function () {
  // Haz que calcule el siguiente turno y devuelva el resultado
  // según la especificación. Recuerda que debe saltar los personajes
  // muertos.
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

  for (var nombre in this._charactersById){
    ini.push (this.characters[nombre].name);
  }

  return ini;
};

module.exports = TurnList;
