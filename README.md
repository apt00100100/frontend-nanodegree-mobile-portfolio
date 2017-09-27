# Website Performance Optimization portfolio project

#### Desktop PSI Score: 97
#### Mobile PSI Score: 91

---
---

### Local Setup

The project can be found on github [here](https://github.com/apt00100100/frontend-nanodegree-mobile-portfolio)

##### Follow these steps to build the project:

1. Clone the project locally
```
$   git clone https://github.com/apt00100100/frontend-nanodegree-mobile-portfolio.git
```
2. Install node modules
```
$   npm install
```
3. Install gulp globally if you haven't already done so
```
$   npm install -g gulp
```
4. To build the project and run PageSpeec Insights (PSI), run the following command:
```
$   gulp
```
5. The entry point of the final project can be found here:
```
    dist/
        index.html
```

### Refactors

#### index.html

* I built gulp tasks to minify the js, css, and html files, this reduces number of bytes per file.

* I added the appropriate media tags to all referenced css files (where appropriate)

* I added the async keyword when loading the javascript file.

* The images referenced are all local to the project, and sized accordingly.

#### main.js

* I started by scanning the file and moving DOM queries outside of loops.

* Running the dev tools profiler I was able to find the methods that were taxing the browser:

    * **resizePizzas()**: This method was working way too hard. I refactored the inner function *changePizzaSizes()* to be only be called once, and it does not require any calls to the elements layout.

    * **updatePositions()**: This method is called once per scroll event; the inner logic was simplified by reducing the number of calls to the element layout, and by calculating variables in advance rather than inline.

* It's also worth noting that I changed the pizza size selector to a dropdown input on account the range slider was not working on my mobile device.