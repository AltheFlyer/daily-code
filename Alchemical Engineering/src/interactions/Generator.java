package interactions;

import game.Atom;
import game.Element;
import game.Game;
import utils.Vector2;

public class Generator extends Interactable {

    Element atomType;

    public Generator(Game game, Vector2 position, Element toGenerate) {
        super(game, position);
        atomType = toGenerate;
    }

    @Override
    public void act() {
        Atom current = getAtom();
        if (current != null) {
            game.atoms.put(position, new Atom(position.x, position.y, atomType));
        }
    }
}
