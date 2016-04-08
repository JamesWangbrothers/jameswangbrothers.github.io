## Website Performance Optimization portfolio project

It is a challenge I have accepted to optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques I've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

To get started, check out the repository, inspect the code,

### Getting started

####Part 1: Optimize PageSpeed Insights score for index.html

Some useful tips to help you get started:

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ngrok http 8080
  ```

1. Copy the public URL ngrok gives you and try running it through PageSpeed Insights! Optional: [More on integrating ngrok, Grunt and PageSpeed.](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/)

Profile, optimize, measure... and then lather, rinse, and repeat. Good luck!

####Part 2: Optimize Frames per Second in pizza.html

To optimize views/pizza.html, you will need to modify views/js/main.js until your frames per second rate is 60 fps or higher. You will find instructive comments in main.js. 

You might find the FPS Counter/HUD Display useful in Chrome developer tools described here: [Chrome Dev Tools tips-and-tricks](https://developer.chrome.com/devtools/docs/tips-and-tricks).

### Optimize the Critical Rendering Path
**1. Make non-block rendering for CSS and Javascripts before </body> tag in the "index.html".**
* Adding async to javascript tag which makes it says, "I don't want the browser to stop what it's doing while it's downloading this script." It works the same to put the javascript link at the bottom of the page like below.
* <noscript> tage makes the css to load asynchronously.
* The critical path CSS is created by using this online tool: https://jonassebastianohlsson.com/criticalpathcssgenerator/

	``` bash
   		<!-- asynchronously load the crtical css -->
        <link href="css/style.min.css" rel="stylesheet">
        <link href="css/print.min.css" rel="stylesheet" media="print">
        // make non-block rendering Javascripts
        <script>
            (function(w, g) {
                w['GoogleAnalyticsObject'] = g;
                w[g] = w[g] || function() {
                    (w[g].q = w[g].q || []).push(arguments)
                };
                w[g].l = 1 * new Date();
            })(window, 'ga');
        </script>
        <script async src="js/perfmatters.js"></script>
     </body>
    ```
**2. Resize and compress the images for fast loading.**

I used the free image optimizer tools online: http://jpeg-optimizer.com/ 

There are also other great tools to use online:
* http://www.imageoptimizer.net/Pages/Home.aspx
* http://jpeg-optimizer.com/
* http://mashable.com/2013/10/29/image-compressors/#rDkIhR44GPqV

**3. Minimize the CSS for fast loading.**
Using online CSS minimizing tool: https://cssminifier.com/

### Optimize the Frame Rate
By reviewing the Timeline in WebTools, the bottleneck of the FPS is when calling the update Position. Here is my revise to the updatePosition() function below:

	``` bash
	var items = document.getElementsByClassName('mover');

  	var tops = document.body.scrollTop / 1250;

  	//make a for loop for phase to give a exact number that phase and document.body.scrollTop give per iteration
  	var phases = [];
  	for (var i = 0; i < 5; i++) {
    	phases.push(Math.sin(tops + i));
  	}

  	var phase;
  	for (var i = 0; i < items.length; i++) {
    	phase = phases[i%5];
    
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  	}
  	```
### Optimize the Computation Efficiency
**1. Faster Web API calls**

	``` bash
	document.getElementById() or document.getElementByClassName()
	```

	instead of

	``` bash
	document.querySelector() or document.querySelectorAll()
	```
**2. Provide fixed value for newwidth and dx.**

At line 473 and 474, since the pizza sizes are all the same, you can provide a fixed value prior starting the iteration/loop for both variables. Perhaps the first selector ([0]) from the randomPizzaContainer variable. 

	``` bash
	var dx = determineDx(container[0], size);
    var newwidth = (container[0].offsetWidth + dx) + 'px';

    for (var i = 0; i < containerLength; i++) {
      container[i].style.width = newwidth;
    }
    ```
Same reason for document.getElementsByClassName('randomPizzaContainer') at line 467.

    ``` bash
    //create a local variable to save document.getElementsByClassName('randomPizzaContainer') 
    var container = document.getElementsByClassName('randomPizzaContainer');

    //save the array length in local variable, so the array'e length property is not accessed to check its value at each iteration. It is more efficiency.
    var containerLength = container.length;
    ```

Same reason for pizzasDiv at line 494.

    ``` bash
    var pizzasDiv = document.getElementById('randomPizzas');
    ```

Same reason for elem at line 598, and same reason for movingPizzas at line 600

**3. Dynamically calculations

I could only handful a pizza that show up on the screen at any given scroll, that amount doesn't look dynamically calculate the number of pizza needed to fill the screen.

	``` bash
  var pizzaRows = window.innerHeight / 100;
  var pizzaCols = window.innerWidth / 73.333;

  //Declaring the elem variable outside the loop will prevent it from being created every time the loop is executed.
  var elem;
  //document.getElementById() Web API call is faster.
  var movingPizzas = document.getElementById("movingPizzas1");
  for (var i = 0; i < (pizzaRows * pizzaCols); i++) {
    elem = document.createElement('img');
    ...
   ```

### Optimization Tips and Tricks
* [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/ "web performance")
* [Analyzing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp.html "analyzing crp")
* [Optimizing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path.html "optimize the crp!")
* [Avoiding Rendering Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css.html "render blocking css")
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Measuring with Navigation Timing](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp.html "nav timing api"). We didn't cover the Navigation Timing API in the first two lessons but it's an incredibly useful tool for automated page profiling. I highly recommend reading.
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/eliminate-downloads.html">The fewer the downloads, the better</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer.html">Reduce the size of text</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization.html">Optimize images</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching.html">HTTP caching</a>

### Customization with Bootstrap
The portfolio was built on Twitter's <a href="http://getbootstrap.com/">Bootstrap</a> framework. All custom styles are in `dist/css/portfolio.css` in the portfolio repo.

* <a href="http://getbootstrap.com/css/">Bootstrap's CSS Classes</a>
* <a href="http://getbootstrap.com/components/">Bootstrap's Components</a>

### Sample Portfolios

Feeling uninspired by the portfolio? Here's a list of cool portfolios I found after a few minutes of Googling.

* <a href="http://www.reddit.com/r/webdev/comments/280qkr/would_anybody_like_to_post_their_portfolio_site/">A great discussion about portfolios on reddit</a>
* <a href="http://ianlunn.co.uk/">http://ianlunn.co.uk/</a>
* <a href="http://www.adhamdannaway.com/portfolio">http://www.adhamdannaway.com/portfolio</a>
* <a href="http://www.timboelaars.nl/">http://www.timboelaars.nl/</a>
* <a href="http://futoryan.prosite.com/">http://futoryan.prosite.com/</a>
* <a href="http://playonpixels.prosite.com/21591/projects">http://playonpixels.prosite.com/21591/projects</a>
* <a href="http://colintrenter.prosite.com/">http://colintrenter.prosite.com/</a>
* <a href="http://calebmorris.prosite.com/">http://calebmorris.prosite.com/</a>
* <a href="http://www.cullywright.com/">http://www.cullywright.com/</a>
* <a href="http://yourjustlucky.com/">http://yourjustlucky.com/</a>
* <a href="http://nicoledominguez.com/portfolio/">http://nicoledominguez.com/portfolio/</a>
* <a href="http://www.roxannecook.com/">http://www.roxannecook.com/</a>
* <a href="http://www.84colors.com/portfolio.html">http://www.84colors.com/portfolio.html</a>
