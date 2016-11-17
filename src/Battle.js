'use strict';

var EventEmitter = require('events').EventEmitter;
var CharactersView = require('./CharactersView');
var OptionsStack = require('./OptionsStack');
var TurnList = require('./TurnList');
var Effect = require('./items').Effect;

var utils = require('./utils');
var listToMap = utils.listToMap;
var mapValues = utils.mapValues;

function Battle() {
  EventEmitter.call(this);
  this._grimoires = {};
  this._charactersById = {};
  this._turns = new TurnList();

  this.options = new OptionsStack();
  this.characters = new CharactersView();
}
Battle.prototype = Object.create(EventEmitter.prototype);
Battle.prototype.constructor = Battle;

Object.defineProperty(Battle.prototype, 'turnList', {
  get: function () {
    return this._turns ? this._turns.list : null;
  }
});

Battle.prototype.setup = function (parties) {
  this._grimoires = this._extractGrimoiresByParty(parties);
  this._charactersById = this._extractCharactersById(parties);
  this._states = this._resetStates(this._charactersById);
  this._turns.reset(this._charactersById);

  this.characters.set(this._charactersById);
  this.options.clear();
};

Battle.prototype.start = function () {
  this._inProgressAction = null;
  this._stopped = false;
  this.emit('start', this._getCharIdsByParty());
  this._nextTurn();
};

Battle.prototype.stop = function () {
  this._stopped = true;
};

Object.defineProperty(Battle.prototype, '_activeCharacter', {
  get: function () {
    return this._charactersById[this._turns.activeCharacterId];
  }
});

Battle.prototype._extractGrimoiresByParty = function (parties) {
  var grimoires = {};
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var partyGrimoire = parties[partyId].grimoire || [];
    grimoires[partyId] = listToMap(partyGrimoire, useName);
  });
  return grimoires;

  function useName(scroll) {
    return scroll.name;
  }
};

Battle.prototype._extractCharactersById = function (parties) {
  var idCounters = {};
  var characters = [];
  var partyIds = Object.keys(parties);
  partyIds.forEach(function (partyId) {
    var members = parties[partyId].members;
    assignParty(members, partyId);
    characters = characters.concat(members);
  });
  return listToMap(characters, useUniqueName);

  function assignParty(characters, party) {
    // Cambia la party de todos los personajes a la pasada como parámetro.
    //***
    for (var cont  = 0; cont < characters.length; cont++){
      characters[cont].party = party;
    }
    
  }

  function useUniqueName(character) {
    // Genera character.names únicos de acuerdo a las reglas
    // de generación de identificadores que encontrarás en
    // la descripción de la práctica o en la especificación.
    //***
    if(!idCounters.hasOwnProperty(character.name)){
      idCounters[character.name] = 0;
      idCounters[character.name] ++;
      return character.name;
    }
    else if (idCounters[character.name] === 0){
      return idCounters[character.name];
    }
    else{
      idCounters[character.name] ++;
      return character.name + ' ' + (idCounters[character.name]);
    }
  }
};

Battle.prototype._resetStates = function (charactersById) {
  return Object.keys(charactersById).reduce(function (map, charId) {
    map[charId] = {};
    return map;
  }, {});
};

Battle.prototype._getCharIdsByParty = function () {
  var charIdsByParty = {};
  var charactersById = this._charactersById;
  Object.keys(charactersById).forEach(function (charId) {
    var party = charactersById[charId].party;
    if (!charIdsByParty[party]) {
      charIdsByParty[party] = [];
    }
    charIdsByParty[party].push(charId);
  });
  return charIdsByParty;
};

Battle.prototype._nextTurn = function () {
  if (this._stopped) { return; }
  setTimeout(function () {
    var endOfBattle = this._checkEndOfBattle();
    if (endOfBattle) {
      this.emit('end', endOfBattle);
    } else {
      var turn = this._turns.next();
      this._showActions();
      this.emit('turn', turn);
    }
  }.bind(this), 0);
};

Battle.prototype._checkEndOfBattle = function () {
  var allCharacters = mapValues(this._charactersById);
  var aliveCharacters = allCharacters.filter(isAlive);
  var commonParty = getCommonParty(aliveCharacters);
  return commonParty ? { winner: commonParty } : null;

  function isAlive(character) {
    // Devuelve true si el personaje está vivo.
    //***
    if (!character.isDead())
      return true;
    else return false;
  }

  function getCommonParty(characters) {
    // Devuelve la party que todos los personajes tienen en común o null en caso
    // de que no haya común.
    //***
    var partyComun = characters[0].party;
    var iguales = 0;
    for (var iguales in characters){
      if (partyComun === characters[iguales].party)
        iguales++;
    }

    if (iguales === characters.length)
      return partyComun;
    else return null;
  
  }
};

