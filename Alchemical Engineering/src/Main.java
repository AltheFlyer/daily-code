import game.Atom;
import game.Game;
import interactions.Transmutor;
import utils.Vector2;
import window.GameWindow;
import window.LevelPanel;

public class Main {
    public static void main(String[] args) {

        Atom a = new Atom(0, 0);
        Atom b = new Atom(0, 1);
        Atom c = new Atom(-1, 1);
        Atom d = new Atom(1, 1);

        b.connect(a);
        b.connect(c);
        d.connect(b);

        a.rotateClockwise();

        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
        System.out.println(d);

        Game game = new Game();
        game.atoms.put(a.position, a);
        game.atoms.put(b.position, b);
        game.atoms.put(c.position, c);
        game.atoms.put(d.position, d);

        game.map.add(new Transmutor(game, new Vector2(1, 1)));
        game.tick();

        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
        System.out.println(d);


        GameWindow window = new GameWindow();
        window.setPanel(new LevelPanel(game));
    }
}
