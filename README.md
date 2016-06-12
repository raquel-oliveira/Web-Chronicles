# Team C

Browser Chronicles - A browser-based gamebook platform. [More Info](https://d1b10bmlvqabco.cloudfront.net/attach/iok9b721bcu3i/ijibz99cthmum/ip34gelvqiuo/Track.pdf) 

![alt tag](app/images/books.jpg?raw=true "Chronicles")


## Set up environment ##
------------------------

Run `npm install`
Run `bower install`

## Build & development ##
--------------------------

Run `grunt` for building and `grunt serve` for preview.

## Testing ##
--------------

Running `grunt test` will run the unit tests with karma.


## Tags ##

### vFinal ###

In this tag it's possible to see:

* Some stories by default to test the application
* The play view loads the story corresponding to a parameter given in the URL. Example: `http://localhost:9000/#/play/disappointment`
* The show view loads the story corresponding to a parameter given in the URL. Example: `http://localhost:9000/#/show/disappointment`
* About the show view:
   * By default, every story starts in the node 0
   * Every node of type end it's fill by a color (Green if it's a happy ending, red otherwise).
   * To know information about the node, click on it. These information will appear on the bottom of the graph.
   * If there is no path from the start to the victory, it show a warning (message with red color).
* About the play view:
   * When the game is finished a big colored text will appear informing if he wins or not.
   * In case of victory, a short sentence inform the player about the number of steps he did and the minimum number of steps required from the start to a successful end.
* Riddle answer flexibility
  In this version, when the player tries to give a answer of a step of type riddle, its shows the distance based in Levenshtein (purely lexical, that means if the answer is "LEFT" and the player typer "left", the distance == 4). A better approach it's done in the tag evolution.
* Rich text
  The stories' description accept html format. 



### evolution ###

In this tag we have the same base of the content in the tag vFinal, but with some evolutions as:

* Persistence
   * After the player starts to play a story, if he return to the mais page `http://localhost:9000/#/` a button will appear that can redictly him to continue the story. If he already play the story he can not do it again (in the same session, needs to restart the server(this way the data is clean)). 
* Riddle with flexibility
   * This time, the game accepts answer closes, exemple: the ansr is: "left", it accepts "l  #éft$@"

## Mainteneurs ##
------------------

Mainteneurs actuels

* [Dalie Basil](mailto:dalie.basil@gmail.com)
* [Jacquot Flavian](mailto:flavian.jacquot@gmail.com)
* [Lopes de Oliveira Raquel](mailto:oliveira.raquel.lopes@gmail.com)
* [Merino Mathieu](mailto:mathieu.merino@outlook.com)

Ce projet a été parrainé par

* Polytech Nice Sophia
