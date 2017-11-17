# supercold.github.io
A 2D version of the game SuperHot

###Javascript Functions

When the program begins by user click, a function is called to get the current accelerometer X and Y values to create an offset for later calculations and also starts the refresh rate interval.

`checkKeyDown(e)`: Checks if a key has been pressed and then parses whether the key was up, down, left, or right. For each direction, the function `setYRate` or `setXRate` is called on an interval to increase or decrease the change in X or Y.

`checkKeyUp(e)`: Checks if a key has been released and depending on that key, it will clear the refresh interval for that key. (If up key is released, only the setYRate for the up key will stop).

`draw()`: The main function that draws and refreshes the canvas with all objects.

`checkWall()`: Checks the internal borders for player collision and sets players current position to border edge if player out of bounds.

`checkBulletWallCollision()`: Checks all bullets for collisions with the wall boundaries, and if true, respawns the bullet at the corresponding enemy

`newBullet(enemyX,enemyY,bulletArrayLoc)`: takes the X and Y position of the enemy and sets the bullet to that location