Battle.prototype._showActions = function () {
  this.options.current = {
    'attack': true,
    'defend': true,
    'cast': true
  };
  this.options.current.on('chose', this._onAction.bind(this));
};

Battle.prototype._onAction = function (action) {
  this._action = {
    action: action,
    activeCharacterId: this._turns.activeCharacterId
  };
  // Debe llamar al método para la acción correspondiente:
  // defend -> _defend; attack -> _attack; cast -> _cast
  //***
  switch (action){
    case 'defend':
      this.emit(this._action, this._defend());
      break;
    case 'attack':
      this.emit(this._action, this._attack());
      break;
    case 'cast':
      this.emit(this._action, this._cast());
      break;
    default :
      console.log ("Esta accion no existe");
      break;
  }
  
};

Battle.prototype._defend = function () {
  var activeCharacterId = this._action.activeCharacterId;
  var newDefense = this._improveDefense(activeCharacterId);
  this._action.targetId = this._action.activeCharacterId;
  this._action.newDefense = newDefense;
  this._executeAction();
};

Battle.prototype._improveDefense = function (targetId) {
  // Implementa la mejora de la defensa del personaje.
  //***
  //IMPORTANTE RELLENAR DEFENSA ANTES!!!
  this._states[targetId].defense = this._charactersById[targetId].defense;
  
  var dActual = Math.ceil(this._charactersById[targetId].defense * 1.1);
  this._charactersById[targetId].defense = dActual;
  
  return dActual;

};

Battle.prototype._restoreDefense = function (targetId) {
   // Restaura la defensa del personaje a cómo estaba antes de mejorarla.
  // Puedes utilizar el atributo this._states[targetId] para llevar tracking
  // de las defensas originales.
  //***
  this._charactersById[targetId].defense = this._states[targetId].defense;
};

Battle.prototype._attack = function () {
  
  var self = this;

  self._showTargets(function onTarget(targetId) {
    self._action.targetId = targetId;
    self._action.effect = self._charactersById[self._action.activeCharacterId].weapon.effect;
    self._executeAction();
    self._restoreDefense(targetId);
  });
};

Battle.prototype._cast = function () {
  var self = this;
  
  self._showScrolls(function onScroll(scrollId, scroll) {
    // Implementa lo que pasa cuando se ha seleccionado el hechizo.
    self._showTargets(function onTarget(targetId) {
      // Implementa lo que pasa cuando se ha seleccionado el objetivo.
      var activeCharacterId = self._action.activeCharacterId;
      self._action.targetId = targetId;
      self._action.scrollName = scrollId;
      self._action.effect = scroll.effect;
        if (scroll.canBeUsed (self._charactersById[self._action.activeCharacterId].mp)){
          self._charactersById[activeCharacterId].mp -= scroll.cost;
          self._executeAction();
          self._restoreDefense(targetId);
        }
    });
  });
  
};

Battle.prototype._executeAction = function () {
  var action = this._action;
  var effect = this._action.effect || new Effect({});
  var activeCharacter = this._charactersById[action.activeCharacterId];
  var targetCharacter = this._charactersById[action.targetId];
  var areAllies = activeCharacter.party === targetCharacter.party;

  var wasSuccessful = targetCharacter.applyEffect(effect, areAllies);
  this._action.success = wasSuccessful;

  this._informAction();
  this._nextTurn();
};

Battle.prototype._informAction = function () {
  this.emit('info', this._action);
};

Battle.prototype._showTargets = function (onSelection) {
  // Toma ejemplo de la función ._showActions() para mostrar los identificadores
  // de los objetivos.
  //***
  var elegidos = {};

  for (var name in this._charactersById){
    if (!this._charactersById[name].isDead())
      elegidos[name] = name;
  }
  this.options.current = elegidos;
  this.options.current.on('chose', onSelection);
  
};

Battle.prototype._showScrolls = function (onSelection) {
  // Toma ejemplo de la función anterior para mostrar los hechizos. Estudia
  // bien qué parámetros se envían a los listener del evento chose.
  var scrolls = {};
  var team = this._charactersById[this._turns.activeCharacterId].party;
  var spellAc = this._grimoires[team];
  for (var spell in spellAc){
    if(spellAc[spell].canBeUsed(this._charactersById[this._turns.activeCharacterId].mp))
      scrolls[spell] = spellAc[spell];
  }
  this.options.current = scrolls;
  this.options.current.on('chose', onSelection);
};

module.exports = Battle;
