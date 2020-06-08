package interactions;

import game.Atom;
import game.Game;
import utils.Vector2;

public class Binder extends Interactable {
    public Binder(Game game, Vector2 position) {
        super(game, position);
    }

    @Override
    public void act() {
        Atom left = getAtom();
        Atom right = getAtom(position.add(1, 0));
        if (left != null && right != null) {
            left.connect(right);
        }
    }
}
