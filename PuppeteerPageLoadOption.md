# **Puppeteer Page Load Event Options Analysis**

While investigating timeout issues in the Blacklight tool, we explored tweaking Puppeteer's `waitUntil` option for when to consider a page done loading. Different values result in tradeoffs between speed, completeness, and reliability.

To evaluate the options, we created the following comparison table summarizing the advantages and disadvantages of each setting based on our testing:

The key options we evaluated were:

- `'load'` - Wait for full page load
- `'domcontentloaded'` - Wait for DOM only
- `'networkidle0'` - Wait for no network activity
- `'networkidle2'` - Wait for 2 or fewer connections

In the end, no single option solved the timeout issues completely. However, these notes capture our analysis of the tradeoffs between the different strategies.

We ultimately combined multiple approaches for the optimal solution. But this table represents a piece of the investigative journey to better understand Puppeteer page load behavior.

Now here is the comparison table:

| Options            	| Advantages                                                                                                                                                       	| Disadvantages                                                                                                                                                                                                                                              	|
|--------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `load`             	| - Ensures all resources are fully loaded.<br> - Straightforward and easy to understand.                                                                          	| - Can result in longer load times.<br> - Can result in unnecessary waiting if our script doesn't interact with or depend on all resources.<br> - If any resource fails to load, the `load` event will not fire, and Puppeteer will wait until the timeout. 	|
| `domcontentloaded` 	| - Faster than `load` because it doesn't wait for stylesheets, images, and subframes to finish loading.<br> - Suitable if our script only interacts with the DOM. 	| - If our script interacts with or depends on resources that load after the DOM, it might run before these resources are ready.                                                                                                                             	|
| `networkidle0`     	| - Useful for pages that load additional resources after the load event.<br> - Waits until there are no more network connections for at least 500 ms.             	| - Can result in longer load times.<br> - If the page continuously makes new network requests, the `networkidle0` event might never occur, and Puppeteer will wait until the timeout.                                                                       	|
| `networkidle2`     	| - Similar to `networkidle0`, but allows for up to 2 network connections.<br> - Useful for pages that keep a couple of connections open indefinitely.             	| - Can result in longer load times. <br> - If the page continuously makes more than 2 new network requests, the `networkidle`' event might never occur, and Puppeteer will wait until the timeout.                                                          	|