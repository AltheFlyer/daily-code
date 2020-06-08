package game;

import utils.Vector2;

import java.util.ArrayList;
import java.util.HashSet;

public class Atom {

    public Element element = Element.SALT;
    public ArrayList<Atom> children;
    public Vector2 position;

    public Atom(int x, int y) {
        position = new Vector2(x, y);
        children = new ArrayList<>();
    }

    public Atom(int x, int y, Element element) {
        position = new Vector2(x, y);
        children = new ArrayList<>();
        this.element = element;
    }

    public void connect(Atom atom) {
        children.add(atom);
        atom.children.add(this);
    }

    public void rotateClockwise() {
        rotateClockwise(position.x, position.y, new HashSet<>());
    }

    public void rotateCounterClockwise() {
        rotateCounterClockwise(position.x, position.y, new HashSet<>());
    }

    private void rotateClockwise(int byX, int byY, HashSet<Atom> visited) {
        int tmpX = position.x - byX;
        int tmpY = position.y - byY;
        position.x = tmpY;
        position.y = -tmpX;
        visited.add(this);
        for (Atom atom: children) {
            if (!visited.contains(atom)) {
                atom.rotateClockwise(byX, byY, visited);
            }
        }
    }

    private void rotateCounterClockwise(int byX, int byY, HashSet<Atom> visited) {
        int tmpX = position.x - byX;
        int tmpY = position.y - byY;
        position.x = -tmpY;
        position.y = tmpX;
        visited.add(this);
        for (Atom atom: children) {
            if (!visited.contains(atom)) {
                atom.rotateClockwise(byX, byY, visited);
            }
        }
    }

    @Override
    public String toString() {
        return String.format("%s (%d, %d)", element.toString(), position.x, position.y);
    }

}
