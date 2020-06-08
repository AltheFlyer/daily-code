package interactions;

import game.Atom;
import game.Game;
import utils.Vector2;

public abstract class Interactable {

    Vector2 position;
    final Game game;

    public Interactable(Game game, Vector2 position) {
        this.game = game;
        this.position = position;
    }

    public abstract void act();

    protected Atom getAtom() {
        return game.atoms.get(position);
    }

    protected Atom getAtom(Vector2 a) {
        return game.atoms.get(a);
    }
}
