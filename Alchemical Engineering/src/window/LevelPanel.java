package window;

import game.Atom;
import game.Game;
import interactions.Interactable;

import java.awt.*;

public class LevelPanel extends GamePanel {

    Game game;

    public LevelPanel(Game game) {
        this.game = game;
    }

    @Override
    public void paintComponent(Graphics g) {
        g.setColor(Color.BLUE);
        for (Atom a: game.atoms.values()) {
            for (Atom c: a.children) {
                g.drawLine(a.position.x * 50 + 20, a.position.y * 50 + 20, c.position.x * 50 + 20, c.position.y * 50 + 20);
            }
        }

        for (Atom a: game.atoms.values()) {
            g.fillOval(a.position.x * 50, a.position.y * 50, 40, 40);
        }
        for (Interactable item: game.map) {

        }
    }
}
