import createCanonText from './createCanonText';
import createCanon from './createCanon';
import createWarningTile from './createWarningTile';
import { baseUnit } from './constants';


export default class GridState {
    constructor(sprite, getHorizontalNumbers, getVerticalNumbers, getColsWith13Sums, getRowsWith13Sums, getTilesWith13Sums) {
        this.sprite = sprite;
        this.numberOfColumns = 8;
        this.columnTexts = []
        this.horizontalCanons = [];
        this.verticalCanons = [];
        this.horizontalTexts = [];
        this.verticalTexts = [];
        this.warningTiles = [];
        this.getHorizontalNumbers = getHorizontalNumbers;
        this.getVerticalNumbers = getVerticalNumbers;
        this.getColsWith13Sums = getColsWith13Sums;
        this.getRowsWith13Sums = getRowsWith13Sums;
        this.getTilesWith13Sums = getTilesWith13Sums;
    }

    startLevel() {
        this.populateCanons();
        this.populateWarningTiles();
    }

    populateWarningTiles() {
        this.warningTiles = [];
        this.getTilesWith13Sums().forEach(tile => {
            this.warningTiles.push(createWarningTile(tile));
        });
    }

    onTick() {
        this.updateCanons();
        this.activateCanons();
        this.setLastCanonOutsideGrid();
        this.populateWarningTiles();
        for (let i = 0; i < this.numberOfColumns; i++) {
            this.setInTransition(i);
        }
    }

    setInTransition(iter) {
        this.horizontalTexts[iter].inTransition = true;
        this.verticalTexts[iter].inTransition = true;
        this.horizontalCanons[iter].inTransition = true;
        this.verticalCanons[iter].inTransition = true;
    }

    populateCanons() {
        this.horizontalCanons = [];
        this.verticalCanons = [];
        this.horizontalTexts = [];
        this.verticalTexts = [];
        const squareSize = baseUnit;
        const fontOffset = 5;
        for (let i = 0; i < this.numberOfColumns; i++) {
            this.horizontalCanons.push(createCanon(baseUnit * i + baseUnit, 0, this.sprite, this.getHorizontalNumbers()[i], false));
            this.verticalCanons.push(createCanon(0, baseUnit * i + baseUnit, this.sprite, this.getVerticalNumbers()[i], true));
            this.horizontalTexts.push(createCanonText(this.getHorizontalNumbers()[i].toString(), i * baseUnit + squareSize / 2 - fontOffset + squareSize, squareSize / 2 - fontOffset, 'horizontal'));
            this.verticalTexts.push(createCanonText(this.getVerticalNumbers()[i].toString(), squareSize / 2 - fontOffset, i * baseUnit + squareSize / 2 - fontOffset * 2 + baseUnit, 'vertical'));
        }
    }

    updateCanons() {
        this.horizontalCanons.shift();
        this.verticalCanons.shift();
        this.horizontalCanons.push(createCanon(8 * baseUnit + baseUnit, 0, this.sprite, this.getHorizontalNumbers()[this.getHorizontalNumbers().length - 1], false));
        this.verticalCanons.push(createCanon(0, 8 * baseUnit + baseUnit, this.sprite, this.getVerticalNumbers()[this.getVerticalNumbers().length - 1], true));
        this.updateCanonTexts();
    }

    updateCanonTexts() {
        this.horizontalTexts.shift();
        this.verticalTexts.shift();
        const squareSize = baseUnit;
        const fontOffset = 5;
        const lastIndex = this.horizontalTexts.length;
        this.horizontalTexts.push(createCanonText(this.getHorizontalNumbers()[lastIndex].toString(), 8 * baseUnit + squareSize / 2 - fontOffset + squareSize, squareSize / 2 - fontOffset, 'horizontal'));
        this.verticalTexts.push(createCanonText(this.getVerticalNumbers()[lastIndex].toString(), squareSize / 2 - fontOffset, 8 * baseUnit + squareSize / 2 - fontOffset * 2 + baseUnit, 'vertical'));
    }

    deactivateCanon(iter) {
        this.horizontalCanons[iter].deactivate();
        this.verticalCanons[iter].deactivate();
        this.horizontalCanons[iter].isOutsideGrid = false;
        this.verticalCanons[iter].isOutsideGrid = false;
    }

    activateCanons() {
        const verticalCanonsToActivate = [];
        const horizontalCanonsToActivate = [];
        for (let i = 0; i < this.numberOfColumns - 1; i++) {
            this.deactivateCanon(i);
            for (let j = 0; j < this.numberOfColumns - 1; j++) {
                if (this.getHorizontalNumbers()[i] + this.getVerticalNumbers()[j] === 13) {
                    verticalCanonsToActivate.push(j);
                    horizontalCanonsToActivate.push(i);
                }
            }
        }
        verticalCanonsToActivate.forEach(can => this.verticalCanons[can].activate());
        horizontalCanonsToActivate.forEach(can => this.horizontalCanons[can].activate());
    }

    setLastCanonOutsideGrid() {
        this.horizontalCanons[this.numberOfColumns - 1].isOutsideGrid = true;
        this.verticalCanons[this.numberOfColumns - 1].isOutsideGrid = true;
    }

    updateGameObjects(iter, dt) {
        this.horizontalCanons[iter].update(dt);
        this.verticalCanons[iter].update(dt);
        this.horizontalTexts[iter].update(dt);
        this.verticalTexts[iter].update(dt);

    }

    renderGameObjects(iter) {
        this.horizontalCanons[iter].render();
        this.verticalCanons[iter].render();
        this.horizontalTexts[iter].render();
        this.verticalTexts[iter].render();
    }

    update(dt) {
        this.warningTiles.forEach(tile => tile.update(dt));
        for (let i = 0; i < this.numberOfColumns; i++) {
            this.updateGameObjects(i, dt);
        }

    }

    render() {
        this.warningTiles.forEach(tile => tile.render());
        for (let i = 0; i < this.numberOfColumns; i++) {
            this.renderGameObjects(i);
        }
    }
}