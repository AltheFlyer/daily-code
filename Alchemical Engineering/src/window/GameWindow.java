package window;

import javax.swing.*;

public class GameWindow extends JFrame {

    JPanel currentPanel;

    public GameWindow() {
        currentPanel = new JPanel();

        add(currentPanel);

        setSize(600, 600);

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
    }

    public void setPanel(GamePanel panel) {
        this.remove(currentPanel);

        this.currentPanel = panel;
        add(currentPanel);

        revalidate();
    }
}
