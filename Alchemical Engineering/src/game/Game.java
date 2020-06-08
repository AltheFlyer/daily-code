package game;

import interactions.Interactable;
import utils.Vector2;

import java.util.ArrayList;
import java.util.HashMap;

public class Game {

    public ArrayList<Interactable> map;
    public HashMap<Vector2, Atom> atoms;

    public Game() {
        map = new ArrayList<>();
        atoms = new HashMap<>();
    }

    public void tick() {
        for (Interactable object: map) {
            object.act();
        }
    }
}
