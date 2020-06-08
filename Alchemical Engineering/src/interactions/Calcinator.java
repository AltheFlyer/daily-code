package interactions;

import game.Atom;
import game.Element;
import game.Game;
import utils.Vector2;

public class Calcinator extends Interactable {
    public Calcinator(Game game, Vector2 position) {
        super(game, position);
    }

    @Override
    public void act() {
        Atom currentAtom = getAtom();
        if (getAtom() != null) {
            currentAtom.element = Element.SALT;
        }
    }
}
