# FEND-P7-Neighborhood-Map

## how I built the app
The structure is similiar to Cat Clicks App: (https://github.com/JamesWangbrothers/Cat-Click-App.git)

1. integrate google map API
2. build three major parts: search bar, key locations, map contenting markers for these key locations
	* search bar
		The search has the functino of filtering the model, which decide which part of the model is going to show. when typing words in search bar, key location and marker gets filtered and updated display immediately. Additional feature: auto-completion when search for something.
	* key location
		takes the 10 names and items that I have defined in the model, and put them in the list view. additionaly when click the item marker, it highlights the particular item in the map, so you easily find these items in the map
	* markers
		when click the selected marker in the map, it pops out a style and a window to show the little description of the item. Third-part API is used here to show the info.
3. build the responsive design
4. error handling
5. optimized the critical rendering path

## how to use the app
