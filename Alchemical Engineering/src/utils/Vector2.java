package utils;

import java.util.Objects;

public class Vector2 {
    public int x;
    public int y;

    public Vector2(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        return ((Vector2) o).x == x && ((Vector2) o).y == y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }

    public Vector2 add(Vector2 v) {
        return new Vector2(x + v.x, y + v.y);
    }

    public Vector2 add(int vx, int vy) {
        return new Vector2(x + vx, y + vy);
    }
}
