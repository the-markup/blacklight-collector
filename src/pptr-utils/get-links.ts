export const getLinks = async page => {
  const links_with_duplicates = await page.evaluate(() => {
    return [].map
      .call(document.querySelectorAll("a[href]"), a => {
        return {
          href: a.href.split("#")[0], // link without fragment
          inner_text: a.innerText,
          inner_html: a.innerHTML.trim()
        };
      })
      .filter(link => {
        return link.href.startsWith("http");
      });
  });

  // https://dev.to/vuevixens/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
  const links = Array.from(
    new Set(links_with_duplicates.map(link => link.href))
  ).map(href => {
    return links_with_duplicates.find(link => link.href === href);
  });

  return links;
};
