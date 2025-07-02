import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from './constants';

const getPlayerPieces = () => ({
  P1: Array.from(document.querySelectorAll('[player-id="P1"].player-piece')),
  P2: Array.from(document.querySelectorAll('[player-id="P2"].player-piece')),
});

const diceButtonElement = () => document.querySelector('#dice-btn');
const playerPiecesElements = getPlayerPieces();

export class UI {
  static listenDiceClick(callback) {
    diceButtonElement()?.addEventListener('click', callback);
  }

  static listenResetClick(callback) {
    document.querySelector('#reset-btn')?.addEventListener('click', callback);
  }

  static listenPieceClick(callback) {
    document.querySelector('.player-pieces')?.addEventListener('click', callback);
  }

  static setPiecePosition(player, piece, newPosition) {
    const pieces = getPlayerPieces();
    const pieceElement = pieces[player]?.[piece];

    if (!pieceElement) {
      console.error(`Player element not found: ${player} piece: ${piece}`);
      return;
    }

    const [x, y] = COORDINATES_MAP[newPosition];
    pieceElement.style.top = `${y * STEP_LENGTH}%`;
    pieceElement.style.left = `${x * STEP_LENGTH}%`;
  }

  static setTurn(index) {
    if (index < 0 || index >= PLAYERS.length) return;

    const player = PLAYERS[index];
    document.querySelector('.active-player span').innerText = player;

    document.querySelector('.player-base.highlight')?.classList.remove('highlight');
    document.querySelector(`[player-id="${player}"].player-base`)?.classList.add('highlight');
  }

  static enableDice() {
    diceButtonElement()?.removeAttribute('disabled');
  }

  static disableDice() {
    diceButtonElement()?.setAttribute('disabled', '');
  }

  static highlightPieces(player, pieces) {
    const elements = getPlayerPieces();
    pieces.forEach(piece => elements[player]?.[piece]?.classList.add('highlight'));
  }

  static unhighlightPieces() {
    document.querySelectorAll('.player-piece.highlight').forEach(el => el.classList.remove('highlight'));
  }

  static setDiceValue(value) {
    document.querySelector('.dice-value').innerText = value;
  }
}
