# word-search game

Todo: </br>
- GUI overhaul. </br>
- Allow word overlapping only if letter matches, maximum of 1 letter overlapp will be allowed.</br>
- Allow user to define name.</br>
- Track player score with localStorage.</br>
- Create Backend with node-express to store data in MongoDb.</br>
- Code clean up and add more comments.</br>
</br>
Known issues: </br>
- Cell component seems very heavy in logic which can be reused in other parts maybe.</br>
- After you click on show answers, need to set all words to solved. </br>
- If game is too small, can cause infinite loop (because words dont fit)</br>
</br>
Fixed issues: </br>
- Words still overlap eachother on game generation. (need to work on collision detection). </br>
  
by Rolf Bansbach
