# FEND-P7-Neighborhood-Map
It is a user friendly App for displaying the annotation of key locations nearby my living space.
## How did I built the app
The structure is similiar to Cat Clicks App: https://github.com/JamesWangbrothers/Cat-Click-App.git

1. Integrate the google map API https://developers.google.com/maps/documentation/javascript/
2. Build three major parts: search bar, key locations, map markers
	* **search bar**: The search has the functino of filtering the model, which decide which part of the model is going to show. when typing words in search bar, key location and marker gets filtered and updated display immediately. Additional feature: auto-completion when search for something.
	* **key location**: takes the 10 names and items that I have defined in the model, and put them in the list view. additionaly when click the item marker, it highlights the particular item in the map, so you easily find these items in the map
	* **markers**: when click the selected marker in the map, it pops out a style and a window to show the little description of the item. Third-part API is used here to show the info.
3. Build the responsive design: 
    * using the bootstrap mobile-first framework
    * adding the event listener "resize" for responsive map
4. Error handling: adding Error handling for map is not displayed and location is not found
5. optimized the critical rendering path

## how to run the application
1. Check out the repository
2. To inspect the site on your phone, you can run a local server
  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```
3. Open a browser and visit localhost:8080

OR 

1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.
  ``` bash
  $> cd /path/to/your-project-folder
  $> ngrok http 8080
  ```
2. Open a browser and visit localhost:8080

## How to use the application
The map shows the neighborhood area where I work and live. If you want either want to find out more about myself or the location, please feel free to click the "here" and the bottom of the page and send a email to me to keep in touch!
Otherwise, please feel free to play with the app and provide me a feedback on how to improve it or what you think about it if you like. The app is easily to play with, you can type anything in the search bar, and the result will be filtered and displayed on the list and map. And if you click he list or the marker on the map, the detail information will pop up! Enjoy and cheer up!


