package interactions;

import game.Atom;
import game.Element;
import game.Game;
import utils.Vector2;

public class Transmutor extends Interactable {

    public Transmutor(Game game, Vector2 position) {
        super(game, position);
    }

    @Override
    public void act() {
        System.out.println(game.atoms);
        if (game.atoms.get(position) != null) {
            Atom current = game.atoms.get(position);
            if (current.element == Element.SALT) {
                current.element = Element.MERCURY;
            } else if (current.element == Element.MERCURY) {
                current.element = Element.SULFUR;
            } else if (current.element == Element.SULFUR) {
                current.element = Element.SALT;
            }
        }
    }
}
